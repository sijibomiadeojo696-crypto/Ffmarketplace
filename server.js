const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// 1. HOME ROUTE: Shows the IP you need for Flutterwave
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    const ip = response.data.ip;
    res.send(`
      <div style="font-family: sans-serif; padding: 20px; text-align: center;">
        <h1 style="color: #2ecc71;">Bridge Active</h1>
        <p style="font-size: 1.2rem;">Your Flutterwave Whitelist IP is:</p>
        <div style="background: #f1f1f1; padding: 15px; display: inline-block; border-radius: 8px; font-weight: bold; font-size: 1.5rem; color: #333;">
          ${ip}
        </div>
        <p style="color: #666; margin-top: 20px;">Copy this IP and paste it into Flutterwave Dashboard -> Settings -> Whitelist</p>
      </div>
    `);
  } catch (error) {
    res.send("<h1>Bridge Running</h1><p>Check logs to see IP.</p>");
  }
});

// 2. PROXY ROUTE: The app will send payment requests here
app.post('/proxy', async (req, res) => {
  try {
    const { url, method, data, headers } = req.body;
    
    console.log(`Proxying ${method} request to: ${url}`);
    
    const response = await axios({
      method: method || 'POST',
      url: url,
      data: data,
      headers: headers
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Proxy Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Port configuration for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
