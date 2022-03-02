import { Request, Response, NextFunction } from "express";
import { RoleUser } from "../entities/RoleUser.entity";
import { getManager } from "typeorm";

export const role = async (req: Request, res: Response) => {
  try {
    const manager = getManager();
    const newRoleUser = manager.create(RoleUser, req.body);
    const roleUser = await manager.save(newRoleUser);
    res.send(roleUser);
  } catch (error) {
    console.log("Invalid Input", error);
  }

  //   res.send("user!");
};
