import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import multer from "multer";
import { Slider } from "../entities/Slider.entity";
import { upload } from "../middlewares/multerConfig";

// Add slider Image , slider text and slider description

export const uploadSliderImage = async (req: Request, res: Response) => {
  console.log("req.body", req.body);
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    const { name, title, description, show_on_home } = req.body;

    console.log("reqbody", req.body);
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

export const updateSliderImageById = async (req: Request, res: Response) => {};
