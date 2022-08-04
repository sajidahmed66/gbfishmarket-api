import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import multer from "multer";
import { Logo } from "../entities/Logo.entity";
import { upload } from "../middlewares/multerConfig";
import { cloudinary } from "../middlewares/multerConfig";

export const uploadLogo = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    const { name } = req.body;
    if (req.file) {
      const manager = getManager();
      const newLogo = manager.create(Logo, {
        name,
        file_link: req.file.path,
        cloudinary_public_id: req.file.filename,
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
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    const manager = getManager();
    const logo = await manager.findOne(Logo, id);

    // if requested logo not found
    if (!logo) {
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename, (error:any, result:any) => {});
      }
      return res.status(404).json({
        message: "Logo not found",
      });
    }

    // if logo found
    if (req.file) {
      let old_image_public_id = logo.cloudinary_public_id;
      const updatedLogo = await manager.update(Logo, id, {
        name,
        file_link: req.file.path,
        cloudinary_public_id: req.file.filename,
      });
      if (!updatedLogo) {
        return res.status(500).json({
          message: "Error updating logo",
        });
      }
      cloudinary.uploader.destroy(
        old_image_public_id,
        function (error:any, result:any) {
          console.log({ result, error }); // result is an array
        }
      );
      return res.status(200).json({
        message: "success updating logo",
      });
    }
  });
};
