import { Request } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
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
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("some error"));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fieldSize: 1024 * 1024 * 5, files: 1 },
});
