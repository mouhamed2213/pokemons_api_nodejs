// nodejs entry point
import express from "express";
import morgan from "morgan";
import favicon from "serve-favicon";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { sequelizeConfig } from "./src/db/sequelize.js";
import { pokemonRoute, userRouter } from "./src/routes/index.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// init database
sequelizeConfig.dbInit();

app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

// mount routes
app.use("/api", pokemonRoute);
app.use("api/auth", userRouter);

//  middleware to return response for all not expected route
app.use((req, res) => {
  const message = "ressource not found";

  res.status(404).json({ message });
});

// server listening on
app.listen(port, () =>
  console.log(`app running on : http://localhost:${port}`),
);
