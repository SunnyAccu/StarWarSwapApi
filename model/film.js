const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/database');

class Film extends Model {}

Film.init(
  {
    title: {
      type: DataTypes.STRING,
    },
    episode_id: {
      type: DataTypes.INTEGER,
    },
    opening_crawl: {
      type: DataTypes.STRING,
    },
    director: {
      type: DataTypes.STRING,
    },
    producer: {
      type: DataTypes.STRING,
    },
    release_date: {
      type: DataTypes.DATE,
    },
    species: {
      type: DataTypes.JSONB, // Assuming species is an array of strings
    },
    starships: {
      type: DataTypes.JSONB, // Assuming starships is an array of strings
    },
    vehicles: {
      type: DataTypes.JSONB, // Assuming vehicles is an array of strings
    },
    characters: {
      type: DataTypes.JSONB, // Assuming characters is an array of strings
    },
    planets: {
      type: DataTypes.JSONB, // Assuming planets is an array of strings
    },
    url: {
      type: DataTypes.STRING,
    },
    created: {
      type: DataTypes.STRING, // Assuming it's a string in ISO 8601 date format
    },
    edited: {
      type: DataTypes.STRING, // Assuming it's a string in ISO 8601 date format
    },
    // Add other fields as needed
  },
  {
    sequelize,
    modelName: 'film',
  }
);

module.exports = Film;
