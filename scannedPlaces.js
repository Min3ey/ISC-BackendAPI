// scannedPlaces.js

const scanned = new Set();

module.exports = {
  has: (id) => scanned.has(id),
  add: (id) => scanned.add(id),
};
