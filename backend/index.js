import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import Song from './models/song.model.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', // frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE' ],
  credentials: true,
}))

// เชื่อมต่อกับ MongoDB
const MONGO_URI = 'mongodb+srv://pornpimon:ploy0163@melodydb.wxwfd.mongodb.net/?retryWrites=true&w=majority&appName=melodydb'; // เปลี่ยนเป็น URI ของคุณ
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, // แนะนำให้ใช้ true
    useUnifiedTopology: true, // แนะนำให้ใช้ true
    serverSelectionTimeoutMS: 5000, // ตั้งเวลา 5 วินาที
  })
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // ลองพิมพ์รายละเอียดเพิ่มเติม
    if (err instanceof mongoose.Error) {
      console.error('Mongoose error details:', err.message);
    }
  });

// API Route: ดึงข้อมูลเพลงทั้งหมด
app.get('/api/songs', async (req, res) => {
  try {
    console.log('Fetching all songs...');
    const songs = await Song.find();
    console.log(`Found ${songs.length} songs.`);
    res.status(200).json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: error.message });
  }
});

// API Route: ค้นหาเพลงตามชื่อ

// Search route
app.get('/api/songs/search', async (req, res) => {
  try {
    // Extract search parameters from the query
    console.log(req.query);
    const { bpm, key, danceability, valence, energy, acousticness } = req.query;

    // Build the search filter dynamically
    const filter = {};

    if (bpm) filter.bpm = parseFloat(bpm);
    if (key) filter.key = key;
    if (danceability) filter.danceability = parseFloat(danceability);
    if (valence) filter.valence = parseFloat(valence);
    if (energy) filter.energy = parseFloat(energy);
    if (acousticness) filter.acousticness = parseFloat(acousticness);

    // Perform the search in the database
    const songs = await Song.find(filter).limit(10); // Limit results to 10

    if (songs.length === 0) {
      return res.status(404).json({ message: 'No songs found matching your criteria.' });
    }

    res.status(200).json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ message: 'An error occurred while fetching songs.', error: error.message });
  }
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});



// Start server
const PORT = process.env.PORT || 3246;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
