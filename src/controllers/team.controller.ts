import { Request, Response } from "express";
import { getManager } from "typeorm";
import { TeamMember } from "../entities/TeamMember.entity";
import { upload, cloudinary } from "../middlewares/multerConfig";
import multer from "multer";
import * as fs from "fs";

//not teseted via postman

export const getAllTeamMember = async (req: Request, res: Response) => {
  const entityManager = getManager();
  const teamMember = await entityManager.find(TeamMember);
  if (!teamMember) {
    return res.status(404).send("Team Member not found");
  }
  return res.send(teamMember);
};

export const createTeamMember = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    const { name, designation, image_name, companyId } = req.body;
    if (req.file) {
      const entityManager = getManager();
      const teamMember = await entityManager.create(TeamMember, {
        name,
        designation,
        image_name,
        image_link: req.file.path,
        companyProfile: companyId,
        cloudinary_public_id: req.file.filename,
      });
      let result = await entityManager.save(teamMember);
      if (!result) {
        return res.status(500).send("Error creating team member");
      }
      return res.status(201).json({
        message: "success creating team member",
        data: result,
      });
    } else {
      // TODO Implement better error handling
      return res.status(500).json({
        message: "Error uploading file",
      });
    }
  });
};

export const updateTeamMemberById = async (req: Request, res: Response) => {
  upload.single("file")(req, res, async (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({
        message: error.code,
      });
    }
    const { name, designation, image_name, companyId } = req.body;
    const { id } = req.params;
    const entityManager = getManager();
    const teamMember = await entityManager.findOne(TeamMember, id);
    if (!teamMember) {
      return res.status(404).send("Team Member not found");
    }
    if (req.file) {
      const oldImage_cloudinary_piblic_id = teamMember.cloudinary_public_id;

      teamMember.name = name ? name : teamMember.name;
      teamMember.designation = designation
        ? designation
        : teamMember.designation;
      teamMember.image_name = image_name;
      teamMember.image_link = req.file.path;
      teamMember.cloudinary_public_id = req.file.filename;
      let result = await entityManager.save(teamMember);
      if (!result) {
        return res.status(500).send("Error updating team member");
      }
      cloudinary.uploader.destroy(
        oldImage_cloudinary_piblic_id,
        (error, result) => {}
      );
      return res.status(201).json({
        message: "success updating team member",
        data: result,
      });
    } else {
      teamMember.name = name ? name : teamMember.name;
      teamMember.designation = designation
        ? designation
        : teamMember.designation;

      let result = await entityManager.save(teamMember);
      if (!result) {
        return res.status(500).send("Error updating team member");
      }
      return res.status(201).json({
        message: "success updating team member",
        data: result,
      });
    }
  });
};

export const deleteTeamMemberById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const entityManager = getManager();
  const teamMember = await entityManager.findOne(TeamMember, id);
  if (!teamMember) {
    return res.status(404).send("Team Member not found");
  }
  const oldImage_cloudinary_piblic_id = teamMember.cloudinary_public_id;

  let result = await entityManager.delete(TeamMember, id);
  if (!result) {
    return res.status(500).send("Error deleting team member");
  }
  cloudinary.uploader.destroy(
    oldImage_cloudinary_piblic_id,
    (error, result) => {}
  );
  return res.status(201).json({
    message: "success deleting team member",
  });
};
