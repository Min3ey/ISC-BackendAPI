let scannedPlaces = {};
const whitelist = [12345, 67890];
const SECRET_KEY = "your-secret-key";

export default function handler(req, res) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== SECRET_KEY) return res.status(403).json({ error: "Invalid API Key" });

  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { placeId } = req.body;
  if (!placeId) return res.status(400).json({ error: 'Missing placeId' });

  if (whitelist.includes(Number(placeId))) {
    return res.status(200).json({ flagged: false, message: 'Whitelisted' });
  }

  if (scannedPlaces[placeId]) {
    return res.status(200).json({ flagged: true, message: 'Already flagged' });
  }

  scannedPlaces[placeId] = true;
  return res.status(200).json({ flagged: true, message: 'Now flagged' });
}
// Test fixed api