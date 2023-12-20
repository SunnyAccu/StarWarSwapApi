const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/database');

class Starship extends Model {}

Starship.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    model: {
      type: DataTypes.STRING,
    },
    starship_class: {
      type: DataTypes.STRING,
    },
    manufacturer: {
      type: DataTypes.STRING,
    },
    cost_in_credits: {
      type: DataTypes.STRING,
    },
    length: {
      type: DataTypes.STRING,
    },
    crew: {
      type: DataTypes.STRING,
    },
    passengers: {
      type: DataTypes.STRING,
    },
    max_atmosphering_speed: {
      type: DataTypes.STRING,
    },
    hyperdrive_rating: {
      type: DataTypes.STRING,
    },
    MGLT: {
      type: DataTypes.STRING,
    },
    cargo_capacity: {
      type: DataTypes.STRING,
    },
    consumables: {
      type: DataTypes.STRING,
    },
    films: {
      type: DataTypes.JSONB, // Assuming films is an array of strings
    },
    pilots: {
      type: DataTypes.JSONB, // Assuming pilots is an array of strings
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
    modelName: 'starship',
  }
);

module.exports = Starship;
