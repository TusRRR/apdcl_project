// === backend.js ===

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const DATA_FILE = 'data.json';
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.post('/save-attributes', (req, res) => {
  const { component, attributes, company, circle, district, subdivision } = req.body;

  if (!component || !attributes || !company || !circle || !district || !subdivision) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  // Remove old entry for same component + location
  data = data.filter(entry => !(
    entry.component === component &&
    entry.company === company &&
    entry.circle === circle &&
    entry.district === district &&
    entry.subdivision === subdivision
  ));

  data.push({ component, attributes, company, circle, district, subdivision });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ message: 'Saved successfully' });
});

app.get('/get-attributes', (req, res) => {
  const { component, company, circle, district, subdivision } = req.query;

  if (!component || !company || !circle || !district || !subdivision) {
    return res.status(400).json({ message: 'Missing query parameters' });
  }

  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const entry = data.find(item =>
      item.component === component &&
      item.company === company &&
      item.circle === circle &&
      item.district === district &&
      item.subdivision === subdivision
    );
    return res.json(entry || { attributes: [] });
  }

  res.json({ attributes: [] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


