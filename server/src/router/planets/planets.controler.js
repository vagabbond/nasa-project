const { planets } = require("../../model/planets.models");

const getAllPlanets = async (req, res) => {
 res.status(200).json(planets);
};

module.exports = {
 getAllPlanets,
};
