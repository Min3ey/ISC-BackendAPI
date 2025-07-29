const scannedPlaces = require('../scannedPlaces');
const whitelist = require('../utils/whitelist');
const webhook = require('../webhook');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Rate limiter: 30 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS: Only allow requests from your domain (update as needed)
const corsOptions = {
  origin: '*', // Change to your frontend domain
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
};

module.exports = [
  cors(corsOptions),
  limiter,
  async (req, res) => {
    let { placeId, gameName, api_key } = req.body;

    // Sanitize and validate placeId
    if (
      typeof placeId !== 'number' ||
      !Number.isInteger(placeId) ||
      placeId <= 0 ||
      placeId > 9999999999
    ) {
      console.warn('Invalid placeId:', placeId);
      return res.status(400).json({ error: "Invalid placeId" });
    }

    // Sanitize and validate gameName
    if (typeof gameName !== 'string' || gameName.trim().length === 0) {
      console.warn('Invalid gameName:', gameName);
      return res.status(400).json({ error: "Invalid gameName" });
    }
    gameName = gameName.trim().substring(0, 100);

    // Validate API key
    if (typeof api_key !== 'string' || api_key.length < 10 || api_key !== process.env.API_KEY) {
      console.warn('Forbidden attempt with API key:', api_key);
      return res.status(403).json({ error: "Forbidden" });
    }

    const isWhitelisted = whitelist.includes(placeId);
    const alreadyFlagged = scannedPlaces.has(placeId);

    if (isWhitelisted) {
      return res.json({
        placeId,
        gameName,
        whitelisted: true,
        flagged: false,
        wasAlreadyFlagged: false,
        message: "Place is on the whitelist"
      });
    }

    if (alreadyFlagged) {
      return res.json({
        placeId,
        gameName,
        whitelisted: false,
        flagged: true,
        wasAlreadyFlagged: true,
        message: "Already flagged previously"
      });
    }

    // Not whitelisted and not scanned — flag it
    scannedPlaces.add(placeId);

    // Optional: trigger Discord webhook or logging
    await webhook.sendReport({ placeId, gameName });

    return res.json({
      placeId,
      gameName,
      whitelisted: false,
      flagged: true,
      wasAlreadyFlagged: false,
      message: "Now flagged and webhook sent"
    });
  }
];
