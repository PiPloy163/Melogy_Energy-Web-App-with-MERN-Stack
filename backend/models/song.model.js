import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  track_name: { type: String, required: false },
  artist_name: { type: String, required: false },
  artist_cont: { type: String, required: false },
  data_released: { type: String, required: false },
  bpm: { type: String, required: false },
  key: { type: String, required: false },
  danceability: { type: String, required: false },
  valence: { type: String, required: false },
  energy: { type: String, required: false },
  acousticness: { type: String, required: false },
  spotify_url : { type: String, required: false }
});

const Song = mongoose.model('Song', songSchema);

export default Song;
