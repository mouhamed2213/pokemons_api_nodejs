import express from "express";
import { sequelizeConfig } from "../db/sequelize.js";
const Pokemon = sequelizeConfig.Pokemon;
const router = express.Router();

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log("Time: ", new Date());
  next();
};
router.use(timeLog);

router.get("/pokemons", async (req, res) => {
  const pokemons = await Pokemon.findAll();
  res.json(pokemons);
});

router.post("/pokemons", (req, res) => {
  console.log("req : ", req.body);

  res.json("Received !!!");
});

export default router;
