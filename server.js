'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 3001;
app.use(cors());

app.get('/location', (request, response) => {
  let city = request.query.city;
  const geoData = require('./data/geo.json')


  let location = {
    search_query: city,
    formatted_query: geoData[0].display_name,
    latitude: geoData[0].lat,
    longitude: geoData[0].lon
  }

  response.status(200).send(location);
});

// app.get('/', (request, response) => {
//   response.send('hello from local host 3000');
// })

app.listen(PORT, () => {
  console.log(`listen on ${PORT}`)
});

app.use(cors());
