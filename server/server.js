/* eslint-disable no-undef */
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import pLimit from 'p-limit';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

function getSongsFromApiResponse(response) {
    const songs = response.sets.set[0].song;
    const songNames = [];
    
    for (const song of songs) {
        songNames.push(song.name.trim());
    }

    return songNames;
}

app.post('/api/getSetlistsByIds', async (req, res) => {
    const { setlistIds } = req.body;
    const counts = {};

    let requestCount = 1;

    const limit = pLimit(1);

    const limitedFetches = setlistIds.map(id => 
        limit(async () => {
            console.log(requestCount++);
            try {
                const { data: response } = await axios.get(`https://api.setlist.fm/rest/1.0/setlist/${id}`, {
                    headers: { 'x-api-key': process.env.SETLIST_API_KEY, 'Accept': 'application/json' }
                });

                const songs = getSongsFromApiResponse(response);
                for (const song of songs) {
                    const key = normalizeSongTitle(song);
                    counts[key] = (counts[key] || 0) + 1;
                }
            } catch (err) {
                console.error(`Error getting ${id}: `, err.message);
            }

            await delay(600);
        })
    );
    
    await Promise.all(limitedFetches);
    res.json(counts);
});

function normalizeSongTitle(title) {
return title
    .toUpperCase()
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Node.js server listening on port ${PORT}`));