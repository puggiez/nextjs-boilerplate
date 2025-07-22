const express = require('express');
const app = express();

app.use(express.json());

// In-memory player data store
let playerDataTable = [];

// POST /update — receives an array of player objects
app.post('/update', (req, res) => {
  const playerArray = req.body;

  if (!Array.isArray(playerArray)) {
    return res.status(400).json({ error: 'Expected an array of player data' });
  }

  for (const playerData of playerArray) {
    if (
      !playerData.username ||
      !Array.isArray(playerData.cframe) || playerData.cframe.length !== 12 ||
      !playerData.velocity ||
      typeof playerData.velocity.x !== 'number' ||
      typeof playerData.velocity.y !== 'number' ||
      typeof playerData.velocity.z !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid player data format in array' });
    }

    // Update existing player data or add new
    const index = playerDataTable.findIndex(p => p.username === playerData.username);

    if (index !== -1) {
      playerDataTable[index] = playerData;
    } else {
      playerDataTable.push(playerData);
    }
  }

  res.json({ status: 'player data updated', totalPlayers: playerDataTable.length });
});

// GET /data — return current player data
app.get('/data', (req, res) => {
  res.json(playerDataTable);
});

// Reset player data every 0.25 seconds
setInterval(() => {
  playerDataTable = [];
  console.log('Player data table reset');
}, 250);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
