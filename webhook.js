const fetch = require('node-fetch'); // npm install node-fetch@2

const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function sendWebhook(placeId, gameName) {
  if (!WEBHOOK_URL) return;

  const data = {
    content: `🚨 Game flagged! Place ID: ${placeId}, Name: ${gameName}`,
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error('Webhook failed:', res.statusText);
    }
  } catch (err) {
    console.error('Webhook error:', err);
  }
}

module.exports = sendWebhook;
