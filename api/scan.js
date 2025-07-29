const whitelist = require('../utils/whitelist');
const scannedPlaces = require('../scannedPlaces');
const sendWebhook = require('../webhook');

const SECRET_KEY = process.env.API_SECRET;

module.exports = async function (req, res) {
  // Accept api_key from headers, query, or body (for Roblox compatibility)
  const apiKey = req.headers['x-api-key'] || req.query.api_key || req.body.api_key;
  if (apiKey !== SECRET_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { placeId, gameName } = req.body;
  if (!placeId) {
    return res.status(400).json({ error: 'Missing placeId' });
  }

  if (whitelist.includes(Number(placeId))) {
    return res.json({ flagged: false, message: 'Whitelisted' });
  }

  if (scannedPlaces[placeId]) {
    return res.json({ flagged: true, message: 'Already flagged' });
  }

  scannedPlaces[placeId] = true;

  // Send webhook, but don't wait for it (fire and forget)
  sendWebhook(placeId, gameName).catch(console.error);

  return res.json({ flagged: true, message: 'Now flagged and webhook sent' });
};
