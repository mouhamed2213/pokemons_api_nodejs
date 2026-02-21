import express from "express";
import { sequelizeConfig as sequelize } from "../db/sequelize.js";
import { where } from "sequelize";
const Pokemon = sequelize.Pokemon;
const router = express.Router();

// middleware that is specific to this router
const timeLog = (req, res, next) => {
  console.log("Time: ", new Date());
  next();
};
router.use(timeLog);
router.get("/pokemons", async (req, res) => {
  const pokemons = await Pokemon.findAll();
  console.log(pokemons);
  res.json({ message: "all pokemon", data: pokemons });
});

// get one pokemon
router.get("/pokemons/:id", async (req, res) => {
  const id = req.params.id;
  const findOne = await Pokemon.findByPk(id);
  res.json({ message: `pokemon ${id} found`, data: findOne });
  console.log(findOne);
});

// add pokemon
router.post("/pokemons", async (req, res) => {
  const addPokemon = await Pokemon.create(req.body);
  console.log(addPokemon);
  res.json({ message: "added ok", data: addPokemon });
});

// update pokemon
router.put("/pokemons/:id", async (req, res) => {
  const id = req.params.id;
  const pokemon = req.body;

  await Pokemon.update(pokemon, { where: { id: id } });

  //  find updated value
  const updated = await Pokemon.findByPk(id);
  console.log("updated", updated);
  res.json({ message: "updated okay", data: updated });
});

// delete pokeon
router.delete("/pokemons/:id", async (req, res) => {
  const id = req.params.id;
  // check id pokemon existe :
  const pokemon = await Pokemon.findByPk(id);

  // delete
  const deleted = await Pokemon.destroy({ where: { id: id } });
  if (deleted) {
    console.log("pokemon deleted");
  }
  res.json({ message: "pokemon delete", data: pokemon.name });
});

export default router;
