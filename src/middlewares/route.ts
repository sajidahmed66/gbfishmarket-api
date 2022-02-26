import { Application } from "express";
import userRouter from "../routes/userRouter";

export const routes = (app: Application) => {
  app.use("/api/users", userRouter);
};
