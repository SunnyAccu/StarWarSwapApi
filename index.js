require('dotenv').config();
const express = require('express');
const app = express();
const sequelize = require('./db/database');
const personRouter = require('./router/person');
const filmRouter = require('./router/film');
const starshipRouter = require('./router/starships');
const speciesRouter = require('./router/species');
const vehicleRouter = require('./router/vehicles');
const planetRouter = require('./router/planet');
app.use(express.json());

app.use('/api', personRouter);
app.use('/api', filmRouter);
app.use('/api', starshipRouter);
app.use('/api', speciesRouter);
app.use('/api', vehicleRouter);
app.use('/api', planetRouter);

sequelize.sync().then(() => console.log('db is ready'));

app.listen(process.env.PORT, () => {
  console.log('app is running');
});
