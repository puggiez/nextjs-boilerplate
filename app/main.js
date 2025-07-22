const express = require('express');
const app = express();

app.use(express.json()); // parse JSON bodies

// In-memory table to store player data
let playerDataTable = [];

// POST endpoint to add/update player data
app.post('/api/update', (req, res) => {
  const playerData = req.body;

  // Basic validation
  if (
    !playerData.username ||
    !Array.isArray(playerData.cframe) || playerData.cframe.length !== 12 ||
    !playerData.velocity || typeof playerData.velocity.x !== 'number' ||
    typeof playerData.velocity.y !== 'number' || typeof playerData.velocity.z !== 'number'
  ) {
    return res.status(400).json({ error: 'Invalid player data format' });
  }

  // Check if player exists already, update if yes
  const existingIndex = playerDataTable.findIndex(p => p.username === playerData.username);

  if (existingIndex !== -1) {
    playerDataTable[existingIndex] = playerData;
  } else {
    playerDataTable.push(playerData);
  }

  res.json({ status: 'player data updated', totalPlayers: playerDataTable.length });
});

// Optional GET endpoint to retrieve all player data
app.get('/api/data', (req, res) => {
  res.json(playerDataTable);
});

// Reset the player data table every 0.25 seconds
setInterval(() => {
  playerDataTable = [];
  console.log('Player data table reset');
}, 250);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
