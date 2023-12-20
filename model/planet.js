const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/database');

class Planet extends Model {}

Planet.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    diameter: {
      type: DataTypes.STRING,
    },
    rotation_period: {
      type: DataTypes.STRING,
    },
    orbital_period: {
      type: DataTypes.STRING,
    },
    gravity: {
      type: DataTypes.STRING,
    },
    population: {
      type: DataTypes.STRING,
    },
    climate: {
      type: DataTypes.STRING,
    },
    terrain: {
      type: DataTypes.STRING,
    },
    surface_water: {
      type: DataTypes.STRING,
    },
    residents: {
      type: DataTypes.JSONB, // Assuming residents is an array of strings
    },
    films: {
      type: DataTypes.JSONB, // Assuming films is an array of strings
    },
    url: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.DATE,
    },
    edited: {
      type: DataTypes.DATE,
    },
    // Add other fields as needed
  },
  {
    sequelize,
    modelName: 'planet',
  }
);

module.exports = Planet;
