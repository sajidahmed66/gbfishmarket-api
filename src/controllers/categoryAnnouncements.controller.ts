import { Request, Response } from "express";
import { getManager } from "typeorm";
import { upload } from "../middlewares/multerConfig";
import multer from "multer";

import { cloudinary } from "../middlewares/multerConfig";
import _ from "lodash";
import { CategoryAnnouncements } from "../entities/CategoryAnnouncements.entity";

export const createCategoryAnnouncement = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    if (req.file) {
      const { title, image_name, show_on_home } = req.body;
      const manager = getManager();
      const newCategoryAnnouncements = manager.create(CategoryAnnouncements, {
        title,
        image_name,
        show_on_home: show_on_home === "true" ? true : false,
        image_link: req.file.path,
        cloudinary_public_id: req.file.filename,
      });
      let result = await manager.save(newCategoryAnnouncements);
      if (!result) {
        return res.status(500).json({
          message: "Error creating category Announcements",
        });
      }
      return res.status(200).json({
        message: "success",
        result: result,
      });
    } else {
      return res.status(500).json({
        message: "Error uploading file",
      });
    }
  });
};

export const getAllCategoryAnnouncement = async (req: Request, res: Response) => {
  const manager = getManager();
  let categoryAnnouncements = await manager.find(CategoryAnnouncements);
  console.log(categoryAnnouncements.length);
  if (categoryAnnouncements.length === 0) {
    return res.status(500).json({
      message: "Error getting category Announcements/no categoryAnnouncements found",
    });
  }
  return res.status(200).json({
    message: "success",
    categoryAnnouncements: categoryAnnouncements,
  });
};


export const getCategoryAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entityManager = getManager();
    const result = await entityManager.findOne(CategoryAnnouncements, id);
    if (!result) {
      return res.status(404).send("Category Announcements not found");
    }
    return res.send(result);
  } catch (error) {
    console.log("Invalid Input", error);
    return res.status(400).json({
      msg: "Invalid Input",
      error,
    });
  }
};

export const updateCategoryAnnouncementById = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    const { id } = req.params;
    const { title,  image_name, show_on_home } = req.body;
    const manager = getManager();
    let categoryAnnouncements = await manager.findOne(CategoryAnnouncements, id);
    if (!categoryAnnouncements) {
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename, (error, result) => {});
      }
      return res.status(500).json({
        message: "Cannot find categoryAnnouncements",
      });
    }
    // if categoryAnnouncements found
    if (req.file) {
      let old_image_public_id = categoryAnnouncements.cloudinary_public_id;
      categoryAnnouncements.title = title;
      categoryAnnouncements.image_name = image_name;
      categoryAnnouncements.show_on_home = show_on_home === "true" ? true : false;
      categoryAnnouncements.image_link = req.file.path;
      categoryAnnouncements.cloudinary_public_id = req.file.filename;
      let result = await manager.save(categoryAnnouncements);
      if (!result) {
        return res.status(500).json({
          message: "Error updating categoryAnnouncements",
        });
      }
      cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
      return res.status(200).json({
        message: "success",
        result: categoryAnnouncements,
      });
    } else {
      // if no file uploaded but data to be updated
      categoryAnnouncements.title = title;
      categoryAnnouncements.image_name = image_name;
      categoryAnnouncements.show_on_home = show_on_home === "true" ? true : false;
      let result = await manager.save(categoryAnnouncements);
      if (!result) {
        return res.status(500).json({
          message: "Error updating category announcements",
        });
      }
      return res.status(200).json({
        message: "success",
        result: categoryAnnouncements,
      });
    }
  });
};

export const deleteCategoryAnnouncementById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = getManager();
  let categoryAnnouncements = await manager.findOne(CategoryAnnouncements, id);
  if (!categoryAnnouncements) {
    return res.status(500).json({
      message: "Cannot find category announcements",
    });
  }
  let old_image_public_id = categoryAnnouncements.cloudinary_public_id;
  let result = await manager.delete(CategoryAnnouncements, { id });

  if (!result) {
    return res.status(500).json({
      message: "Error deleting category announcements",
    });
  }
  cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
  return res.status(200).json({
    message: "Category announcements deleted",
  });
};
