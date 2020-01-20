DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS forecasts;
DROP TABLE IF EXISTS events;

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude VARCHAR(255),
  longitude VARCHAR(255)
);

CREATE TABLE forecasts (
  id SERIAL PRIMARY KEY,
  latitude VARCHAR(255),
  longitude VARCHAR(255),
  forecast json
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  event_date VARCHAR(255),
  link VARCHAR(255),
  summary json
);


