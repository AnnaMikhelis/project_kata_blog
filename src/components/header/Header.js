import styles from '../header/Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/registrationSlice';
import { useGetUserQuery, apiSlice } from '../../store/apiSlice';
import { Button } from 'antd';
const Header = () => {
  const user = useSelector((state) => state.registration.user);
  const { userName } = user || {};
  const token = localStorage.getItem('token');
  const {
    data: userData,
    isLoading,
    error,
  } = useGetUserQuery(undefined, {
    skip: !token,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className={styles.wrap}>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrap}>
        <p>Failed to load user data.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <Link className={styles.title} to={'/'}>
        Realworld Blog
      </Link>
      {!userName ? (
        <div>
          <Link className={styles.signIn} to={'/signIn'}>
            <Button>Sign In</Button>
          </Link>
          <Link to={'/signUp'}>
            <Button className={`${styles.signUp} ${styles.active}`}>Sign Up</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.userInfo}>
          <Link to={'/Article'}>
            <Button className={styles.active}>Create article</Button>
          </Link>
          <Link
            to={'/profile'}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'black',
            }}
          >
            <p className={styles.userName}>{userName}</p>
            <img
              className={styles.imageUser}
              src={
                userData?.user?.image || 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'
              }
              alt="imageUser"
            />
          </Link>
          <Button onClick={logOut} className={styles.logOut}>
            Log Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;