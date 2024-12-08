import express from 'express';
import mongoose from 'mongoose';
import Song from '../models/song.model.js';

const router = express.Router();

// Search songs
router.post('/search', async (req, res) => {
  try {
    const { bpm, key, danceability, valence, energy, acousticness } = req.query;
    const query = {};

    if (bpm) query.bpm = Number(bpm);
    if (key) query.key = { $regex: key, $options: "i" };
    if (danceability) query.danceability = Number(danceability);
    if (valence) query.valence = Number(valence);
    if (energy) query.energy = Number(energy);
    if (acousticness) query.acousticness = Number(acousticness);

    const songs = await Song.find(query);
    res.json(songs);
  } catch (error) {
    console.error("Error searching songs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Like a song
router.post('/:songId/like', async (req, res) => {
  const { songId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid song ID" });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    song.likes = (song.likes || 0) + 1;
    await song.save();

    // Emit event via Socket.IO
    req.io.emit('likeUpdated', { songId: song._id, likes: song.likes });

    res.json(song);
  } catch (error) {
    console.error("Error liking song:", error);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
});

// Add a comment
router.post('/:songId/comment', async (req, res) => {
  const { songId } = req.params;
  const { comment } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid song ID" });
    }

    if (!comment || typeof comment !== 'string') {
      return res.status(400).json({ message: "Comment must be a non-empty string" });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const newComment = { text: comment, date: new Date() };
    song.comments.push(newComment);
    await song.save();

    // Emit event via Socket.IO
    req.io.emit('commentAdded', { songId: song._id, comment: newComment });

    res.json(song);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
});

export default router;
