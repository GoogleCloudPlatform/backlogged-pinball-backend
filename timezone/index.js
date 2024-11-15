const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const unixtime = Math.floor(new Date().getTime() / 1000);
  res.json({ unixtime });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});