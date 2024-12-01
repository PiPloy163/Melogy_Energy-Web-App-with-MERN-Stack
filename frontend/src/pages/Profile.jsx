import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';

export default function Profile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(signOutUserStart());
    try {
      // ถ้ามี API logout ให้เพิ่มการเรียก API ตรงนี้
      dispatch(signOutUserSuccess());
      navigate('/'); // เปลี่ยนเส้นทางไปหน้าแรกหลัง logout
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  // Default profile image
  const defaultAvatar =
    'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg';

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    avatar: currentUser?.avatar || defaultAvatar,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      dispatch(signOutUserStart());
      try {
        await fetch('http://localhost:3246/api/auth/signout');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto font-Georgia">
      <h1 className="text-3xl font-Georgia text-center my-6">Profile</h1>
      <div className="flex flex-col items-center">
        <img
          src={formData.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mx-auto"
        />
        <div className="mt-4">
          <p className="font-Georgia">Username: {formData.username}</p>
          <p className="font-Georgia">Email: {formData.email}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 font-Georgia"
        >
          Sign Out
        </button>
      </div>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
