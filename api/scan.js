const scannedPlaces = require('../scannedPlaces');
const whitelist = require('../utils/whitelist'); // Optional: you can use an array or DB
const webhook = require('../webhook'); // Optional: your Discord webhook logic

module.exports = async (req, res) => {
  const { placeId, gameName, api_key } = req.body;

  if (api_key !== process.env.API_KEY) {
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
};
