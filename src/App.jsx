import { useEffect, useState } from 'react'
import discographyData from './discography.json'
import AlbumCard from './AlbumCard'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('');
  const [counts, setCounts] = useState({})

  useEffect(() => {
    console.log("Loaded album data:", discographyData);

    const initialCounts = {};
    for (const album of Object.values(discographyData)) {
      for (const song of album.songs) {
        initialCounts[song] = 0;
      }
    }
    
    setCounts(initialCounts);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div className="mb-6">
        <label htmlFor="setlistInput" className="block text-2xl font-medium mb-4">
          Paste Setlist.fm links here:
        </label>
        <textarea
          id="setlistInput"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="One link per line..."
          className="w-full h-32 p-3 border rounded-lg resize-y mb-4"
        />
        <button 
          onClick={() => {}} 
          classname="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
        >
          Load Setlists
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
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