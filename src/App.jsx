import { useEffect, useState } from 'react'
import discographyData from './discography.json'
import './App.css'

function App() {
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
      {Object.entries(discographyData).map(([albumName, album]) => (
        <div key={albumName} className="album" style={{ marginBottom: '2rem' }}>
          <h2>{albumName}</h2>
          <div>
            {album.songs.map((song) => (
              <div key={song} className="song" style={{ marginLeft: '1rem' }}>
                {song} <span style={{ color: 'gray', marginLeft: '0.5rem' }}>{counts[song]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App
