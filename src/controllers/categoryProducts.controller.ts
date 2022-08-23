import { Request, Response } from "express";
import { getManager } from "typeorm";
import { upload } from "../middlewares/multerConfig";
import multer from "multer";

import { cloudinary } from "../middlewares/multerConfig";
import _ from "lodash";
import { CategoryProducts } from "../entities/CategoryProducts.entity";

export const createCategoryProduct = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    if (req.file) {
      const { title, image_name, show_on_home } = req.body;
      const manager = getManager();
      const newCategoryProducts = manager.create(CategoryProducts, {
        title,
        image_name,
        show_on_home: show_on_home === "true" ? true : false,
        image_link: req.file.path,
        cloudinary_public_id: req.file.filename,
      });
      let result = await manager.save(newCategoryProducts);
      if (!result) {
        return res.status(500).json({
          message: "Error creating category products",
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

export const getAllCategoryProduct = async (req: Request, res: Response) => {
  const manager = getManager();
  let categoryProducts = await manager.find(CategoryProducts);
  console.log(categoryProducts.length);
  if (categoryProducts.length === 0) {
    return res.status(500).json({
      message: "Error getting categoryProducts/no categoryProducts found",
    });
  }
  return res.status(200).json({
    message: "success",
    categoryProducts: categoryProducts,
  });
};


export const getCategoryProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entityManager = getManager();
    const result = await entityManager.findOne(CategoryProducts, id);
    if (!result) {
      return res.status(404).send("Category products not found");
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

export const updateCategoryProductById = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    const { id } = req.params;
    const { title,  image_name, show_on_home } = req.body;
    const manager = getManager();
    let categoryProducts = await manager.findOne(CategoryProducts, id);
    if (!categoryProducts) {
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename, (error, result) => {});
      }
      return res.status(500).json({
        message: "Cannot find categoryProducts",
      });
    }
    // if categoryProducts found
    if (req.file) {
      let old_image_public_id = categoryProducts.cloudinary_public_id;
      categoryProducts.title = title;
      categoryProducts.image_name = image_name;
      categoryProducts.show_on_home = show_on_home === "true" ? true : false;
      categoryProducts.image_link = req.file.path;
      categoryProducts.cloudinary_public_id = req.file.filename;
      let result = await manager.save(categoryProducts);
      if (!result) {
        return res.status(500).json({
          message: "Error updating categoryProducts",
        });
      }
      cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
      return res.status(200).json({
        message: "success",
        result: categoryProducts,
      });
    } else {
      // if no file uploaded but data to be updated
      categoryProducts.title = title;
      categoryProducts.image_name = image_name;
      categoryProducts.show_on_home = show_on_home === "true" ? true : false;
      let result = await manager.save(categoryProducts);
      if (!result) {
        return res.status(500).json({
          message: "Error updating categoryProducts",
        });
      }
      return res.status(200).json({
        message: "success",
        result: categoryProducts,
      });
    }
  });
};

export const deleteCategoryProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = getManager();
  let categoryProducts = await manager.findOne(CategoryProducts, id);
  if (!categoryProducts) {
    return res.status(500).json({
      message: "Cannot find categoryProducts",
    });
  }
  let old_image_public_id = categoryProducts.cloudinary_public_id;
  let result = await manager.delete(CategoryProducts, { id });

  if (!result) {
    return res.status(500).json({
      message: "Error deleting categoryProducts",
    });
  }
  cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
  return res.status(200).json({
    message: "Category Products deleted",
  });
};
