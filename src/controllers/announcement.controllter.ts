import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Announcement } from "../entities/Announcement.entity";
import { upload } from "../middlewares/multerConfig";
import multer from "multer";
import * as fs from "fs";
import _ from "lodash";

export const createAnnouncement = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    if (req.file) {
      const { title, short_description, image_name, show_on_home } = req.body;
      const manager = getManager();
      const newAnnouncement = manager.create(Announcement, {
        title,
        short_description,
        image_name,
        show_on_home: show_on_home === "true" ? true : false,
        image_link: req.file.path,
      });
      let result = await manager.save(newAnnouncement);
      if (!result) {
        return res.status(500).json({
          message: "Error creating announcement",
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

export const getAllAnnouncement = async (req: Request, res: Response) => {
  console.log("getAllAnnouncement");
  const manager = getManager();
  let announcements = await manager.find(Announcement);
  console.log(announcements.length);
  if (announcements.length === 0) {
    return res.status(500).json({
      message: "Error getting announcements",
    });
  }
  return res.status(200).json({
    message: "success",
    announcements: announcements,
  });
};

export const updateAnnounceMentById = async (req: Request, res: Response) => {
  console.log("updateAnnounceMentById");
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }

    const { id } = req.params;
    const { title, short_description, image_name, show_on_home } = req.body;
    const manager = getManager();
    let announcement = await manager.findOne(Announcement, id);
    if (!announcement) {
      return res.status(500).json({
        message: "Cannot find announcement",
      });
    }
    announcement.title = title ? title : announcement.title;
    announcement.short_description = short_description
      ? short_description
      : announcement.short_description;
    announcement.image_name = image_name ? image_name : announcement.image_name;
    announcement.show_on_home = show_on_home
      ? show_on_home === "true"
        ? true
        : false
      : announcement.show_on_home;
    if (req.file) {
      let oldImage = announcement.image_link;
      fs.unlink(oldImage, (err) => {
        if (err) {
          return res.status(500).json({
            message: "Error deleting old image",
          });
        }
      });
      announcement.image_link = req.file.path;
    }
    let result = await manager.update(
      Announcement,
      id,
      _.pick(announcement, [
        "title",
        "short_description",
        "image_name",
        "show_on_home",
        "image_link",
      ])
    );
    if (!result) {
      return res.status(500).json({
        message: "Error updating announcement",
      });
    }
    return res.status(200).json({
      message: "success",
      result: announcement,
    });
  });
};

export const deleteAnnouncementById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const manager = getManager();
  let announcement = await manager.findOne(Announcement, id);
  if (!announcement) {
    return res.status(500).json({
      message: "Cannot find announcement",
    });
  }
  fs.unlink(announcement.image_link, (err) => {
    if (err) {
      console.log(err);
    }
  });
  let result = await manager.delete(Announcement, { id });
  if (!result) {
    return res.status(500).json({
      message: "Error deleting announcement",
    });
  }
  return res.status(200).json({
    message: "Announcement deleted",
  });
};
