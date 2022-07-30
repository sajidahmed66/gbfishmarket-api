import { Request, Response } from "express";
import { getManager } from "typeorm";
import _ from "lodash";
import { CompanyProfile } from "../entities/CompanyProfile.entity";
import { cloudinary, upload } from "../middlewares/multerConfig";
import multer from "multer";
import * as fs from "fs";

interface fileType {
  image_link?: string[];
  history_image_link?: string[];
}
// boilerplate code
export const getCompanyProfile = async (req: Request, res: Response) => {
  const entityManager = getManager();
  const companyProfile = await entityManager.find(CompanyProfile, {
    order: { id: "ASC" },
  });
  if (!companyProfile) {
    return res.status(404).send("Company Profile not found");
  }
  return res.status(200).json({
    message: "success",
    data: companyProfile[0],
  });
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
    const { short_description, address, email, phone } = req.body;
    const entityManager = getManager();
    const companyProfile = entityManager.create(CompanyProfile);
    companyProfile.email = email;
    companyProfile.address = address;
    companyProfile.phone = phone;
    companyProfile.short_description = short_description;
    let result = await entityManager.save(companyProfile);
    if (!result) {
      return res.status(500).send("Error creating company profile");
    }
    return res.status(201).json({
      message: "success creating company profile",
      result,
    });
  });
};

// company will always be the first entity in the database
export const updateCompanyProfile = async (req: Request, res: Response) => {
  let { id } = req.params;
  uploadMultiple(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    // console.log(req.body);
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
    const entityManager = getManager();
    const companyProfile = await entityManager.findOne(CompanyProfile, id);
    if (!companyProfile) {
      return res.status(404).send("Company Profile not found");
    }
    companyProfile.email = email ? email : companyProfile.email;
    companyProfile.phone = phone ? phone : companyProfile.phone;
    companyProfile.address = address ? address : companyProfile.address;
    companyProfile.short_description = short_description
      ? short_description
      : companyProfile.short_description;
    companyProfile.description = description
      ? description
      : companyProfile.description;
    companyProfile.title = title ? title : companyProfile.title;
    companyProfile.history_title = history_title
      ? history_title
      : companyProfile.history_title;
    companyProfile.history_description = history_description
      ? history_description
      : companyProfile.history_description;
    companyProfile.history_short_description = history_short_description
      ? history_short_description
      : companyProfile.history_short_description;

    if (!_.isEmpty(req.files)) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files?.image_link && files?.image_link.length > 0) {
        companyProfile.image_cloudinary_public_id &&
          cloudinary.uploader.destroy(
            companyProfile.image_cloudinary_public_id,
            (error, result) => {}
          );
        companyProfile.image_link = files.image_link[0].path;
        companyProfile.image_name = image_name;
        companyProfile.image_cloudinary_public_id =
          files.image_link[0].filename;
      }
      if (files.history_image_link && files.history_image_link.length > 0) {
        companyProfile.history_image_cloudinary_public_id &&
          cloudinary.uploader.destroy(
            companyProfile.history_image_cloudinary_public_id,
            (error, result) => {}
          );
        companyProfile.history_image_link = files.history_image_link[0].path;
        companyProfile.history_image_name = history_image_name;
        companyProfile.history_image_cloudinary_public_id =
          files.history_image_link[0].filename;
      }
    } else {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }
    let result = await entityManager.save(companyProfile);
    if (!result) {
      return res.status(500).send("Error updating company profile");
    }
    return res.status(200).json({
      message: "success updating company profile",
    });
  });
};
