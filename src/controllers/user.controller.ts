import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
// import _ from "lodash";
import { User } from "../entities/User.entity";
import { getManager } from "typeorm";

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, roleId } = req.body;
    const manager = getManager();
    let user;
    user = await manager.find(User, { where: { email } });

    if (user.length > 0) {
      return res.status(400).send("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    const newUser = manager.create(User, {
      name,
      email,
      password: hashedPassword,
      role: roleId,
    });
    await manager.save(newUser);
    return res.status(200).json({
      msg: "User added successfully",
      user: newUser,
    });
  } catch (error) {
    // console.log("Invalid Input", error);
    return res.status(400).json({
      msg: "Invalid Input",
      error,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const entityManager = getManager();
  const result = await entityManager.find(User);
  if (!result) {
    return res.status(404).send("User not found");
  }
  return res.send(result);
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const entityManager = getManager();
    const result = await entityManager.findOne(User, userId);
    if (!result) {
      return res.status(404).send("User not found");
    }
    return res.send(result);
  } catch (error) {
    // console.log("Invalid Input", error);
    return res.status(400).json({
      msg: "Invalid Input",
      error,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email, password, roleId } = req.body;
  const entityManager = getManager();
  const checkUser = await entityManager.findOne(User, userId);
  if (!checkUser) {
    return res.status(404).send("User not found");
  }
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  try {
    const result = await entityManager.update(User, userId, {
      name,
      email,
      password: hashedPassword,
      role: roleId,
    });
    // return result;
    // console.log("result", result.raw[0]);
    return res.send(result.raw[0]);
  } catch (error) {
    // console.log("Invalid Input", error);
    return res.status(400).json({
      msg: "Invalid Input",
      error,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const entityManager = getManager();
  const result = await entityManager.findOne(User, userId);
  if (!result) {
    return res.status(404).send("User not found");
  }
  const deleteResult = await entityManager.delete(User, userId);
  return res.send(deleteResult);
};
