const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const { planetsRouter } = require("./router/planets/planets.router.js");
const { launchesRouter } = require("./router/launches/launches.router.js");
const app = express();

console.log(path.join(__filename));

app.use(cors());

app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);
module.exports = app;
