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
    return res.status(404).send("User not found"); // 404 Not Found
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send("Invalid Email or Password"); // 401 Unauthorized
  }
  const token = user.generateAuthToken();
  return res.send({ token });
};
