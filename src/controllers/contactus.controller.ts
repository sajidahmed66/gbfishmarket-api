import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import { Message } from "../entities/ContactMessage.entity";

export const getAllContactMessage = async (req: Request, res: Response) => {
  const manager = getManager();
  const messages = await manager.find(Message);
  if (!messages)
    return res.status(200).json({
      message: "No messages found",
    });
  return res.status(200).json({
    message: "Messages found",
    data: messages,
  });
};

export const postContactMessage = async (req: Request, res: Response) => {
  const manager = getManager();
  const message = new Message();
  message.name = req.body.name;
  message.email = req.body.email;
  message.phone = req.body.phone;
  message.message = req.body.message;
  let result = await manager.save(message);
  if (!result)
    return res.status(200).json({
      message: "failed to save message try again",
    });
  return res.status(200).json({
    message: "message saved our response will be sent to you shortly",
    data: result,
  });
};
