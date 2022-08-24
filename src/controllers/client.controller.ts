import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Client } from "../entities/Clients.entity";
import { Products } from "../entities/Products.entity";
import { upload, cloudinary } from "../middlewares/multerConfig";
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
      newClient.cloudinary_public_id = req.file.filename;
      let result = await manager.save(newClient);
      if (!result) {
        cloudinary.uploader.destroy(req.file.filename, (error, result) => {});
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
    return res.status(404).json({
      message: "No clients Found",
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
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename, (error, result) => {});
      }
      return res.status(500).json({
        message: "client not found",
      });
    }
    let old_image_public_id = client.cloudinary_public_id;
    client.name = name;
    client.company_name = company_name;
    client.location_lat = location_lat;
    client.location_long = location_long;
    client.location_address = location_address;
    client.company_description = company_description;
    client.logo_image_name = logo_image_name;
    if (req.file) {
      client.logo_image_link = req.file.path;
      client.cloudinary_public_id = req.file.filename;
      cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
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

// bug with deleting client if there are products associated with it
export const deleteClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = getManager();
  let client = await manager.findOne(Client, id);
  if (!client) {
    return res.status(500).json({
      message: "client not found",
    });
  }
  let old_image_public_id = client.cloudinary_public_id;
  let result = await manager.delete(Client, id);
  if (!result) {
    return res.status(500).json({
      message: "Error deleting client",
    });
  }
  cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
  return res.status(200).json({
    message: "success deleting client",
  });
};

export const getClientProducts = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = getManager();
  let client = await manager.findOne(Client, id, { relations: ["products"] });
  if (!client) {
    return res.status(500).json({
      message: "client not found",
    });
  }
  return res.status(200).json({
    message: "success",
    products: client.products,
  });
};

export const updateClientProducts = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productsId, action } = req.body;
  const manager = getManager();
  let client = await manager.findOne(Client, id, { relations: ["products"] });
  if (!client) {
    return res.status(500).json({
      message: "client not found",
    });
  }
  let products = await manager.findOne(Products, productsId);
  if (!products) {
    return res.status(500).json({
      message: "product not found",
    });
  }
  if (action === "add") {
    client.products.push(products);
  }
  if (action === "remove") {
    client.products.splice(client.products.indexOf(products), 1);
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
};
