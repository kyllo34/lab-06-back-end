'use strict';

require('dotenv')
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 3001;
app.use(cors());

app.get('/location', (request, response) => {
  let city = request.query.city;
  const geoData = require('./data/geo.json');
  let geoDataResults = geoData[0];

  let location = new Location(city, geoDataResults);

  response.status(200).send(location);
});


function Location(city, locationData) {
  this.search_query = city;
  this.formatted_query = locationData.display_name;
  this.latitude = locationData.lat;
  this.longitude = locationData.lon
}
const dailySummaries = [];
app.get('/weather', (request, response) => {
  let city = request.query.city;
  const geoWeather = require('./data/darksky.json');
  geoWeather.daily.data.forEach(day => {
    dailySummaries.push(new DailySummary(day));
  });

  response.status(200).send(dailySummaries);

})

function DailySummary(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0,15);
  dailySummaries.push(this);

}




app.listen(PORT, () => {
  console.log(`listen on ${PORT}`)
});

app.use(cors());
