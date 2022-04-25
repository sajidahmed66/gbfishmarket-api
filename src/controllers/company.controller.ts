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
export const createCompanyProfile = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
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
    } = req.body;
    if (req.file) {
      const entityManager = getManager();
      const companyProfile = await entityManager.create(CompanyProfile, {
        image_name,
        image_link: req.file.path,
        title,
        description,
        short_description,
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
  upload.single("file")(req, res, async (error) => {
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
    } = req.body;
    if (req.file) {
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
      companyProfile.image_link = req.file.path;
      companyProfile.title = title;
      companyProfile.description = description;
      companyProfile.short_description = short_description;
      companyProfile.address = address;
      companyProfile.email = email;

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

      companyProfile.image_name = image_name
        ? image_name
        : companyProfile.image_name;
      // companyProfile.image_link = req.file.path;
      companyProfile.title = title;
      companyProfile.description = description;
      companyProfile.short_description = short_description;
      companyProfile.address = address;
      companyProfile.email = email;

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
