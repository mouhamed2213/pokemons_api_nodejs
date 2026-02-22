import express from "express";
import { sequelizeConfig as sequelize } from "../db/sequelize.js";
import { where, Op } from "sequelize";
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
    // find pokem/mon by his name

    if (req.query?.name && req.query?.name.length > 2) {
      const limitNumer = parseInt(req.query?.limit);
      const limit = limitNumer ? limitNumer : 5;
      const name = req.query.name;
      console.log("limite ", limit, "name", name);

      const { count, rows } = await Pokemon.findAndCountAll({
        where: { name: { [Op.like]: `%${name}%` } },
        order: ["name"], // order by name ASC from A to Z
        limit: limit, // result limit
      });

      if (rows === null || rows.length === 0) {
        return res
          .status(404)
          .json({ message: `No pokemon with name ${name} found`, data: [] });
      }

      return res
        .status(200)
        .json({ message: `${count} pokemon found`, count: count, data: rows });
    } else if (req.query?.name.length <= 2) {
      return res.status(404).json({
        message: "Search term should be contain at less 2 charactere",
      });
    } else {
      // find all pokemon
      const pokemons = await Pokemon.findAll({ order: ["name"] });
      if (pokemons.length === 0) {
        return res
          .status(404)
          .json({ status: 404, message: "pokemon list not found", data: [] });
      }
      res.json({ message: `all ${pokemons.length} pokemons`, data: pokemons });
    }
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
    console.log(findOnePokemon);
    res.json({ message: `pokemon ${id} found`, data: findOnePokemon });
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
    const validationError = error?.errors[0];

    console.log(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: 400,
        message: validationError.message,
        filed: validationError.path,
      });
    }

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
    res.status(201).json({ status: 201, message: "updated", data: updated });
  } catch (error) {
    console.log(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: 400,
        message: validationError.message,
        filed: validationError.path,
      });
    }

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
