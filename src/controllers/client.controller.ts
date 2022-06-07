import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Client } from "../entities/Clients.entity";
import { upload } from "../middlewares/multerConfig";
import multer from "multer";
import * as fs from "fs";

export const createClient = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    if (req.file) {
      let {
        name,
        company_name,
        location_lat,
        location_long,
        location_address,
        company_description,
        logo_image_name,
      } = req.body;
      const manager = getManager();
      const newClient = new Client();
      newClient.name = name;
      newClient.company_name = company_name;
      newClient.location_lat =
        typeof location_lat === "string" ? parseInt(location_lat) : 0;
      newClient.location_long =
        typeof location_long === "string" ? parseInt(location_long) : 0;
      newClient.location_address = location_address;
      newClient.company_description = company_description;
      newClient.logo_image_name = logo_image_name;
      newClient.logo_image_link = req.file.path;
      // const newClient = manager.create(Client, {
      //   name,
      //   company_name,
      //   location_lat,
      //   location_long,
      //   location_address,
      //   company_description,
      //   logo_image_name,
      //   logo_image_link: req.file.path,
      // });
      let result = await manager.save(newClient);
      if (!result) {
        return res.status(500).json({
          message: "Error creating client",
        });
      }
      return res.status(200).json({
        message: "success creating client",
      });
    } else {
      return res.status(500).json({
        message: "Error uploading file",
      });
    }
  });
};

export const getAllClient = async (req: Request, res: Response) => {
  console.log("getAllClient");
  const manager = getManager();
  let clients = await manager.find(Client);
  console.log(clients.length);
  if (clients.length === 0) {
    return res.status(500).json({
      message: "Error getting clients",
    });
  }
  return res.status(200).json({
    message: "success",
    clients,
  });
};

export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = getManager();
  let client = await manager.findOne(Client, id);

  if (!client) {
    return res.status(500).json({
      message: "client not found",
    });
  }
  return res.status(200).json({
    message: "success",
    client,
  });
};

export const updateClientById = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    const { id } = req.params;
    const {
      name,
      company_name,
      location_lat,
      location_long,
      location_address,
      company_description,
      logo_image_name,
    } = req.body;
    const manager = getManager();
    let client = await manager.findOne(Client, id);
    if (!client) {
      return res.status(500).json({
        message: "client not found",
      });
    }
    client.name = name;
    client.company_name = company_name;
    client.location_lat = location_lat;
    client.location_long = location_long;
    client.location_address = location_address;
    client.company_description = company_description;
    client.logo_image_name = logo_image_name;
    if (req.file) {
      let oldImage = client.logo_image_link;
      // while this function is asyncronous, there is no need to use await as it does not return a promise(from my understanding)
      fs.unlink(oldImage, (err) => {
        if (err) {
          console.log(err);
        }
      });
      client.logo_image_link = req.file.path;
    }
    let result = await manager.save(client);
    if (!result) {
      return res.status(500).json({
        message: "Error updating client",
      });
    }
    return res.status(200).json({
      message: "success",
    });
  });
};

export const deleteClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = getManager();
  let client = await manager.findOne(Client, id);
  if (!client) {
    return res.status(500).json({
      message: "client not found",
    });
  }
  let oldImage = client.logo_image_link;
  fs.unlink(oldImage, (err) => {
    if (err) {
      console.log(err);
    }
  });
  let result = await manager.delete(Client, id);
  if (!result) {
    return res.status(500).json({
      message: "Error deleting client",
    });
  }
  return res.status(200).json({
    message: "success",
  });
};
