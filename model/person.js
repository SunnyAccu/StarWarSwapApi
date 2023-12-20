const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/database');

class Person extends Model {}

Person.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    height: {
      type: DataTypes.STRING,
    },
    mass: {
      type: DataTypes.STRING,
    },
    hair_color: {
      type: DataTypes.STRING,
    },
    skin_color: {
      type: DataTypes.STRING,
    },
    eye_color: {
      type: DataTypes.STRING,
    },
    birth_year: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
    },
    homeworld: {
      type: DataTypes.STRING,
    },
    films: {
      type: DataTypes.JSONB, // Assuming films is an array of strings
    },
    species: {
      type: DataTypes.JSONB, // Assuming species is an array of strings
    },
    vehicles: {
      type: DataTypes.JSONB, // Assuming vehicles is an array of strings
    },
    starships: {
      type: DataTypes.JSONB, // Assuming starships is an array of strings
    },
    created: {
      type: DataTypes.DATE,
    },
    edited: {
      type: DataTypes.DATE,
    },
    url: {
      type: DataTypes.STRING,
    },
    // Add other fields as needed
  },
  {
    sequelize,
    modelName: 'person',
  }
);

module.exports = Person;
