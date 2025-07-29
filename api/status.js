let scannedPlaces = {};
const SECRET_KEY = "your-secret-key";

export default function handler(req, res) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== SECRET_KEY) return res.status(403).json({ error: "Invalid API Key" });

  if (req.method !== 'GET') return res.status(405).json({ error: 'Only GET allowed' });

  const placeId = req.query.placeId;
  if (!placeId) return res.status(400).json({ error: 'Missing placeId' });

  const flagged = !!scannedPlaces[placeId];
  return res.status(200).json({ flagged, placeId });
}
// pls?