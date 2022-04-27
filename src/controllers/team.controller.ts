import { Request, Response } from "express";
import { getManager } from "typeorm";
import { TeamMember } from "../entities/TeamMember.entity";
import { upload } from "../middlewares/multerConfig";
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
      });
      let result = await entityManager.save(teamMember);
      if (!result) {
        return res.status(500).send("Error creating team member");
      }
      return res.status(201).json({
        message: "success creating team member",
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
      const oldImage = teamMember.image_link;
      fs.unlink(oldImage, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("successfully deleted");
      });
      teamMember.name = name ? name : teamMember.name;
      teamMember.designation = designation
        ? designation
        : teamMember.designation;
      teamMember.image_name = image_name;
      teamMember.image_link = req.file.path;
      let result = await entityManager.save(teamMember);
      if (!result) {
        return res.status(500).send("Error updating team member");
      }
      return res.status(201).json({
        message: "success updating team member",
        result,
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
        result,
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
  const oldImage = teamMember.image_link;
  fs.unlink(oldImage, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("successfully deleted");
  });
  let result = await entityManager.delete(TeamMember, id);
  if (!result) {
    return res.status(500).send("Error deleting team member");
  }
  return res.status(201).json({
    message: "success deleting team member",
    result,
  });
};
