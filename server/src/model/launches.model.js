const axios = require("axios");

const launchesDatabase = require("./launches.schemas");
const planets = require("./planets.schemas");

const DEFAULT_FLIGHT_NUMBER = 100;

const LOAD_LAUNCHES_URL = "https://api.spacexdata.com/v4/launches/query";
const getLatestFlightNumber = () => {
 const latestLaunch = launchesDatabase.findOne().sort("-flightNumber");
 if (!latestLaunch.flightNumber || latestLaunch.flightNumber === undefined) {
  return DEFAULT_FLIGHT_NUMBER;
 }
 return latestLaunch.flightNumber;
};

const existsLaunchWithId = async (launchId) => {
 return await launchesDatabase.findOne({
  flightNumber: launchId,
 });
};

const getLaunches = async (skip, limit) => {
 return await launchesDatabase
  .find({}, { _id: 0, __v: 0 })
  .sort({ flightNumber: 1 })
  .limit(limit)
  .skip(skip);
};

const deleteLaunch = async (id) => {
 return await launchesDatabase.updateOne(
  {
   flightNumber: id,
  },
  {
   upcoming: false,
   success: false,
  }
 );
};

const saveLaunch = async (launch) => {
 return await launchesDatabase.findOneAndUpdate(
  {
   flightNumber: launch.flightNumber,
  },
  launch,
  {
   upsert: true,
  }
 );
};

const scheduleNewLaunch = async (launch) => {
 const planet = await planets.findOne({
  keplerName: launch.target,
 });
 if (!planet) {
  throw new Error("No matching planet found");
 }
 const latestFlightNumber = (await getLatestFlightNumber()) + 1;

 const newLaunch = Object.assign(launch, {
  upcoming: true,
  success: true,
  customers: ["ZTM", "NASA"],
  flightNumber: latestFlightNumber,
 });

 return await saveLaunch(newLaunch);
};
const findLaunch = async (filter) => {
 return launchesDatabase.findOne(filter);
};

const populateLaunches = async () => {
 const res = await axios.post(LOAD_LAUNCHES_URL, {
  query: {},
  options: {
   pagination: false,
   populate: [
    {
     path: "rocket",
     select: {
      name: 1,
     },
    },
    {
     path: "payloads",
     select: {
      customers: 1,
     },
    },
   ],
  },
 });
 const launchData = res.data.docs;
 for (const launch of launchData) {
  const payloads = launch["payloads"];
  const customers = payloads.flatMap((payload) => {
   return payload["customers"];
  });
  const launchDate = new Date(launch["date_utc"]);
  const flightData = {
   flightNumber: launch["flight_number"],
   mission: launch["name"],
   rocket: launch["rocket"]["name"],
   launchDate: launchDate,
   upcoming: launch["upcoming"],
   success: launch["success"],
   customers: customers,
  };
  console.log(`${flightData.flightNumber} ${flightData.mission}`);
  await saveLaunch(flightData);
 }
};

const loadLaunchData = async () => {
 const firstLaunch = await findLaunch({
  flightNumber: 1,
  rocket: "Falcon 1",
  mission: "FalconSat",
 });
 return firstLaunch
  ? console.log("Launch data already loaded!")
  : await populateLaunches();
};
module.exports = {
 getLaunches,
 deleteLaunch,
 existsLaunchWithId,
 scheduleNewLaunch,
 loadLaunchData,
};
