const axios = require('axios');
const sequelize = require('../db/database');
const { Sequelize, Op } = require('sequelize');
const Species = require('../model/species');

const insertSpeciesData = async (req, res) => {
  try {
    let nextUrl = 'https://swapi.dev/api/species/';
    let allSpeciesData = [];

    do {
      const swapiResponse = await axios.get(nextUrl);
      const speciesData = swapiResponse.data.results;
      allSpeciesData = [...allSpeciesData, ...speciesData];

      // Check if there are more pages
      nextUrl = swapiResponse.data.next;
    } while (nextUrl);

    // Insert or update all species data into the SQLite database
    await sequelize.sync({ force: true });

    for (const speciesData of allSpeciesData) {
      await Species.upsert(
        {
          // Use the data from the Star Wars API response
          name: speciesData.name,
          classification: speciesData.classification,
          designation: speciesData.designation,
          average_height: speciesData.average_height,
          average_lifespan: speciesData.average_lifespan,
          eye_colors: speciesData.eye_colors,
          hair_colors: speciesData.hair_colors,
          skin_colors: speciesData.skin_colors,
          language: speciesData.language,
          homeworld: speciesData.homeworld,
          people: JSON.stringify(speciesData.people),
          films: JSON.stringify(speciesData.films),
          url: speciesData.url,
          created: speciesData.created,
          edited: speciesData.edited,
        },
        {
          where: {
            name: {
              [Op.eq]: speciesData.name,
            },
          },
        }
      );
    }

    res.json({
      message: 'Species data fetched and inserted successfully',
      totalRecords: allSpeciesData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

const getSingleSpecies = async (req, res) => {
  try {
    const { id } = req.params;
    const species = await Species.findOne({ where: { id: id } });

    if (!species) {
      return res.status(404).json({ msg: 'Species not found' });
    }

    res.status(200).json({ msg: species });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllSpecies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const searchByName = req.query.name || '';
    const filterClassification = req.query.classification || '';
    const filterDesignation = req.query.designation || '';
    const filterLanguage = req.query.language || '';
    // Add other filters as needed

    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder || 'asc';

    // Build the 'where' condition based on filters
    const where = {
      [Op.and]: [
        {
          [Op.or]: [
            Sequelize.literal(`name LIKE '%${searchByName}%' COLLATE NOCASE`),
            // Add other conditions for classification, designation, language, etc., if needed
          ],
        },
        filterClassification && { classification: filterClassification },
        filterDesignation && { designation: filterDesignation },
        filterLanguage && { language: filterLanguage },
        // Add other filter conditions here
      ],
    };

    // Fetch paginated and sorted data with the search condition
    const data = await Species.findAndCountAll({
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

const deleteSpecies = async (req, res) => {
  try {
    const { id } = req.params;
    const species = await Species.findOne({ where: { id: id } });

    if (!species) {
      return res.status(404).json({ msg: 'Species not found' });
    }

    await Species.destroy({ where: { id: id } });

    res.status(200).json({ msg: 'Species deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateSpecies = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const species = await Species.findOne({ where: { id: id } });

    if (!species) {
      return res.status(404).json({ msg: 'Species not found' });
    }

    await Species.update(updates, { where: { id: id } });
    const updatedSpecies = await Species.findByPk(id);

    res
      .status(200)
      .json({ msg: 'Species updated successfully', data: updatedSpecies });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  insertSpeciesData,
  getSingleSpecies,
  getAllSpecies,
  deleteSpecies,
  updateSpecies,
};
