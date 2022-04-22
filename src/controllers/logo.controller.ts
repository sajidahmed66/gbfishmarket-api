import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import multer from "multer";
import { Logo } from "../entities/Logo.entity";
import { upload } from "../middlewares/multerConfig";

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
