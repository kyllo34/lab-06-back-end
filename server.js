'use strict';

const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  response.send('hello from local host 3000');
})

app.listen(PORT, () => {
  console.log(`listen on ${PORT}`)
});

app.use(cors());