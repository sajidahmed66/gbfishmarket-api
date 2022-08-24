import { Request, Response } from "express";
import { getManager } from "typeorm";
import { CategoryProducts } from "../entities/CategoryProducts.entity";
import { upload } from "../middlewares/multerConfig";
import multer from "multer";

import { cloudinary } from "../middlewares/multerConfig";
import _ from "lodash";

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
      const newCategory = manager.create(CategoryProducts, {
        title,
        image_name,
        show_on_home: show_on_home === "true" ? true : false,
        image_link: req.file.path,
        cloudinary_public_id: req.file.filename,
      });
      let result = await manager.save(newCategory);
      if (!result) {
        return res.status(500).json({
          message: "Error creating a new category",
        });
      }
      return res.status(200).json({
        message: "success creating a new category",
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
  console.log("getAllAnnouncement");
  const manager = getManager();
  let allcategories = await manager.find(CategoryProducts);
  if (allcategories.length === 0) {
    return res.status(500).json({
      message: "Error getting category/no category is found",
    });
  }
  return res.status(200).json({
    message: "success",
    categories: allcategories,
  });
};

export const updateCategoryProductById = async (
  req: Request,
  res: Response
) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    const { id } = req.params;
    const { title, image_name, show_on_home } = req.body;
    const manager = getManager();
    let category = await manager.findOne(CategoryProducts, id);
    if (!category) {
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename, (error, result) => {});
      }
      return res.status(500).json({
        message: "Cannot find category",
      });
    }
    // if category  is  found
    if (req.file) {
      let old_image_public_id = category.cloudinary_public_id;
      category.title = title;
      category.image_name = image_name;
      category.show_on_home = show_on_home === "true" ? true : false;
      category.image_link = req.file.path;
      category.cloudinary_public_id = req.file.filename;
      let result = await manager.save(category);

      if (!result) {
        return res.status(500).json({
          message: "Error updating category",
        });
      }
      cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
      return res.status(200).json({
        message: "success",
        result: category,
      });
    } else {
      // if no file uploaded but data to be updated
      category.title = title;
      category.image_name = image_name;
      category.show_on_home = show_on_home === "true" ? true : false;
      let result = await manager.save(category);
      if (!result) {
        return res.status(500).json({
          message: "Error updating category",
        });
      }
      return res.status(200).json({
        message: "success",
        result: category,
      });
    }
  });
};

// export const deleteCategoryProductById = async (
//   req: Request,
//   res: Response
// ) => {
//   const { id } = req.params;
//   const manager = getManager();
//   let category = await manager.findOne(CategoryProducts, id);
//   if (!category) {
//     return res.status(500).json({
//       message: "Cannot find category",
//     });
//   }
//   let old_image_public_id = category.cloudinary_public_id;
//   let result = await manager.delete(CategoryProducts, { id });

//   if (!result) {
//     return res.status(500).json({
//       message: "Error deleting category",
//     });
//   }
//   cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
//   return res.status(200).json({
//     message: "Category deleted",
//   });
// };
