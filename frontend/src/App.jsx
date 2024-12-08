import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import ProfilePage from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import { io } from "socket.io-client";

function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3246/api/songs/search');
      setSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3246");
  
    socket.on("likeUpdated", (song) => {
      console.log("Updated song:", song);
      setSongs((prevSongs) =>
        prevSongs.map((s) =>
          s._id === song._id ? { ...s, likes: song.likes } : s
        )
      );
    });
  
    return () => socket.disconnect(); // Cleanup เมื่อ Component ถูก unmount
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <div>
        {loading ? (
          <p>Loading songs...</p>
        ) : (
          <Routes>
            <Route path="/" element={<Home songs={songs} />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>

          
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
