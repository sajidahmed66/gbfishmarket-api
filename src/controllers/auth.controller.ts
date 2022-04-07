import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { getManager } from "typeorm";
import { User } from "../entities/User.entity";

export const logIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const entityManager = getManager();
  const user = (await entityManager.findOne(User, {
    where: { email },
  })) as User;
  if (!user) {
    return res.status(404).send("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).send("Invalid Email or Password");
  }
  const token = user.generateAuthToken();
  return res.send({ token });
};
