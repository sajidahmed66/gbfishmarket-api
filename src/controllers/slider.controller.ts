import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import multer from "multer";
import { Slider } from "../entities/Slider.entity";
import { upload } from "../middlewares/multerConfig";
import * as fs from "fs";

// Add slider Image , slider text and slider description

export const uploadSliderImage = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    const { name, title, description, show_on_home } = req.body;
    if (req.file) {
      const manager = getManager();
      const newSliderImage = manager.create(Slider, {
        name,
        title,
        description,
        show_on_home: "true" ? true : false,
        file_link: req.file.path,
      });
      let result = await manager.save(newSliderImage);
      if (!result) {
        return res.status(500).send("Error creating Banner");
      }
      return res.status(201).json({
        message: "success creating Banner",
        result,
      });
    } else {
      // TODO new Error("Error uploading file");
      return res.status(500).json({
        message: "Error uploading file",
      });
    }
  });
};

// Get all sliders

export const getAllSliders = async (req: Request, res: Response) => {
  try {
    const entityManager = getManager();
    const result = await entityManager.find(Slider);
    if (!result) {
      return res.status(404).send("User not found");
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

// Get slider by Id

export const getSliderById = async (req: Request, res: Response) => {
  try {
    const { sliderId } = req.params;
    const entityManager = getManager();
    const result = await entityManager.findOne(Slider, sliderId);
    if (!result) {
      return res.status(404).send("Slider not found");
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

// Update slider By Id

export const updateSliderImageById = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    console.log("updateProductById");
    const { sliderId } = req.params;
    if (error instanceof multer.MulterError) {
      return res.send(500).json({
        message: "Error uploading file",
      });
    }
    const entityManager = getManager();
    const slider = await entityManager.findOne(Slider, sliderId);

    if (!slider) {
      return res.status(404).send("Slider not found");
    }
    if (req.file) {
      const oldImage = slider.file_link;
      fs.unlink(oldImage, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("successfully deleted");
      });
      const { name, title, description, show_on_home, file_link } = req.body;
      const updatedSlider = await entityManager.update(Slider, sliderId, {
        name,
        title,
        description,
        show_on_home: "true" ? true : false,
        file_link: req.file.path,
      });
      if (!updatedSlider) {
        return res.status(500).send("Error updating Slider");
      }
      return res.status(200).json({
        message: "success updating Slider",
        result: updatedSlider,
      });
    } else {
      const { name, title, description, show_on_home, file_link } = req.body;
      
      const updatedSlider = await entityManager.update(Slider, sliderId, {
        name,
        title,
        description,
        show_on_home: show_on_home === "true" ? true : false,
        file_link: file_link,
      });
      if (!updatedSlider) {
        return res.status(500).send("Error updating Slider");
      }
      return res.status(200).json({
        message: "success updating Slider",
        result: updatedSlider,
      });
    }
  });
};
