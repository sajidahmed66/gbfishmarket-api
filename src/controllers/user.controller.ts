import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User.entity";
import { getManager } from "typeorm";

export const user = async (req: Request, res: Response) => {
  try {
    const manager = getManager();
    const newUser = manager.create(User, req.body);
    const user = await manager.save(newUser);
    res.send(user);
  } catch (error) {
    console.log("Invalid Input",error);
  }

  res.send("user!");
};
