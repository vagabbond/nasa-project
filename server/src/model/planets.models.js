const fs = require("fs");
const { parse } = require("csv-parse");

const planets = require("./planets.schemas.js");

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
   .on("data", async (data) => {
    if (isHabitablePlanet(data)) {
     try {
      await planets.updateOne(
       { keplerName: data.kepler_name },
       { keplerName: data.kepler_name },
       { upsert: true }
      );
     } catch (err) {
      console.error(`Could not save planet ${err}`);
     }
    }
   })
   .on("error", (err) => {
    console.log(err);
    reject(err);
   })
   .on("end", async () => {
    const planetCount = (await getPlanets()).length;
    console.log(`CSV file successfully processed ${planetCount}`);
    resolve();
   });
 });
};

const getPlanets = async () => {
 return await planets.find({});
};
module.exports = {
 getPlanets,
 loadPlanets,
 planets,
};
