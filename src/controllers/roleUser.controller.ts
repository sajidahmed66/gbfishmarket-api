import { Request, Response, NextFunction } from "express";
import { RoleUser } from "../entities/RoleUser.entity";
import { getManager } from "typeorm";

// creates a role for a user
export const role = async (req: Request, res: Response) => {
  try {
    const manager = getManager();
    const newRoleUser = manager.create(RoleUser, req.body);
    const roleUser = await manager.save(newRoleUser);
    res.send(roleUser);
  } catch (error) {
    res.status(400).send("something went wrong");
    console.log("Invalid Input", error);
  }

  //   res.send("user!");
};

// get all roles
export const getRole = async (req: Request, res: Response) => {
  // console.log(req.body.user);
  const entityManeger = getManager();
  const result = await entityManeger.find(RoleUser);
  res.send(result);
};
