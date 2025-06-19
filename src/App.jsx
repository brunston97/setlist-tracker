import { useEffect, useState } from 'react'
import discographyData from './discography.json'
import AlbumCard from './AlbumCard'
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