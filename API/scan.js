let scannedPlaces = {}; // In-memory store

const whitelist = [12345, 67890]; // Put your whitelisted place IDs here

export default function handler(req, res) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== 'your-secret-key') {
    return res.status(403).json({ error: 'Invalid API Key' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { placeId } = req.body;
  if (!placeId) {
    return res.status(400).json({ error: 'placeId is required' });
  }

  if (whitelist.includes(Number(placeId))) {
    return res.status(200).json({ flagged: false, message: 'Place is whitelisted' });
  }

  if (scannedPlaces[placeId]) {
    return res.status(200).json({ flagged: true, message: 'Place already flagged and scanned' });
  }

  scannedPlaces[placeId] = true;

  return res.status(200).json({ flagged: true, message: 'Place flagged and scanned now' });
}
-- Work?