// nodejs entry point
import express from "express";
import morgan from "morgan"; // logger
import favicon from "serve-favicon";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { dbInit } from "./src/db/sequelize.js";
import { pokemonRoute, userRoute } from "./src/routes/index.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// init database
dbInit();

// middleware
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json()); // parse body request to json

// mount routes
app.use("/api", pokemonRoute);
app.use("/api/auth", userRoute);

//  middleware to return response for all not expected route
app.use((req, res) => {
  const message = "ressource not found";
  res.status(404).json({ message });
});

// server listening on
app.listen(port, () =>
  console.log(`app running on : http://localhost:${port}`),
);
