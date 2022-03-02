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
    console.log("Invalid Input", error);
    return res.status(400).json({
      msg: "Invalid Input",
      error,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const entityManeger = getManager();
  const result = await entityManeger.find(User);
  if (!result) {
    return res.status(404).send("User not found");
  }
  return res.send(result);
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const entityManeger = getManager();
    const result = await entityManeger.findOne(User, userId);
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

// export const updateUser = async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   const { name, email, password, roleId } = req.body;
//   const entityManeger = getManager();
//   const checkUser = await entityManeger.findOne(User, userId);
//   if (!checkUser) {
//     return res.status(404).send("User not found");
//   }
//   try {
//     const result = await entityManeger.update(User, userId, {
//       name,
//       email,
//       password,
//       role: roleId,
//     });
//     return res.send(result);
//   } catch (error) {
//     console.log("Invalid Input", error);
//     return res.status(400).json({
//       msg: "Invalid Input",
//       error,
//     });
//   }
// };
