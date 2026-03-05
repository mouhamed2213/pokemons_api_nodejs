import { Sequelize, DataTypes } from "sequelize";
import { pokemonModel } from "../models/pokemon.js";
import { userModel } from "../models/user.js";
import { pokemons as defaultPokemonList } from "./pokemons.js";

console.log();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 10, // nbr nbr open connection
      min: 0, // 0 on waiting
      acquire: 30000, // time  in ms to try open connection befor closing it or send erroR
      idle: 1000, // waiting idle(inactif) time beforE reject
    },
  },
);
// }

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
  // await sequelize.sync({ force: true }); // // ONLY IN LOCAL
  // await listPokemon.map((pokemon) => {
  //   Pokemon.create({
  //     name: pokemon.name,
  //     hp: pokemon.hp,
  //     cp: pokemon.cp,
  //     picture: pokemon.picture,
  //     types: pokemon.types,
  //   }).then((value) => {
  //     console.log(value.toJSON());
  //   });
  // });
};

export { dbInit, Pokemon, User };
