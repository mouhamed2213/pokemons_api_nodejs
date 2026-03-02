import express from "express";
import { User } from "../db/sequelize.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const router = express.Router();
dotenv.config();

router.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    const { password } = body;

    // hash the password
    const hash = await bcrypt.hash(password, 10);
    const userData = { ...body, password: hash };

    // create user
    const user = await User.create(userData);
    console.log("Body : ", body, " create Resultat ", user);
    res.json({ message: "", data: user });
  } catch (error) {
    console.log(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "sorry name already taken please change your usename",
      });
    }

    if (error.name === `SequelizeValidationError`) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Internal server Errors ",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    if (
      username === null ||
      username === "" ||
      password === null ||
      password === ""
    ) {
      return res.status(400).json({ message: "Empty field" });
    }

    // Find user
    const user = await User.findOne({ where: { username: username } });
    if (user === null) {
      return res.status(404).json({
        message: "Not user found. Please create a account if you don't",
      });
    }
    // comparre user password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      //Unauthorized
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // JWT payload
    const payload = {
      sub: user.id,
      name: user.username,
      role: "user",
      expiresIn: "7h",
    };
    // genererate the jwt
    const privateKey = process.env.JWT_SECRET;

    jwt.sign(payload, privateKey, (error, jwt) => {
      if (error) {
        console.log(console.log(error));
      }

      // return jwt
      return res.status(200).json({ message: "connected", token: jwt });
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "internal error", error: error.stack });
  }
});

export default router;
