let latestFlightNumber = 100;
const launches = new Map();

const launch = {
 mission: "Kepler Exploration X",
 rocket: "Explorer IS1",
 target: "Kepler-442 b",
 launchDate: new Date("December 28, 2030"),
 customers: ["ZTM", "NASA"],
 flightNumber: latestFlightNumber,
 upcoming: true,
 success: true,
};

launches.set(launch.flightNumber, launch);

const existsLaunchWithId = (launchId) => {
 return launches.has(launchId);
};

const getLaunches = () => {
 return Array.from(launches.values());
};

const addNewLaunch = (newLaunch) => {
 latestFlightNumber++;
 const currentDate = new Date().toISOString().split("T")[0];
 const launchDate = new Date(newLaunch.launchDate).toISOString().split("T")[0];
 if (launchDate < currentDate) {
  throw new Error("Launch date is in the past");
 }

 launches.set(
  latestFlightNumber,
  Object.assign(newLaunch, {
   flightNumber: latestFlightNumber,
   customers: ["ZTM", "NASA"],

   upcoming: true,
   success: true,
  })
 );
 return launches.get(latestFlightNumber);
};

const deleteLaunch = (id) => {
 const aborted = launches.get(id);
 aborted.upcoming = false;
 aborted.success = false;
 return aborted;
};
module.exports = {
 getLaunches,
 addNewLaunch,
 deleteLaunch,
 existsLaunchWithId,
};
