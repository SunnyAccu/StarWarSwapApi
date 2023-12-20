const axios = require('axios'); // Update with the correct path
const sequelize = require('../db/database'); // Update with the correct path
const { Sequelize, Op } = require('sequelize');
const Person = require('../model/person');

const insertData = async (req, res) => {
  try {
    let nextUrl = 'https://swapi.dev/api/people/';
    let allPeopleData = [];

    do {
      const swapiResponse = await axios.get(nextUrl);
      const peopleData = swapiResponse.data.results;
      allPeopleData = [...allPeopleData, ...peopleData];

      // Check if there are more pages
      nextUrl = swapiResponse.data.next;
    } while (nextUrl);

    // Insert or update all people data into the SQLite database
    await sequelize.sync({ force: true });
    // Make sure the database is synchronized

    for (const personData of allPeopleData) {
      await Person.upsert(
        {
          // Use the data from the Star Wars API response
          name: personData.name,
          height: personData.height,
          mass: personData.mass,
          hair_color: personData.hair_color,
          skin_color: personData.skin_color,
          eye_color: personData.eye_color,
          birth_year: personData.birth_year,
          gender: personData.gender,
          homeworld: personData.homeworld,
          films: JSON.stringify(personData.films),
          species: JSON.stringify(personData.species),
          vehicles: JSON.stringify(personData.vehicles),
          starships: JSON.stringify(personData.starships),
          created: personData.created,
          edited: personData.edited,
          url: personData.url,
        },
        {
          where: {
            name: {
              [Op.eq]: personData.name,
            },
          },
        }
      );
    }

    res.json({
      message: 'Data fetched and inserted successfully',
      totalRecords: allPeopleData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

const getSinglePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findOne({ where: { id: id } });

    if (!person) {
      return res.status(404).json({ msg: 'Person not found' });
    }

    res.status(200).json({ msg: person });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllPerson = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const searchByName = req.query.name || '';
    const filterHeight = req.query.height || '';
    const filterMass = req.query.mass || '';
    const filterHairColor = req.query.hair_color || '';
    const filterSkinColor = req.query.skin_color || '';
    const filterEyeColor = req.query.eye_color || '';
    const filterGender = req.query.gender || '';

    const sortBy = req.query.sortBy || 'id'; // Default sorting by ID if not specified
    const sortOrder = req.query.sortOrder || 'asc'; // Default sorting in ascending order if not specified

    // Build the 'where' condition based on filters
    const where = {
      [Op.and]: [
        {
          [Op.or]: [
            Sequelize.literal(`name LIKE '%${searchByName}%' COLLATE NOCASE`),
            // Add other conditions for hair-color, eye-color, etc., if needed
          ],
        },
        filterHeight && { height: filterHeight },
        filterMass && { mass: filterMass },
        filterHairColor && { hair_color: filterHairColor },
        filterSkinColor && { skin_color: filterSkinColor },
        filterEyeColor && { eye_color: filterEyeColor },
        filterGender && { gender: filterGender.toLowerCase() }, // Assuming gender is stored in lowercase in the database
      ],
    };

    // Fetch paginated and sorted data with the search condition
    const data = await Person.findAndCountAll({
      where: where,
      limit: parseInt(limit, 10),
      offset: offset,
      order: [[sortBy, sortOrder]], // Sorting based on the specified parameters
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the person exists
    const person = await Person.findOne({ where: { id: id } });

    if (!person) {
      return res.status(404).json({ msg: 'Person not found' });
    }

    // Delete the person
    await Person.destroy({ where: { id: id } });

    res.status(200).json({ msg: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Assuming you send the updates in the request body

    // Check if the person exists
    const person = await Person.findOne({ where: { id: id } });

    if (!person) {
      return res.status(404).json({ msg: 'Person not found' });
    }

    // Update the person
    await Person.update(updates, { where: { id: id } });

    // Fetch the updated person data
    const updatedPerson = await Person.findByPk(id);

    res
      .status(200)
      .json({ msg: 'Person updated successfully', data: updatedPerson });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  insertData,
  getSinglePerson,
  getAllPerson,
  deletePerson,
  updatePerson,
};
