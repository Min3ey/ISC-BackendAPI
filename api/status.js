const scannedPlaces = require('../scannedPlaces');
const rateLimit = require('express-rate-limit');

const SECRET_KEY = process.env.API_SECRET;

// Rate limiter: 30 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = [
  limiter,
  function (req, res) {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    if (apiKey !== SECRET_KEY) {
      console.warn('Forbidden attempt with API key:', apiKey);
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Only GET allowed' });
    }

    const placeIdRaw = req.query.placeId;
    if (!placeIdRaw) {
      return res.status(400).json({ error: 'Missing placeId' });
    }

    // Validate and sanitize placeId
    const placeId = Number(placeIdRaw);
    if (
      !Number.isInteger(placeId) ||
      placeId <= 0 ||
      placeId > 9999999999
    ) {
      console.warn('Invalid placeId:', placeIdRaw);
      return res.status(400).json({ error: 'Invalid placeId' });
    }

    const flagged = !!scannedPlaces[placeId];
    return res.json({ flagged, placeId });
  }
];