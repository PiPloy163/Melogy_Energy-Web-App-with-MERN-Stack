const searchSongs = async (req, res) => {
    try {
      const { bpm, key, danceability, valence, energy, acousticness } = req.query;
  
      const query = {};
  
      if (bpm) query.bpm = Number(bpm);
      
      // ตรวจสอบ key อย่างละเอียด และแปลงเป็น string หากเป็นไปได้
      if (key !== undefined && key !== null && typeof key === 'string') {
        query.key = { $regex: String(key), $options: "i" };
      } else if (key !== undefined) {
        console.log("Key is not a string, converting to string:", key);
        query.key = { $regex: String(key), $options: "i" };
      }
  
      if (danceability) query.danceability = Number(danceability);
      if (valence) query.valence = Number(valence);
      if (energy) query.energy = Number(energy);
      if (acousticness) query.acousticness = Number(acousticness);
  
      const songs = await Song.find(query);
      res.json(songs);
    } catch (error) {
      console.error("Error searching songs:", error);
      res.status(500).json({ error: "No songs found. Try adjusting your search criteria." });
    }
  };
  