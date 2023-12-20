const axios = require('axios');
const sequelize = require('../db/database');
const { Sequelize, Op } = require('sequelize');
const Planet = require('../model/planet');

const insertPlanetData = async (req, res) => {
  try {
    let nextUrl = 'https://swapi.dev/api/planets/';
    let allPlanetData = [];

    do {
      const swapiResponse = await axios.get(nextUrl);
      const planetData = swapiResponse.data.results;
      allPlanetData = [...allPlanetData, ...planetData];

      // Check if there are more pages
      nextUrl = swapiResponse.data.next;
    } while (nextUrl);

    // Insert or update all planet data into the SQLite database
    await sequelize.sync({ force: true });

    for (const planetData of allPlanetData) {
      await Planet.upsert(
        {
          // Use the data from the Star Wars API response
          name: planetData.name,
          diameter: planetData.diameter,
          rotation_period: planetData.rotation_period,
          orbital_period: planetData.orbital_period,
          gravity: planetData.gravity,
          population: planetData.population,
          climate: planetData.climate,
          terrain: planetData.terrain,
          surface_water: planetData.surface_water,
          residents: JSON.stringify(planetData.residents),
          films: JSON.stringify(planetData.films),
          url: planetData.url,
          created: planetData.created,
          edited: planetData.edited,
        },
        {
          where: {
            name: {
              [Op.eq]: planetData.name,
            },
          },
        }
      );
    }

    res.json({
      message: 'Planet data fetched and inserted successfully',
      totalRecords: allPlanetData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

const getSinglePlanet = async (req, res) => {
  try {
    const { id } = req.params;
    const planet = await Planet.findOne({ where: { id: id } });

    if (!planet) {
      return res.status(404).json({ msg: 'Planet not found' });
    }

    res.status(200).json({ msg: planet });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllPlanets = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const searchByName = req.query.name || '';
    const filterDiameter = req.query.diameter || '';
    const filterPopulation = req.query.population || '';
    // Add other filters as needed

    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder || 'asc';

    // Build the 'where' condition based on filters
    const where = {
      [Op.and]: [
        {
          [Op.or]: [
            Sequelize.literal(`name LIKE '%${searchByName}%' COLLATE NOCASE`),
            // Add other conditions for diameter, population, etc., if needed
          ],
        },
        filterDiameter && { diameter: filterDiameter },
        filterPopulation && { population: filterPopulation },
        // Add other filter conditions here
      ],
    };

    // Fetch paginated and sorted data with the search condition
    const data = await Planet.findAndCountAll({
      where: where,
      limit: parseInt(limit, 10),
      offset: offset,
      order: [[sortBy, sortOrder]],
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

const deletePlanet = async (req, res) => {
  try {
    const { id } = req.params;
    const planet = await Planet.findOne({ where: { id: id } });

    if (!planet) {
      return res.status(404).json({ msg: 'Planet not found' });
    }

    await Planet.destroy({ where: { id: id } });

    res.status(200).json({ msg: 'Planet deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updatePlanet = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const planet = await Planet.findOne({ where: { id: id } });

    if (!planet) {
      return res.status(404).json({ msg: 'Planet not found' });
    }

    await Planet.update(updates, { where: { id: id } });
    const updatedPlanet = await Planet.findByPk(id);

    res
      .status(200)
      .json({ msg: 'Planet updated successfully', data: updatedPlanet });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  insertPlanetData,
  getSinglePlanet,
  getAllPlanets,
  deletePlanet,
  updatePlanet,
};
