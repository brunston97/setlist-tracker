/* eslint-disable no-undef */
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import pLimit from 'p-limit';
import rateLimit from 'express-rate-limit';
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

function getSongsFromUsernameApiResponse(response) {
    const songNames = [];

    for (const setlist of response.setlist) {
        for (const song of setlist.sets.set[0].song) {
            songNames.push(song.name.trim());
        }
    }

    return songNames;
}

const setListLimiter = rateLimit({
    windowMs: 6000,
    max: 6,
    message: { error: "Too many recent attempts. Please try again in one minute..." },
    standardHeaders: true,
    legacyHeaders: false
});

app.get('/api/getSetlistsByIds', setListLimiter, async (req, res) => {
    const setlistIds = req.query.ids;
    const setlistIdsSplit = setlistIds.split(',');
    const counts = {};

    let requestCount = 1;

    const limit = pLimit(8);

    const limitedFetches = setlistIdsSplit.map(id => 
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

            const delayAmount = 500;
            await delay(delayAmount);
        })
    );
    
    await Promise.all(limitedFetches);
    res.json(counts);
});

app.get('/api/getSetlistsByUsername', async (req, res) => {
    const userName = req.query.userName;
    const counts = {};

    try {
        const { data: response } = await axios.get(`https://api.setlist.fm/rest/1.0/user/${userName}/attended`, {
            headers: { 'x-api-key': process.env.SETLIST_API_KEY, 'Accept': 'application/json' }
        });

        const songs = getSongsFromUsernameApiResponse(response);
        for (const song of songs) {
            const key = normalizeSongTitle(song);
            counts[key] = (counts[key] || 0) + 1;
        }
    } catch (err) {
        console.error(`Error getting ${userName}: `, err.message);
        throw err;
    }

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

export default app;