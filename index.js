const express = require("express");
const app = express();
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const port = process.env.PORT || 8000;
const openWeatherApiKey = "39913798559ee53521e85baceb8b1a37";

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// API endpoint to get visitor's IP address and location
app.get('/api/hello', async (req, res) => {
  try {
    const visitorName = req.query.visitor_name;
    if (!visitorName) {
      return res.status(400).json({ error: "visitor_name query parameter is required" });
    }

    // Get visitor's IP address
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    

    // Use a fallback IP address if the client IP is a loopback address
    if (clientIp === '::1' || clientIp === '127.0.0.1') {
      clientIp = '8.8.8.8'; 
    }

    // Get location information using the IP address
    const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const locationData = locationResponse.data;


    // Extract location details
    const city = locationData.city;
    const country = locationData.country;

    // Get the weather information based on location
    const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: `${city},${country}`,
        appid: openWeatherApiKey,
        units: 'metric'
      }
    });
    console.log('Weather Response:', weatherResponse.data);
    const weatherData = weatherResponse.data;
    const temperature = weatherData.main.temp;

    // Create greeting message
    const greetingMessage = `Hello, ${visitorName}! The temperature is ${temperature.toFixed(2)} degrees Celsius in ${city}, ${country}.`;

    // Send the response
    res.json({
      client_ip: clientIp,
      location: `${city}, ${country}`,
      greeting: greetingMessage
    });
  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching location or weather data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

