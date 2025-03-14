// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

const apiKey = 'eac8b32e-f2da-4f73-b667-7496e8a702e4'; // Use your actual API key

// Use dynamic import for node-fetch
app.get('/api/card', async (req, res) => {
    try {
        const { default: fetch } = await import('node-fetch');

        // Fetch a single random card from a random page
        const randomPage = Math.floor(Math.random() * 1000); // Adjust range as needed
        const response = await fetch(`https://api.pokemontcg.io/v2/cards?pageSize=1&page=${randomPage}`, {
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            return res.status(response.status).send('Error fetching card data');
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            return res.status(404).send('No cards found on this page');
        }

        res.json(data.data[0]); // Return the first (and only) card from the fetched page
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
