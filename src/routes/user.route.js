import express from "express";
import { User } from "../db/sequelize.js";
import bcrypt from "bcrypt";

const router = express.Router();

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

router.post("/login", (req, res) => {
  console.log(req.body);
});

export default router;
