const http = require("http");
const mongoose = require("mongoose");

const app = require("./app.js");
const { loadPlanets } = require("./model/planets.models.js");
const { loadLaunchData } = require("./model/launches.model.js");
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const pass = "x9KSzJ0b7EnuL4Pq";
mongoose.connection.once("open", () => {
 console.log("MongoDB connection ready!");
});

const start = async () => {
 mongoose.connect(
  `mongodb+srv://nasa-admin:${pass}@cluster0.mf8beok.mongodb.net/?retryWrites=true&w=majority`
 );
 await loadPlanets();
 await loadLaunchData();
 server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
 });
};

start();
