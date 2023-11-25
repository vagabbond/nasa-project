const express = require("express");

const {
 getAllLaunches,
 postNewLaunch,
 abortLaunch,
} = require("./launches.controler.js");

const launchesRouter = express.Router();

launchesRouter.get("/", getAllLaunches);
launchesRouter.post("/", postNewLaunch);
launchesRouter.delete("/:id", abortLaunch);

module.exports = {
 launchesRouter,
};
