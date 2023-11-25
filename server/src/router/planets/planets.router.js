const express = require("express");

const { getAllPlanets } = require("./planets.controler.js");

const planetsRouter = express.Router();

planetsRouter.get("/", getAllPlanets);

module.exports = {
 planetsRouter,
};
