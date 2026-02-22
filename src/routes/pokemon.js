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
  try {
    const pokemons = await Pokemon.findAll();
    if (pokemons.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "pokemon list not found", data: [] });
    }

    res.json({ message: "all pokemons", data: pokemons });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      error: "internal server error",
      message: "Cannot find pokemon list, please try again",
    });
  }
});

// get one pokemon
router.get("/pokemons/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const findOnePokemon = await Pokemon.findByPk(id);
    if (findOnePokemon === null) {
      return res
        .status(404)
        .json({ status: 404, message: "This pokemon does\nt exist" });
    }
    res.json({ message: `pokemon ${id} found`, data: findOnePokemon });
    console.log(findOne);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "internal server error", message: "Cannot find pokemon" });
  }
});

// add pokemon
router.post("/pokemons", async (req, res) => {
  try {
    const addPokemon = await Pokemon.create(req.body);
    console.log(addPokemon);
    res
      .status(201)
      .json({ status: 201, message: "pokemon added", data: addPokemon });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal server  Error",
      message: "Cannot add Pokemon please try again",
    });
  }
});

// update pokemon
router.put("/pokemons/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pokemon = req.body;

    await Pokemon.update(pokemon, { where: { id: id } });
    const updated = await Pokemon.findByPk(id);
    if (updated === null) {
      return res.status(404).json({
        status: 404,
        message: "pokemon not found please try again",
      }); // check id pokemon existe
    }

    //  find updated value
    res.status(200).json({ status: 200, message: "updated", data: updated });
  } catch (error) {
    console.log(`${error}`);
    // retrun all other errors
    res.status(500).json({
      status: 500,
      message: "Pokemon update failed, please try again",
      error: "Internal Server Error",
    });
  }
});

// delete pokeon
router.delete("/pokemons/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // check id pokemon existe :
    const pokemon = await Pokemon.findByPk(id);
    if (pokemon === null) {
      return res.status(404).json({
        status: 404,
        message: "pokemon not found please try again",
      }); // check id pokemon existe
    }

    // delete
    const deleted = await Pokemon.destroy({ where: { id: id } });
    if (deleted) {
      console.log("pokemon deleted");
    }
    res.json({ status: 200, message: "pokemon delete", data: pokemon.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      error: "Internal server error",
      message: "Cannot delete pokemon. Please try again",
    });
  }
});

export default router;
