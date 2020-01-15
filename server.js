'use strict';
// load environment variables from the .env file
require('dotenv').config();

// app dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// app setup
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
let locations = {};

// Route Definitions
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', (request, response ) => response.status(404).send('Page not found!'));
app.use(errorHandler);

// Route Handlers
function locationHandler(request, response) {
  let city = request.query.city;
  let key = process.env.LOCATION_IQ_API_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  if (locations[url]) {
    response.send(locations[url])
  } else {
    superagent.get(url)
      .then(data => {
        let geoDataResults = data.body[0];

        let location = new Location(city, geoDataResults);

        response.status(200).send(location);
      })
      .catch(() => {
        errorHandler('Something went wrong', response);
      });
  }
}

function weatherHandler(request, response) {
  try {
    let city = request.query.city;
    const geoWeather = require('./data/darksky.json');
    response.status(200).send(geoWeather.daily.data.map(day => new DailySummary(day)));
  }
  catch (error) {
    errorHandler('Something went wrong', response);
  }
}

// Constructors
function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData.display_name;
  this.latitude = locationData.lat;
  this.longitude = locationData.lon
}
function DailySummary(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0,15);
}

// Error Handlers
function errorHandler(string, response) {
  response.status(500).send(string);
}


// make sure app is listen
app.listen(PORT, () => {
  console.log(`listen on ${PORT}`)
});