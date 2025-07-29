let scannedPlaces = {}; // Same in-memory store

export default function handler(req, res) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== 'your-secret-key') {
    return res.status(403).json({ error: 'Invalid API Key' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const placeId = req.query.placeId;
  if (!placeId) {
    return res.status(400).json({ error: 'placeId query parameter is required' });
  }

  const flagged = !!scannedPlaces[placeId];

  return res.status(200).json({ flagged, placeId });
}
