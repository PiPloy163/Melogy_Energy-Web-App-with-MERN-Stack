import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = (response) => {
    const { profileObj, tokenId } = response;
    
    // ส่งข้อมูลไปยัง server ของคุณ
    fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: profileObj.name,
        email: profileObj.email,
        photo: profileObj.imageUrl,
        token: tokenId, // ถ้าต้องการใช้ token สำหรับการยืนยันตัวตน
      }),
    })
    .then(res => res.json())
    .then(data => {
      dispatch(signInSuccess(data));
      navigate('/');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <GoogleOAuthProvider clientId="1018463738049-j3tb4ehou4d0rcrrnmdbqskr9cg6lr52.apps.googleusercontent.com">
      <GoogleLogin 
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Login failed')}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
}
