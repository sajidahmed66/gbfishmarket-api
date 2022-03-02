import express, { Application } from "express";
import userRouter from "../routes/userRouter";
import cors from "cors";

export const routes = (app: Application) => {
  app.use(cors());
  app.use(express.json());
  app.use("/api/users", userRouter); //routes of user admin
};
