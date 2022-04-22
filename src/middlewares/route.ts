import express, { Application } from "express";
import { userRouter } from "../routes/userRouter";
import { homeRouter } from "../routes/homeRouter";
import cors from "cors";
import morgan from "morgan";

export const routes = (app: Application) => {
  app.use(cors());
  app.use(express.json());
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  app.use("/api/users", userRouter); //routes of user admin
  app.use("/api/home", homeRouter); //routes of home"
};
