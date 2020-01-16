'use strict';
// load environment variables from the .env file
require('dotenv').config();

// app dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');

// app setup
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
let locations = {};
let forecasts = {};

// Database Connection Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {throw err;});

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
  let key = process.env.DARKSKY_API_KEY;
  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  const url = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`
  if (forecasts[url]) {
    response.send(forecasts[url])
  } else {
    superagent.get(url)
      .then(dataSet => {
        response.status(200).send(dataSet.body.daily.data.map(day => new DailySummary(day)));
      })
      .catch(() => errorHandler('Something went wrong', response))
  }
}

// function eventfulHandler(request, response) {
//   let key = process.env.EVENTFUL_API_KEY;

// }

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

// Connect to DB and Start the Web Server
client.connect()
  .then( () => {
    app.listen(PORT, () => {
      console.log('Server up on', PORT);
    });
  })
  .catch(err => {
    throw `PG Startup Error: ${err.message}`;
  })
