const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const ipRes = await axios.get('https://api.ipify.org?format=json');
    res.send(`<h1>Koyeb Bridge Active</h1><p>Flutterwave IP: <b>${ipRes.data.ip}</b></p>`);
  } catch (e) { res.send("Bridge active!"); }
});

app.post('/proxy', async (req, res) => {
  try {
    const response = await axios({
      method: req.body.method || 'POST',
      url: req.body.url,
      data: req.body.data,
      headers: req.body.headers
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

// Koyeb listens on any port, but 8000 is a safe default
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => console.log(`Listening on ${PORT}`));
