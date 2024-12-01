const searchSongs = async (req, res) => {
  try {
    const { bpm, key, danceability, valence, energy, acousticness } = req.query;

    // พิมพ์ค่าที่ได้รับจาก request เพื่อดีบัก
    console.log("Received query parameters:", req.query);
    console.log("Received key:", key);
    console.log("Full query parameters:", req.query);
    console.log("Key parameter type:", typeof key);
    console.log("Received raw key:", req.query.key);
    console.log("Type of key:", typeof req.query.key);
    console.log("Decoded key:", decodeURIComponent(req.query.key || ""));



    const query = {};

    if (bpm) query.bpm = Number(bpm);

    if (key === undefined || key === null) {
      console.log("Key is undefined or null.");
    } else if (typeof key !== 'string') {
      console.log("Key is not a string. Type:", typeof key, "Value:", key);
    } else if (key.trim() === '') {
      console.log("Key is an empty string.");
    } else {
      console.log("Key is valid. Proceeding with regex:", key);
      query.key = { $regex: key, $options: "i" };
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
