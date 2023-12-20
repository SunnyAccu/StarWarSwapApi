const axios = require('axios');
const sequelize = require('../db/database');
const { Sequelize, Op } = require('sequelize');
const Film = require('../model/film');

const insertFilmData = async (req, res) => {
  try {
    let nextUrl = 'https://swapi.dev/api/films/';
    let allFilmData = [];

    do {
      const swapiResponse = await axios.get(nextUrl);
      const filmData = swapiResponse.data.results;
      allFilmData = [...allFilmData, ...filmData];

      // Check if there are more pages
      nextUrl = swapiResponse.data.next;
    } while (nextUrl);

    // Insert or update all film data into the SQLite database
    await sequelize.sync({ force: true });

    for (const filmData of allFilmData) {
      await Film.upsert(
        {
          // Use the data from the Star Wars API response
          title: filmData.title,
          episode_id: filmData.episode_id,
          opening_crawl: filmData.opening_crawl,
          director: filmData.director,
          producer: filmData.producer,
          release_date: filmData.release_date,
          species: JSON.stringify(filmData.species),
          starships: JSON.stringify(filmData.starships),
          vehicles: JSON.stringify(filmData.vehicles),
          characters: JSON.stringify(filmData.characters),
          planets: JSON.stringify(filmData.planets),
          url: filmData.url,
          created: filmData.created,
          edited: filmData.edited,
        },
        {
          where: {
            title: {
              [Op.eq]: filmData.title,
            },
          },
        }
      );
    }

    res.json({
      message: 'Film data fetched and inserted successfully',
      totalRecords: allFilmData.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};

const getSingleFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const film = await Film.findOne({ where: { id: id } });

    if (!film) {
      return res.status(404).json({ msg: 'Film not found' });
    }

    res.status(200).json({ msg: film });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllFilms = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const searchByTitle = req.query.title || '';
    const filterEpisodeId = req.query.episode_id || '';
    const filterDirector = req.query.director || '';
    // Add other filters as needed

    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder || 'asc';

    // Build the 'where' condition based on filters
    const where = {
      [Op.and]: [
        {
          [Op.or]: [
            Sequelize.literal(`title LIKE '%${searchByTitle}%' COLLATE NOCASE`),
            // Add other conditions for episode_id, director, etc., if needed
          ],
        },
        filterEpisodeId && {
          episode_id: filterEpisodeId,
        },
        filterDirector && { director: filterDirector },
        // Add other filter conditions here
      ],
    };

    // Fetch paginated and sorted data with the search condition
    const data = await Film.findAndCountAll({
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

const deleteFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const film = await Film.findOne({ where: { id: id } });

    if (!film) {
      return res.status(404).json({ msg: 'Film not found' });
    }

    await Film.destroy({ where: { id: id } });

    res.status(200).json({ msg: 'Film deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const film = await Film.findOne({ where: { id: id } });

    if (!film) {
      return res.status(404).json({ msg: 'Film not found' });
    }

    await Film.update(updates, { where: { id: id } });
    const updatedFilm = await Film.findByPk(id);

    res
      .status(200)
      .json({ msg: 'Film updated successfully', data: updatedFilm });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  insertFilmData,
  getSingleFilm,
  getAllFilms,
  deleteFilm,
  updateFilm,
};
