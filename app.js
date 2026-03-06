import "dotenv/config";
import express from "express";
import favicon from "serve-favicon";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { dbInit } from "./src/db/sequelize.js";
import { pokemonRoute, userRoute } from "./src/routes/index.js";
import { authMiddleware } from "./src/auth/middelware/auth.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// init database
dbInit();

// middleware
app
  .use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      allowedHeaders: "Content-Type, Authorization",
    }),
  )
  .use(favicon(__dirname + "/favicon.ico"))
  // .use(morgan("dev"))
  .use(bodyParser.json()); // parse body request to json

app.use("/", (req, res) => {
  res.json("Hello Heroku");
});

// mount routes
app.use("/api/auth", userRoute);
app.use("/api/pokemons", authMiddleware, pokemonRoute);
// app.use("/api/pokemons", pokemonRoute);

//  middleware to return response for all not expected route
app.use((req, res) => {
  const message = "ressource not found";
  res.status(404).json({ message });
});

// server listening on
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
