const express = require('express');
const app = express();

const scanHandler = require('/api/scan');
const statusHandler = require('/api/status');

app.use(express.json());

app.post('/scan', scanHandler);
app.get('/status', statusHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
