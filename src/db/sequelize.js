import { Sequelize, DataTypes } from "sequelize";
import { pokemonModel } from "../models/pokemon.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { pokemons as defaultPokemonList } from "./pokemons.js";
import console from "console";

// export class SequelizeInit {
const sequelize = new Sequelize("pokedex", "root", "1f2722a99C#", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 10, // nbr nbr open connection
    min: 0, // 0 on waiting
    acquire: 30000, // time  in ms to try open connection befor closing it or send erro
    idle: 1000, // waiting idle(inactif) time befor rejecte
  },
});
// }

const dbInit = async () => {
  try {
    const authenticated = await sequelize.authenticate(); // verify connection
    // console.log(authenticated); // undefined ?
    console.log("Connected to the Database 👌");

    await synchro(Pokemon, defaultPokemonList);
  } catch (err) {
    console.error("Cannot connect to the database : 😓", err);
  }
};

// instance of model
const Pokemon = pokemonModel(sequelize, DataTypes);

const synchro = async (Pokemon, listPokemon) => {
  // create defined model
  await sequelize.sync({ force: false });

  // insert default pokemon
  // await listPokemon.map((pokemon) => {
  //   Pokemon.create({
  //     name: pokemon.name,
  //     hp: pokemon.hp,
  //     cp: pokemon.cp,
  //     picture: pokemon.picture,
  //     types: pokemon.types.join(","),
  //   }).then((value) => {
  //     console.log(value.toJSON());
  //   });
  // });
};

export const sequelizeConfig = {
  dbInit,
  Pokemon,
};
