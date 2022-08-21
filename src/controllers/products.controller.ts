import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Products } from "../entities/Products.entity";
import { upload, cloudinary } from "../middlewares/multerConfig";
import multer from "multer";
//create a product
export const createProduct = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    const {
      title,
      subtitle,
      short_description,
      long_description,
      image_name,
      show_on_home,
      client_id,
    } = req.body;

    if (req.file) {
      const entityManager = getManager();
      const product = await entityManager.create(Products, {
        title,
        subtitle,
        short_description,
        long_description,
        image_name,
        show_on_home: show_on_home === "true" ? true : false,
        client: client_id,
        image_link: req.file.path,
        cloudinary_public_id: req.file.filename,
      });
      let result = await entityManager.save(product);
      if (!result) {
        // delete file from cloudinary
        if (req.file) {
          cloudinary.uploader.destroy(req.file.filename, (error, result) => {});
        }
        return res.status(500).send("Error creating product");
      }
      return res.status(201).json({
        message: "success creating product",
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

// get all products

export const getAllProducts = async (req: Request, res: Response) => {
  const entityManager = getManager();
  const products = await entityManager.find(Products);
  if (!products) {
    return res.status(404).send("NO Products was found");
  }
  return res.status(200).send(products);
};

// get product by id
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const entityManager = getManager();
  const product = await entityManager.findOne(Products, id);
  if (!product) {
    return res.status(404).send("Product not found");
  }
  return res.status(200).send(product);
};

//update product by id
export const updateProductById = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    const { id } = req.params;
    if (error instanceof multer.MulterError) {
      return res.send(500).json({
        message: "Error uploading file",
      });
    }
    const entityManager = getManager();
    const product = await entityManager.findOne(Products, id);

    if (!product) {
      if (req.file) {
        cloudinary.uploader.destroy(req.file.filename, (error, result) => {});
      }
      return res.status(404).send("Product not found");
    }
    if (req.file) {
      let old_image_public_id = product.cloudinary_public_id;
      const {
        title,
        subtitle,
        short_description,
        long_description,
        image_name,
        show_on_home,
        client_id,
      } = req.body;
      const updatedProduct = await entityManager.update(Products, id, {
        title,
        subtitle,
        short_description,
        long_description,
        image_name,
        show_on_home: show_on_home === "true" ? true : false,
        client: client_id,
        image_link: req.file.path,
        cloudinary_public_id: req.file.filename,
      });
      if (!updatedProduct) {
        if (req.file) {
          cloudinary.uploader.destroy(req.file.filename, (error, result) => {});
        }
        return res.status(500).send("Error updating product");
      }
      cloudinary.uploader.destroy(
        old_image_public_id,
        function (error, result) {
          // console.log({ result, error }); // result is an array
        }
      );
      const newProduct = await entityManager.findOne(Products, id);
      return res.status(200).json({
        message: "success updating product",
        result: newProduct,
      });
    } else {
      const {
        title,
        subtitle,
        short_description,
        long_description,
        image_name,
        show_on_home,
        client_id,
      } = req.body;
      console.log(show_on_home);
      const updatedProduct = await entityManager.update(Products, id, {
        title,
        subtitle,
        short_description,
        long_description,
        image_name,
        show_on_home: show_on_home === "true" ? true : false,
        client: client_id,
      });
      if (!updatedProduct) {
        return res.status(500).send("Error updating product");
      }
      const newProduct = await entityManager.findOne(Products, id);

      return res.status(200).json({
        message: "success updating product",
        result: newProduct,
      });
    }
  });
};

// delete product by id
export const deleteProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const entityManager = getManager();
  const product = await entityManager.findOne(Products, id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  const old_image_public_id = product.cloudinary_public_id;

  const deletedProduct = await entityManager.delete(Products, id);
  if (!deletedProduct) {
    return res.status(500).send("Error deleting product");
  }
  cloudinary.uploader.destroy(old_image_public_id, (error, result) => {});
  return res.status(200).json({
    message: "success deleting product",
  });
};
