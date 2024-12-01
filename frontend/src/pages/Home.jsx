import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Home = () => {
  const [songs, setSongs] = useState([]); // Stores song results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [formData, setFormData] = useState({
    bpm: "",
    key: "",
    danceability: "",
    valence: "",
    energy: "",
    acousticness: "",
  });

  // ดึงสถานะล็อกอินจาก Redux
  const isLoggedIn = useSelector((state) => state.user.currentUser !== null);

  // Options for musical keys
  const keyOptions = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Search songs function
  const searchSongs = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError("Please log in to search for songs.");
      return;
    }
    setLoading(true);
    setError("");

    const filteredFormData = Object.fromEntries(
      Object.entries(formData)
        .filter(([_, value]) => value.trim() !== "")
        .map(([key, value]) => [key, isNaN(value) ? value : Number(value)])
    );

    try {
      const response = await axios.get("http://localhost:3246/api/songs/search", {
        params: filteredFormData,
      });
      setSongs(response.data);
    } catch (error) {
      setError("No songs found. Try adjusting your search criteria.");
      console.error("Error searching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset the form and search results
  const resetForm = () => {
    setFormData({
      bpm: "",
      key: "",
      danceability: "",
      valence: "",
      energy: "",
      acousticness: "",
    });
    setSongs([]);
    setError("");
  };

  return (
    <div>
      {/* Header Section */}
      <header className="flex bg-black text-white h-auto font-Georgia">
        <div className="w-auto h-auto">
          <img
            src="asssets/home.png"
            alt="Home"
            className="w-auto h-auto object-cover"
          />
        </div>
        <div className="w-1/2 h-full flex flex-col justify-center items-start p-10">
          <h1 className="text-8xl font-bold font-Georgia">FIND</h1>
          <h1 className="text-8xl font-bold font-Georgia">PERFECT</h1>
          <h1 className="text-8xl font-bold font-Georgia">RHYTHM</h1>
        </div>
      </header>

      {/* Search Form */}
      <section className="bg-gray-100 p-6 font-Georgia">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={searchSongs}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">BPM</label>
                <input
                  type="number"
                  name="bpm"
                  value={formData.bpm}
                  onChange={handleInputChange}
                  placeholder="Enter BPM"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Key</label>
                <select
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a key</option>
                  {keyOptions.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Danceability</label>
                <input
                  type="number"
                  name="danceability"
                  value={formData.danceability}
                  onChange={handleInputChange}
                  placeholder="Enter danceability (0-100)"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Valence</label>
                <input
                  type="number"
                  name="valence"
                  value={formData.valence}
                  onChange={handleInputChange}
                  placeholder="Enter valence (0-100)"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Energy</label>
                <input
                  type="number"
                  name="energy"
                  value={formData.energy}
                  onChange={handleInputChange}
                  placeholder="Enter energy (0-100)"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700">Acousticness</label>
                <input
                  type="number"
                  name="acousticness"
                  value={formData.acousticness}
                  onChange={handleInputChange}
                  placeholder="Enter acousticness (0-100)"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className={`w-1/2 py-2 rounded-md text-lg font-Georgia font-bold ${
                  isLoggedIn ? "bg-[#952A2A] text-[#FFFFFF]" : "bg-gray-300 text-gray-500"
                } hover:bg-gray-400 mr-2`}
                disabled={!isLoggedIn} 
              >
                Search
              </button>
              <button
                onClick={resetForm}
                type="button"
                className="w-1/2 bg-gray-300 text-gray-700 py-2 rounded-md text-lg font-Georgia font-bold hover:bg-gray-400 ml-2"
              >
                Reset
              </button>
            </div>
          </form>
          {!isLoggedIn && (
            <p className="mt-4 text-red-500 text-center font-bold">
              Please log in to search for songs.
            </p>
          )}
        </div>
      </section>

      {/* Results Section */}
<section className="p-6 bg-gray-100">
  <div className="max-w-6xl mx-auto">
    {loading ? (
      <p className="text-center text-gray-600">Loading...</p>
    ) : error ? (
      <p className="text-center text-red-600 font-semibold">{error}</p>
    ) : songs.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-lg rounded-lg overflow-hidden text-center transform transition-transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold truncate">{song.track_name}</h2>
            <p className="text-gray-600 mt-2 truncate">{song.artist_name}</p>
            <p className="text-gray-500 text-sm mt-2 truncate">Key: {song.key}, BPM: {song.bpm}%</p>
            <p className="text-gray-500 text-sm mt-2 truncate">Danceability: {song.danceability}%, Valence: {song.valence}%</p>
            <p className="text-gray-500 text-sm mt-2 truncate">Energy: {song.energy}%, Acousticness: {song.acousticness}%</p>
            <a
              href={song.spotify_url}
              className="block mt-4 text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Listen on Spotify
            </a>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-600">No songs found. Try adjusting your search criteria.</p>
    )}
  </div>
</section>


      {/* Footer Section */}
      <footer className="bg-red-800 text-white py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold mb-2">Melody Energy</h2>
            <div className="flex items-center space-x-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
                alt="Spotify Logo"
                className="h-8"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Contact us</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <i className="fab fa-facebook-square text-xl"></i>
                <span>MelodyEnergy Official</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fab fa-instagram text-xl"></i>
                <span>MelodyEnergy.Official</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-envelope text-xl"></i>
                <span>MelodyEnergyOfficial@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Member</h3>
            <ul className="space-y-2">
              <li>Jiraphat Tinkhao 6510201052</li>
              <li>Pornpimon Sirithai 6510201063</li>
            </ul>
            <p className="mt-4 text-sm">DE 351 Project By TheJorPor</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
