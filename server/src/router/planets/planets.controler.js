const { getPlanets } = require("../../model/planets.models");

const getAllPlanets = async (req, res) => {
 res.status(200).json(await getPlanets());
};

module.exports = {
 getAllPlanets,
};
