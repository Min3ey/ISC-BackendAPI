const scannedPlaces = require('../scannedPlaces');

const SECRET_KEY = process.env.API_SECRET;

module.exports = function (req, res) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  if (apiKey !== SECRET_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Only GET allowed' });
  }

  const placeId = req.query.placeId;
  if (!placeId) {
    return res.status(400).json({ error: 'Missing placeId' });
  }

  const flagged = !!scannedPlaces[placeId];
  return res.json({ flagged });
};
