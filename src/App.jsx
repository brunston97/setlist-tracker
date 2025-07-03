import axios from 'axios'
import { useEffect, useState } from 'react'
import discographyData from './discography.json'
import AlbumCard from './AlbumCard'
import { NormalizeSongTitle } from './utils/stringExtensions'
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [inputValue, setInputValue] = useState('');
  const [counts, setCounts] = useState({});

  useEffect(() => {
    console.log("Loaded album data:", discographyData);

    const initialCounts = {};
    for (const album of Object.values(discographyData)) {
      for (const song of album.songs) {
        const key = NormalizeSongTitle(song);
        initialCounts[key] = 0;
      }
    }
    
    setCounts(initialCounts);
  }, []);

  async function handleButtonClick() {
    const urls = inputValue
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('setlist.fm'));
    
    const setlistIds = getSetlistIdsFromUrls(urls);
    
    try {
      const response = await axios.post(`${apiUrl}/api/getSetlistsByIds`, { setlistIds });
      setCounts(response.data)
    } catch (error) {
      if (error.response?.status === 429) {
        alert(error.response.data?.error || "Rate limit exceeded");
      } else {
        console.log(error);
      }
    }
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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div className="mb-6 flex flex-col items-center">
        <label htmlFor="setlistInput" className="block text-2xl font-medium mb-4">
          Paste Setlist.fm links here:
        </label>
        <textarea
          id="setlistInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="One link per line..."
          className="w-full h-32 p-3 border rounded-lg resize-y mb-4"
          style={{ maxWidth: '1280px' }}
        />
        <button 
          onClick={() => handleButtonClick()} 
          className="py-2 bg-blue-400 text-white rounded hover:bg-blue-700" 
        >
          Load Setlists
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 gap-6 p-4">
        {Object.entries(discographyData).map(([albumName, album]) => (
          <AlbumCard 
            key={albumName}
            title={albumName}
            data={album}
            counts={counts}
          />
        ))}
      </div>
    </div>
  );
}

export default App