import { Request, Response } from "express";
import { getManager } from "typeorm";
import { CompanyProfile } from "../entities/CompanyProfile.entity";
import { upload } from "../middlewares/multerConfig";
import multer from "multer";
import * as fs from "fs";

// boilerplate code
export const getCompanyProfile = async (req: Request, res: Response) => {
  const entityManager = getManager();
  const companyProfile = await entityManager.findOne(CompanyProfile);
  if (!companyProfile) {
    return res.status(404).send("Company Profile not found");
  }
  return res.send(companyProfile);
};

// boilerplate code

const uploadMultiple = upload.fields([
  { name: "image_link" },
  { name: "history_image_link" },
]);

export const createCompanyProfile = async (req: Request, res: Response) => {
  uploadMultiple(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    const {
      image_name,
      title,
      description,
      short_description,
      address,
      email,
      phone,
      history_image_name,
      history_title,
      history_description,
      history_short_description,
    } = req.body;
    if (req.files) {
      const files = req.files as any;
      const entityManager = getManager();
      const companyProfile = entityManager.create(CompanyProfile, {
        image_name,
        image_link: files.image_link[0].path,
        title,
        description,
        short_description,
        history_image_name,
        history_title,
        history_description,
        history_short_description,
        history_image_link: files.history_image_link[0].path,
        address,
        email,
        phone,
      });
      let result = await entityManager.save(companyProfile);
      if (!result) {
        return res.status(500).send("Error creating company profile");
      }
      return res.status(201).json({
        message: "success creating company profile",
        result,
      });
    } else {
      // TODO Implement better error handling
      return res.status(500).json({
        message: "Error uploading file",
      });
    }
  });
};

// boilerplate code
export const updateCompanyProfile = async (req: Request, res: Response) => {
  let { id } = req.params;
  uploadMultiple(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    const {
      image_name,
      title,
      description,
      short_description,
      address,
      email,
      history_image_name,
      history_title,
      history_description,
      history_short_description,
    } = req.body;
    if (req.files) {
      const files = req.files as any;
      const entityManager = getManager();
      const companyProfile = await entityManager.findOne(CompanyProfile, id);
      if (!companyProfile) {
        return res.status(404).send("Company Profile not found");
      }
      const oldImage = companyProfile.image_link;
      //   const fs = require("fs");
      fs.unlink(oldImage, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("successfully deleted");
      });

      companyProfile.image_name = image_name;
      companyProfile.image_link = files.image_link[0].path;
      companyProfile.title = title;
      companyProfile.description = description;
      companyProfile.short_description = short_description;
      companyProfile.address = address;
      companyProfile.email = email;
      
      companyProfile.history_image_name=history_image_name;
      companyProfile.history_title=history_title;
      companyProfile.history_description=history_description;
      companyProfile.history_short_description=history_short_description;
      companyProfile.history_image_link=files.history_image_link[0].path;

      let result = await entityManager.save(companyProfile);
      if (!result) {
        return res.status(500).send("Error updating company profile");
      }
      return res.status(200).json({
        message: "success updating company profile",
        result,
      });
    } else {
      const entityManager = getManager();
      const companyProfile = await entityManager.findOne(CompanyProfile, id);
      if (!companyProfile) {
        return res.status(404).send("Company Profile not found");
      }

      const files = req.files as any;
      companyProfile.image_name = image_name
        ? image_name
        : companyProfile.image_name;
      companyProfile.image_link = companyProfile.image_link;
      companyProfile.title = title;
      companyProfile.description = description;
      companyProfile.short_description = short_description;
      companyProfile.address = address;
      companyProfile.email = email;
      companyProfile.history_image_name=history_image_name;
      companyProfile.history_title=history_title;
      companyProfile.history_description=history_description;
      companyProfile.history_short_description=history_short_description;
      companyProfile.history_image_link=companyProfile.history_image_link;

      let result = await entityManager.save(companyProfile);
      if (!result) {
        return res.status(500).send("Error updating company profile");
      }
      return res.status(200).json({
        message: "success updating company profile",
        result,
      });
    }
  });
};
