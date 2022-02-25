import express from "express";
import { createConnection } from "typeorm";

const db_connect = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "admin123",
      database: "gbfishmarket",
    });
    console.log("Connected to Postgres");
  } catch (error) {
    console.log("failed to connect to database " + error);
  }
};

const app = express();
db_connect();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
