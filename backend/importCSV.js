import mongoose from 'mongoose';
import csv from 'csv-parser';
import fs from 'fs';
import dotenv from 'dotenv';
import Song from './models/song.model.js'; // ถ้าไฟล์ schema อยู่ในโฟลเดอร์ models
import { release } from 'os';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// เชื่อมต่อ MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch((err) => console.error('MongoDB connection error:', err));

// ฟังก์ชั่นนำเข้าข้อมูลจาก CSV
const importCSV = () => {
  const results = [];

  fs.createReadStream('spotifydb.csv') // ระบุ path ของไฟล์ CSV
    .pipe(csv())
    .on('data', (data) => {
      results.push(data); // เก็บข้อมูลจากแต่ละแถวในไฟล์ CSV
    })
    .on('end', async () => {
      // หลังจากอ่านไฟล์ CSV เสร็จแล้ว ให้บันทึกข้อมูลลง MongoDB
      for (let i = 0; i < results.length; i++) {
        const song = new Song({
          track_name: results[i].track_name,
          artist_name: results[i].artist_name,
          artist_cont: results[i].artist_cont,
          date_release: results[i].date_release,
          streams: results[i].streams,
          bpm: results[i].bpm,
          key: results[i].key,
          danceability: results[i].danceability,
          valence: results[i].valence,
          energy: results[i].energy,
          acousticness: results[i].acousticness,
          spotify_url: results[i].spotify_url
        });

        try {
          await song.save();
          console.log(`Song "${song.track_name}" saved successfully.`);
        } catch (error) {
          console.error('Error saving song:', error);
        }
      }

      console.log('CSV data imported to MongoDB.');
    });
};

importCSV();
