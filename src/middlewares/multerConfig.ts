import { Request } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: "megaman22",
  api_key: "254747756327555",
  api_secret: "IfUWAkalXFrzflU1pj3m9KsZ2eU",
});

const storage2 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowedFormats: ["jpg", "png", "jpeg"],
  } as any,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;

    cb(null, `${uuidv4()}-${originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype.split("/")[0] === "image" &&
    (file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

export const upload = multer({
  storage: storage2,
  fileFilter: fileFilter,
  limits: { fieldSize: 1024 * 1024 * 5, files: 1 },
});
