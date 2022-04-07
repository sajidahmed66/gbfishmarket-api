// a middleware to verify the user token and return the user details from the token

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

interface IRequestWithUser extends Request {
  user: any;
}

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers["authorization"] as string;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  } else {
    token = token.split(" ")[1].trim();
  }
  try {
    let secret = process.env.JWT_SECRET as string;
    let decoded = jwt.verify(token, secret);
    console.log(decoded);
    req.body.user = decoded; // do this on req.header
    next();
  } catch (err) {
    return res.status(500).send("Invalid token.");
  }
};
