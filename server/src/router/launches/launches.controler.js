const {
 getLaunches,
 addNewLaunch,
 deleteLaunch,
 existsLaunchWithId,
} = require("../../model/launches.model.js");
const { getPlanets } = require("../../model/planets.models.js");

const getAllLaunches = (req, res) => {
 return res.status(200).json(getLaunches());
};
const postNewLaunch = (req, res) => {
 const data = req.body;
 const planet = getPlanets().find(
  (planet) => planet.kepler_name === data.target
 );
 console.log(planet);

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
 const result = addNewLaunch(data);
 return res.status(201).json(result);
};

const abortLaunch = (req, res) => {
 const launchId = Number(req.params.id);
 if (!existsLaunchWithId(launchId)) {
  return res.status(404).json({
   error: "Launch not found",
  });
 }
 const result = deleteLaunch(launchId);
 return res.status(200).json(result);
};

module.exports = {
 getAllLaunches,
 postNewLaunch,
 abortLaunch,
};
