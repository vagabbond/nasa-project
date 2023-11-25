const { getPlanets } = require("../../model/planets.models");

const getAllPlanets = async (req, res) => {
 res.status(200).json(getPlanets());
};

module.exports = {
 getAllPlanets,
};
