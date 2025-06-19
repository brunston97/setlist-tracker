import { useEffect, useState } from 'react'
import discographyData from './discography.json'
import AlbumCard from './AlbumCard'
import './App.css'

function App() {
  //const [counts, setCounts] = useState({})

  useEffect(() => {
    console.log("Loaded album data:", discographyData);

    const initialCounts = {};
    for (const album of Object.values(discographyData)) {
      for (const song of album.songs) {
        initialCounts[song] = 0;
      }
    }
    
    //setCounts(initialCounts);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {Object.entries(discographyData).map(([albumName, album]) => (
        <AlbumCard 
          key={albumName}
          title={albumName}
          data={album}
        />
      ))}
    </div>
  );
}

export default App