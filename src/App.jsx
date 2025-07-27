import axios from 'axios'
import { useEffect, useState } from 'react'
import discographyData from './discography.json'
import AlbumCard from './AlbumCard'
import { NormalizeSongTitle } from './utils/stringExtensions'
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [setlistInputValue, setInputValue] = useState('');
  const [usernameInputValue, setUsernameInputValue] = useState('')
  const [counts, setCounts] = useState({});
  const [pageHasLoaded, setPageHasLoaded] = useState(false);
  const [isMakingApiCall, setIsMakingApiCall] = useState(false);

  useEffect(() => {
    let initialCounts = {};

    const savedCounts = localStorage.getItem("counts");
    if (savedCounts) {
      initialCounts = JSON.parse(savedCounts);
    } else {
      for (const album of Object.values(discographyData)) {
        for (const song of album.songs) {
          const key = NormalizeSongTitle(song);
          initialCounts[key] = 0;
        }
      }
    }

    const savedSetlistLinks = localStorage.getItem("savedSetlists");
    if (savedSetlistLinks) {
      setInputValue(JSON.parse(savedSetlistLinks));
    }

    const savedUsername = localStorage.getItem("savedUsername");
    if (savedUsername) {
      setUsernameInputValue(savedUsername);
    }
    
    setCounts(initialCounts);
    setPageHasLoaded(true);
  }, []);

  useEffect(() => {
    if (pageHasLoaded) {
      localStorage.setItem("counts", JSON.stringify(counts));
    }
  }, [counts, pageHasLoaded]);

  async function handleButtonClick() {
    localStorage.setItem("savedSetlists", JSON.stringify(setlistInputValue));
    localStorage.setItem("savedUsername", usernameInputValue)
    
    const urls = setlistInputValue
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('setlist.fm'));
    
    const setlistIds = getSetlistIdsFromUrls(urls);
    
    try {
      setIsMakingApiCall(true);
      const response = usernameInputValue ? await axios.get(`${apiUrl}/api/getSetlistsByUsername?userName=${usernameInputValue}`) : await axios.get(`${apiUrl}/api/getSetlistsByIds?ids=${setlistIds.join(',')}`);
      setCounts(response.data)
    } catch (error) {
      if (error.response?.status === 429) {
        alert(error.response.data?.error || "Rate limit exceeded");
      } else if (error.response?.status === 404) {
        console.log(JSON.stringify(error));
        alert(`Error: could not find username ${usernameInputValue}`);
      } else {
        console.log(error);
      }
    }

    setIsMakingApiCall(false);
  }

  function getSetlistIdsFromUrls(urls) {
    const setlistIds = [];

    for (const url of urls) {
      const splitUrl = url.split('-');
      const setlistIdAndHTML = splitUrl[splitUrl.length - 1];
      const setlistId = setlistIdAndHTML.substring(0, setlistIdAndHTML.length-5);

      setlistIds.push(setlistId);
    }

    return setlistIds;
  }

  return (
    <div style={{ padding: '0.25rem', fontFamily: 'sans-serif' }}>
      <div className="mb-6 flex flex-col items-center">
        <label htmlFor="setlistInput" className="block text-2xl font-medium mb-4">
          Paste Setlist.fm links here:
        </label>
        <textarea
          id="setlistInput"
          value={setlistInputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="One link per line..."
          className="w-full h-32 p-2 border rounded-lg resize-y mb-4"
          style={{ maxWidth: '1280px' }}
        />
        <label htmlFor="setlistInput" className="block text-2xl font-medium mb-4">
          ...or enter your Setlist.fm username!
        </label>
        <input
          id="usernameInput"
          value={usernameInputValue}
          onChange={(e) => setUsernameInputValue(e.target.value)}
          placeholder="Enter username here..."
          className="w-3/4 sm:w-1/2 xl:w-1/4 p-2 border text-center rounded-lg mb-4"
        />
        <button 
          onClick={() => handleButtonClick()} 
          className="py-2 bg-blue-400 text-white rounded hover:bg-blue-700" 
        >
          Load Setlists
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-5 p-1">
        {Object.entries(discographyData).map(([albumName, album]) => (
          <AlbumCard 
            key={albumName}
            title={albumName}
            data={album}
            counts={counts}
          />
        ))}
      </div>
      {isMakingApiCall && (
        <div className="loading-overlay">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

export default App