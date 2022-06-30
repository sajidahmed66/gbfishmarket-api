import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import multer from "multer";
import { Logo } from "../entities/Logo.entity";
import { upload } from "../middlewares/multerConfig";
import * as fs from "fs";

export const uploadLogo = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    const { name } = req.body;
    if (req.file) {
      console.log(req.file);
      const manager = getManager();
      const newLogo = manager.create(Logo, {
        name,
        file_link: req.file.path,
      });
      await manager.save(newLogo);
      return res.status(200).json({
        message: "success",
      });
    } else {
      // TODO new Error("Error uploading file");
      return res.status(500).json({
        message: "Error uploading file",
      });
    }
  });
};

export const getLogo = async (req: Request, res: Response) => {
  const manager = getManager();
  const logo = await manager.find(Logo, { order: { id: "ASC" } });
  if (!Logo) {
    return res.status(404).json({
      message: "Logo not found",
    });
  }
  return res.status(200).json({
    message: "success",
    data: logo[0],
  });
};

export const updateLogoById = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    let { id } = req.params;
    let { name } = req.body;
    console.log(req.body);
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    const manager = getManager();
    const logo = await manager.findOne(Logo, id);

    if (!logo) {
      if (req.file) {
        let image_path = req.file.path;
        fs.unlink(image_path, (err) => {
          if (err) {
            console.log(err);
          }
          console.log("successfully deleted");
        });
      }
      return res.status(404).json({
        message: "Logo not found",
      });
    }
    console.log(logo);

    if (req.file) {
      const oldImage = logo.file_link;
      fs.unlink(oldImage, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("successfully deleted");
      });
      const updatedLogo = await manager.update(Logo, id, {
        name,
        file_link: req.file.path,
      });
      if (!updatedLogo) {
        return res.status(500).json({
          message: "Error updating logo",
        });
      }
      return res.status(200).json({
        message: "success updating logo",
        result: updatedLogo,
      });
    }
  });
};
