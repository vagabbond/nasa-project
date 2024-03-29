const {
 getLaunches,
 deleteLaunch,
 existsLaunchWithId,
 scheduleNewLaunch,
} = require("../../model/launches.model.js");
const { getPagination } = require("../../query.js");
const { getPlanets } = require("../../model/planets.models.js");

const getAllLaunches = async (req, res) => {
 const { skip, limit } = getPagination(req.query);

 return res.status(200).json(await getLaunches(skip, limit));
};
const postNewLaunch = async (req, res) => {
 const data = req.body;
 const planets = await getPlanets();
 const planet = planets.find((planet) => planet.keplerName === data.target);

 if (!data.mission || !data.rocket || !data.launchDate || !data.target) {
  return res.status(400).json({
   error: "Missing required launch property",
  });
 }
 data.launchDate = new Date(data.launchDate);
 if (isNaN(data.launchDate)) {
  return res.status(400).json({
   error: "Invalid launch date",
  });
 }
 if (!planet) {
  return res.status(400).json({
   error: "No matching planet found",
  });
 }
 const result = await scheduleNewLaunch(data);
 return res.status(201).json(result);
};

const abortLaunch = async (req, res) => {
 const launchId = Number(req.params.id);
 const ifExistsLaunchWithId = await existsLaunchWithId(launchId);
 if (!ifExistsLaunchWithId) {
  return res.status(404).json({
   error: "Launch not found",
  });
 }
 const result = await deleteLaunch(launchId);
 if (!result) {
  return res.status(400).json({
   error: "Launch not aborted",
  });
 }
 return res.status(200).json(result);
};

module.exports = {
 getAllLaunches,
 postNewLaunch,
 abortLaunch,
};
