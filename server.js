require('dotenv').config({ path: './.env' });

console.log("API KEY:", process.env.WEATHER_API_KEY); // Verifique se imprime a chave correta

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

app.use(express.json());

// Rota para buscar o clima por coordenadas geográficas
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude e Longitude são obrigatórios' });
    }

    try {
        const response = await axios.get(WEATHER_API_URL, {
            params: {
                lat,
                lon,
                appid: WEATHER_API_KEY,
                units: 'metric'
            }
        });

        const data = response.data;
        res.json({
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            lightning: data.weather.some(w => w.id >= 200 && w.id < 300), // Checa se há raios na previsão
            description: data.weather[0].description
        });
    } catch (error) {
        console.error('Erro na requisição à API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erro ao buscar informações do clima', details: error.response ? error.response.data : error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
