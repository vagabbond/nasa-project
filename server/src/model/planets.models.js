const fs = require("fs");
const { parse } = require("csv-parse");

const planets = [];

const isHabitablePlanet = (planet) => {
 return (
  planet["koi_disposition"] === "CONFIRMED" &&
  planet["koi_insol"] > 0.36 &&
  planet["koi_insol"] < 1.11 &&
  planet["koi_prad"] < 1.6
 );
};

const loadPlanets = () => {
 return new Promise((resolve, reject) => {
  fs
   .createReadStream("data/kepler_data.csv")
   .pipe(
    parse({
     comment: "#",
     columns: true,
    })
   )
   .on("data", (data) => {
    if (isHabitablePlanet(data)) {
     planets.push(data);
    }
   })
   .on("error", (err) => {
    console.log(err);
    reject(err);
   })
   .on("end", () => {
    console.log(`CSV file successfully processed ${planets.length}`);
    resolve();
   });
 });
};

module.exports = {
 loadPlanets,
 planets,
};
