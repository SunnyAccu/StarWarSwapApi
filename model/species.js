const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/database');

class Species extends Model {}

Species.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    classification: {
      type: DataTypes.STRING,
    },
    designation: {
      type: DataTypes.STRING,
    },
    average_height: {
      type: DataTypes.STRING,
    },
    average_lifespan: {
      type: DataTypes.STRING,
    },
    eye_colors: {
      type: DataTypes.STRING,
    },
    hair_colors: {
      type: DataTypes.STRING,
    },
    skin_colors: {
      type: DataTypes.STRING,
    },
    language: {
      type: DataTypes.STRING,
    },
    homeworld: {
      type: DataTypes.STRING,
    },
    people: {
      type: DataTypes.JSONB, // Assuming people is an array of strings
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
    modelName: 'species',
  }
);

module.exports = Species;
