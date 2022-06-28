import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Products } from "../entities/Products.entity";
import { upload } from "../middlewares/multerConfig";
import multer from "multer";
import * as fs from "fs";

//create a product
export const createProduct = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    console.log(req.body);
    console.log(typeof req.body.show_on_home);
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
    console.log(typeof !!show_on_home);
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
      });
      let result = await entityManager.save(product);
      if (!result) {
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
    console.log("updateProductById");
    const { id } = req.params;
    if (error instanceof multer.MulterError) {
      return res.send(500).json({
        message: "Error uploading file",
      });
    }
    const entityManager = getManager();
    const product = await entityManager.findOne(Products, id);

    if (!product) {
      return res.status(404).send("Product not found");
    }
    if (req.file) {
      const oldImage = product.image_link;
      fs.unlink(oldImage, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("successfully deleted");
      });
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
      });
      if (!updatedProduct) {
        return res.status(500).send("Error updating product");
      }
      return res.status(200).json({
        message: "success updating product",
        result: updatedProduct,
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
      return res.status(200).json({
        message: "success updating product",
        result: updatedProduct,
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
  const oldImage = product.image_link;
  fs.unlink(oldImage, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("successfully deleted");
  });
  const deletedProduct = await entityManager.delete(Products, id);
  if (!deletedProduct) {
    return res.status(500).send("Error deleting product");
  }
  return res.status(200).json({
    message: "success deleting product",
  });
};
