import express, { Application } from "express";
import { userRouter } from "../routes/userRouter";
import { homeRouter } from "../routes/homeRouter";
import cors from "cors";
import morgan from "morgan";
import { aboutusRouter } from "../routes/aboutusRouter";
import { companyRouter } from "../routes/companyRouter";

export const routes = (app: Application) => {
  app.use(cors());
  app.use(express.json());
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  // server static files in upload folder
  app.use("/uploads", express.static("uploads"));
  app.use("/api/users", userRouter); //routes of user admin
  app.use("/api/admin/home", homeRouter); //routes of home"
  // app.use("/api/admin/about-us", aboutusRouter); //routes of about us
  app.use("/api/admin/mycompany", companyRouter);
};
