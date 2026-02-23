import express from "express";
import { User } from "../db/sequelize.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const body = req.body;
    const user = await User.create(body);
    console.log("Body : ", body, " create Resultat ", user);
    res.json({ message: "", data: user });
  } catch (error) {
    console.log(error.name);
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
  }
});

export default router;
