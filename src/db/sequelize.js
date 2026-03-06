import { Sequelize, DataTypes } from "sequelize";
import { pokemonModel } from "../models/pokemon.js";
import { userModel } from "../models/user.js";
import { pokemons as defaultPokemonList } from "./pokemons.js";
const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",

  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

const dbInit = async () => {
  try {
    await sequelize.authenticate(); // verify connection
    // console.log(authenticated); // undefined ?
    console.log("Connected to the Database 👌");

    await synchro(Pokemon, defaultPokemonList);
  } catch (err) {
    console.error("Cannot connect to the database : 😓", err);
  }
};

// instance of model
const Pokemon = pokemonModel(sequelize, DataTypes);
const User = userModel(sequelize, DataTypes);

const synchro = async (Pokemon, listPokemon) => {
  // create defined model
  await sequelize.sync({ force: true }); // // ONLY IN LOCAL
  await listPokemon.map((pokemon) => {
    Pokemon.create({
      name: pokemon.name,
      hp: pokemon.hp,
      cp: pokemon.cp,
      picture: pokemon.picture,
      types: pokemon.types,
    }).then((value) => {
      console.log(value.toJSON());
    });
  });
};

export { dbInit, Pokemon, User };
