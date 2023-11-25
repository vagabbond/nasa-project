const http = require("http");

const app = require("./app.js");
const { loadPlanets } = require("./model/planets.models.js");

const port = process.env.PORT || 8000;
const server = http.createServer(app);

const start = async () => {
 await loadPlanets();
 server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
 });
};

start();
