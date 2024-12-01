import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user); // ดึงข้อมูล currentUser จาก Redux state
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

  return (
    <header className='bg-[#952A2A] shadow-md font-Georgia'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold sm:text-xl flex flex-wrap'>
            <span className='text-[#FFFFFF] text-4xl'>Melody</span>
            <span className='text-[#FFFFFF] text-4xl'> Energy</span>
          </h1>
        </Link>

        <ul className='flex gap-4 text-lg items-center font-Georgia'>
          {currentUser ? (
            <>
              <Link to='/profile'>
                <li className='text-[#FFFFFF] font-bold hover:underline'>
                  {currentUser.username} {/* แสดงชื่อผู้ใช้ */}
                </li>
              </Link>
              <li
                className='text-[#FFFFFF] hover:underline font-bold cursor-pointer'
                onClick={handleLogout}
              >
                Sing out
              </li>
            </>
          ) : (
            <>
              <Link to='/sign-in'>
                <li className='hidden sm:inline text-[#FFFFFF] font-bold hover:underline'>
                  Sing in
                </li>
              </Link>
              <Link to='/sign-up'>
                <li className='hidden sm:inline text-[#FFFFFF] font-bold hover:underline'>
                  Sign Up
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
