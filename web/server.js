const express = require('express');
const bodyParser = require('body-parser');
//const nanoid = require('nanoid/generate');
const shortid = require('shortid');
const moment = require('moment');
var http = require('http');
var fs = require('fs');

const app = express();
const port = 7070;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const urls = {};

app.post('/:shorten', (req, res) => {
  const { url } = req.body;

  // Check if the URL is valid
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Check if the URL already exists
  const existingUrl = Object.keys(urls).find(key => urls[key].url === url);
  if (existingUrl) {
    const shortUrl = `${req.protocol}://${req.headers.host}/${existingUrl}`;
    return res.json({ shortUrl });
  }

  // Generate a unique short URL
  const shortUrl = shortid.generate(8);
  urls[shortUrl] = { url, createdAt: moment().toISOString() };

  // Return the short URL
  const fullShortUrl = `${req.protocol}://${req.headers.host}/${shortUrl}`;
  return res.json({ shortUrl: fullShortUrl });
});

app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;

  // Check if the short URL exists
  if (!urls[shortUrl]) {
    return res.status(404).send('URL not found');
  }

  const { url, createdAt } = urls[shortUrl];

  // Check if the short URL has expired (more than 5 minutes)
  const expiryTime = moment(createdAt).add(5, 'minutes');
  if (moment() > expiryTime) {
    return res.status(403).send('URL has expired');
  }

  // Redirect to the original URL
  return res.redirect(url);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Helper function to validate URL format
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}