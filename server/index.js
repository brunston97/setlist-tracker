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


function convertToSimpleSetlist(setlist) {
    const songNames = [];
    let venue = null;
    let date = null;
    let city = null;
    let state = null; 
    let country = null;
    let id = null;

    if (setlist.artist.name.toUpperCase() === "KING GIZZARD & THE LIZARD WIZARD") {
        if (setlist.sets.set.length > 0) {
            venue = setlist.venue.name;
            date = setlist.eventDate;
            city = setlist.venue.city.name;
            state = setlist.venue.city.stateCode;
            country = setlist.venue.city.country.code;
            id = setlist.id;

            for (const set of setlist.sets.set) {
                for (const song of set.song) {
                    if (song) {
                        songNames.push(song.name.trim());
                    }
                }
            }
        }
    }

    const simpleSetlist = {
        venue: venue,
        date: date,
        city: city,
        state: state,
        country: country,
        id: id,
        songs: songNames
    }

    return simpleSetlist;
}

function getSimpleSetlistsFromUsername(response) {
    const songNames = [];

    for (const setlist of response.setlist) {
        songNames.push(convertToSimpleSetlist(setlist));
    }

    return songNames;
}

function createSongMap(simpleSetlists) {
    const songs = {};
    const shows = {};

    for (const simpleSetlist of simpleSetlists) {
        const showId = simpleSetlist.id;

        shows[showId] = {
            date: simpleSetlist.date,
            venue: simpleSetlist.venue,
            city: simpleSetlist.city,
            state: simpleSetlist.state,
            country: simpleSetlist.country
        };

        for (const song of simpleSetlist.songs) {
            const key = normalizeSongTitle(song);

            if (songs[key]) {
                songs[key].shows.push(showId);
                songs[key].count++;
            } else {
                songs[key] = {
                    shows: [showId],
                    count: 1
                }
            }
        }
    }

    return { songs, shows };
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
    let songMap = {};

    let requestCount = 1;

    const limit = pLimit(8);

    const limitedFetches = setlistIdsSplit.map(id => 
        limit(async () => {
            console.log(requestCount++);
            try {
                const { data: response } = await axios.get(`https://api.setlist.fm/rest/1.0/setlist/${id}`, {
                    headers: { 'x-api-key': process.env.SETLIST_API_KEY, 'Accept': 'application/json' }
                });

                const simpleSetlists = [convertToSimpleSetlist(response)]; 
                songMap = createSongMap(simpleSetlists);
            } catch (err) {
                console.error(`Error getting ${id}: `, err.message);
            }

            const delayAmount = 500;
            await delay(delayAmount);
        })
    );
    
    await Promise.all(limitedFetches);
    res.json(songMap);
});

app.get('/api/getSetlistsByUsername', async (req, res) =>  {
    const userName = req.query.userName;
    let songMap = {};

    const maxPageCount = 20;

    let reachedLastPage = false;
    let pageCount = 0;
    let numResultsProcessed = 0;
    let totalNumResults= 0;

    while (!reachedLastPage) {
        try {
            const { data: response } = await axios.get(`https://api.setlist.fm/rest/1.0/user/${userName}/attended?p=${++pageCount}`, {
                headers: { 'x-api-key': process.env.SETLIST_API_KEY, 'Accept': 'application/json' }
            });

            console.log(`Queried page ${pageCount}`);
            if (pageCount == 1)
                totalNumResults = response.total;

            const simpleSetlists = getSimpleSetlistsFromUsername(response);
            songMap = createSongMap(simpleSetlists);
            numResultsProcessed += response.setlist.length;
            if (numResultsProcessed >= totalNumResults) {
                reachedLastPage = true;
            } else if (pageCount >= maxPageCount) {
                reachedLastPage = true;
            }
                
        } catch (err) {
            console.log(`Error getting ${userName}: `, err.message);
            throw err;
        }
    }
    
    res.json(songMap);
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