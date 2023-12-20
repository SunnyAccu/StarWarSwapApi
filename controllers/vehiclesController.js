const axios = require('axios');
const sequelize = require('../db/database');
const { Sequelize, Op } = require('sequelize');
const Vehicle = require('../model/vehicles');

const insertVehicleData = async (req, res) => {
  try {
    let nextUrl = 'https://swapi.dev/api/vehicles/';
    let allVehicleData = [];

    do {
      const swapiResponse = await axios.get(nextUrl);
      const vehicleData = swapiResponse.data.results;
      allVehicleData = [...allVehicleData, ...vehicleData];

      // Check if there are more pages
      nextUrl = swapiResponse.data.next;
    } while (nextUrl);

    // Insert or update all vehicle data into the SQLite database
    await sequelize.sync({ force: true });

    for (const vehicleData of allVehicleData) {
      await Vehicle.upsert(
        {
          // Use the data from the Star Wars API response
          name: vehicleData.name,
          model: vehicleData.model,
          vehicle_class: vehicleData.vehicle_class,
          manufacturer: vehicleData.manufacturer,
          length: vehicleData.length,
          cost_in_credits: vehicleData.cost_in_credits,
          crew: vehicleData.crew,
          passengers: vehicleData.passengers,
          max_atmosphering_speed: vehicleData.max_atmosphering_speed,
          cargo_capacity: vehicleData.cargo_capacity,
          consumables: vehicleData.consumables,
          films: JSON.stringify(vehicleData.films),
          pilots: JSON.stringify(vehicleData.pilots),
          url: vehicleData.url,
          created: vehicleData.created,
          edited: vehicleData.edited,
        },
        {
          where: {
            name: {
              [Op.eq]: vehicleData.name,
            },
          },
        }
      );
    }

    res.json({
      message: 'Vehicle data fetched and inserted successfully',
      totalRecords: allVehicleData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

const getSingleVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOne({ where: { id: id } });

    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    res.status(200).json({ msg: vehicle });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const searchByName = req.query.name || '';
    const filterModel = req.query.model || '';
    const filterVehicleClass = req.query.vehicle_class || '';
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
            // Add other conditions for model, vehicle_class, manufacturer, etc., if needed
          ],
        },
        filterModel && { model: filterModel },
        filterVehicleClass && { vehicle_class: filterVehicleClass },
        filterManufacturer && { manufacturer: filterManufacturer },
        // Add other filter conditions here
      ],
    };

    // Fetch paginated and sorted data with the search condition
    const data = await Vehicle.findAndCountAll({
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

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOne({ where: { id: id } });

    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    await Vehicle.destroy({ where: { id: id } });

    res.status(200).json({ msg: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vehicle = await Vehicle.findOne({ where: { id: id } });

    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    await Vehicle.update(updates, { where: { id: id } });
    const updatedVehicle = await Vehicle.findByPk(id);

    res
      .status(200)
      .json({ msg: 'Vehicle updated successfully', data: updatedVehicle });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  insertVehicleData,
  getSingleVehicle,
  getAllVehicles,
  deleteVehicle,
  updateVehicle,
};
