const axios = require('axios');
const sequelize = require('../db/database');
const { Sequelize, Op } = require('sequelize');
const Starship = require('../model/starships');

const insertStarshipData = async (req, res) => {
  try {
    let nextUrl = 'https://swapi.dev/api/starships/';
    let allStarshipData = [];

    do {
      const swapiResponse = await axios.get(nextUrl);
      const starshipData = swapiResponse.data.results;
      allStarshipData = [...allStarshipData, ...starshipData];

      // Check if there are more pages
      nextUrl = swapiResponse.data.next;
    } while (nextUrl);

    // Insert or update all starship data into the SQLite database
    await sequelize.sync({ force: true });

    for (const starshipData of allStarshipData) {
      await Starship.upsert(
        {
          // Use the data from the Star Wars API response
          name: starshipData.name,
          model: starshipData.model,
          starship_class: starshipData.starship_class,
          manufacturer: starshipData.manufacturer,
          cost_in_credits: starshipData.cost_in_credits,
          length: starshipData.length,
          crew: starshipData.crew,
          passengers: starshipData.passengers,
          max_atmosphering_speed: starshipData.max_atmosphering_speed,
          hyperdrive_rating: starshipData.hyperdrive_rating,
          MGLT: starshipData.MGLT,
          cargo_capacity: starshipData.cargo_capacity,
          consumables: starshipData.consumables,
          films: JSON.stringify(starshipData.films),
          pilots: JSON.stringify(starshipData.pilots),
          url: starshipData.url,
          created: starshipData.created,
          edited: starshipData.edited,
        },
        {
          where: {
            name: {
              [Op.eq]: starshipData.name,
            },
          },
        }
      );
    }

    res.json({
      message: 'Starship data fetched and inserted successfully',
      totalRecords: allStarshipData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

const getSingleStarship = async (req, res) => {
  try {
    const { id } = req.params;
    const starship = await Starship.findOne({ where: { id: id } });

    if (!starship) {
      return res.status(404).json({ msg: 'Starship not found' });
    }

    res.status(200).json({ msg: starship });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllStarships = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const searchByName = req.query.name || '';
    const filterModel = req.query.model || '';
    const filterClass = req.query.starship_class || '';
    const filterManufacturer = req.query.manufacturer || '';
    // Add other filters as needed

    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder || 'asc';

    // Build the 'where' condition based on filters
    const where = {
      [Op.and]: [
        {
          [Op.or]: [
            Sequelize.literal(`name LIKE '%${searchByName}%' COLLATE NOCASE`),
            // Add other conditions for model, starship_class, manufacturer, etc., if needed
          ],
        },
        filterModel && { model: filterModel },
        filterClass && { starship_class: filterClass },
        filterManufacturer && { manufacturer: filterManufacturer },
        // Add other filter conditions here
      ],
    };

    // Fetch paginated and sorted data with the search condition
    const data = await Starship.findAndCountAll({
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

const deleteStarship = async (req, res) => {
  try {
    const { id } = req.params;
    const starship = await Starship.findOne({ where: { id: id } });

    if (!starship) {
      return res.status(404).json({ msg: 'Starship not found' });
    }

    await Starship.destroy({ where: { id: id } });

    res.status(200).json({ msg: 'Starship deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateStarship = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const starship = await Starship.findOne({ where: { id: id } });

    if (!starship) {
      return res.status(404).json({ msg: 'Starship not found' });
    }

    await Starship.update(updates, { where: { id: id } });
    const updatedStarship = await Starship.findByPk(id);

    res
      .status(200)
      .json({ msg: 'Starship updated successfully', data: updatedStarship });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  insertStarshipData,
  getSingleStarship,
  getAllStarships,
  deleteStarship,
  updateStarship,
};
