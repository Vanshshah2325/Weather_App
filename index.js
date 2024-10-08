const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
const PORT = 2000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/vss", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/vss", (req, res) => {
    const cityName = req.body.cityname || req.query.cityname;
    const apikey = "786e81bef7b7fd437bad213436b8fba1";

    // Ensure city name is included dynamically in the API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apikey}&units=metric`;

    https.get(url, (response) => {
        let data = '';

        // Collect data chunks
        response.on('data', (chunk) => {
            data += chunk;
        });

        // Once all data is received, process the weather information
        response.on('end', () => {
            try {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;

                res.write(`<h1>The temperature in ${cityName} is ${temp}°C</h1>`);
                res.write(`<p>Weather description: ${description}</p>`);
                res.send();
            } catch (error) {
                res.send("Error retrieving weather data.");
            }
        });
    }).on('error', (err) => {
        res.send("Error with the API request.");
    });
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
