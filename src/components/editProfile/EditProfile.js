import styles from './EditProfile.module.scss';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUpdateUserMutation } from '../../store/apiSlice';
import { setUser } from '../../store/registrationSlice';
import { useEffect } from 'react';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateUser] = useUpdateUserMutation();
  const user = useSelector((state) => state.registration.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    for (const [key, value] of Object.entries(user)) {
      setValue(key, value);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await updateUser({
        username: data.userName,
        email: data.email,
        password: data.newPassword,
        image: data.urlImage,
      }).unwrap();
      dispatch(
        setUser({
          userName: response.user.username,
          email: response.user.email,
          token: response.user.token,
          urlImage: response.user.image,
        })
      );
      reset();
      navigate('/');
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };

  return (
    <div className={styles.signIn}>
      <h1 className={styles.title}>Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrap}>
          <label className={styles.labelEmail} htmlFor="">
            User name
          </label>
          <input
            {...register('userName', {
              required: 'Введите имя пользователя',
              minLength: {
                value: 3,
                message: 'Имя должно содержать не менее 3 символов',
              },
              maxLength: {
                value: 20,
                message: 'Имя должно содержать не более 20 символов',
              },
            })}
            placeholder="User name"
            type="text"
            onBlur={() => trigger('userName')}
            className={errors.userName ? `${styles.userName} ${styles.inputRed}` : styles.userName}
          />
          {errors.userName && <p className={styles.error}>{errors.userName.message}</p>}
          <label className={styles.labelEmail} htmlFor="">
            Email address
          </label>
          <input
            {...register('email', {
              required: 'Введите адрес почты',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Неверный формат почты',
              },
            })}
            placeholder="Email address"
            onBlur={() => trigger('email')}
            type="email"
            className={errors.email ? `${styles.email} ${styles.inputRed}` : styles.email}
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          <label className={styles.labelPassword} htmlFor="">
            New password
          </label>
          <input
            {...register('newPassword', {
              required: 'Введите пароль',
              minLength: {
                value: 6,
                message: 'Пароль должен содержать не менее 6 символов',
              },
              maxLength: {
                value: 40,
                message: 'Пароль должен содержать не более 40 символов',
              },
            })}
            placeholder="New password"
            type="password"
            onBlur={() => trigger('newPassword')}
            className={
              errors.newPassword ? `${styles.password} ${styles.inputRed}` : styles.password
            }
          />
          {errors.newPassword && <p className={styles.error}>{errors.newPassword.message}</p>}

          <label className={styles.labelPasswordAgain} htmlFor="">
            Avatar image (url)
          </label>
          <input
            {...register('urlImage', {
              required: 'Введите адрес изображения',
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message: 'Введите корректный адрес',
              },
            })}
            placeholder="Avatar image"
            type="text"
            onBlur={() => trigger('urlImage')}
            className={errors.urlImage ? `${styles.password} ${styles.inputRed}` : styles.password}
          />
          {errors.urlImage && <p className={styles.error}>{errors.urlImage.message}</p>}
        </div>
        <button type="submit" className={styles.btnLogin}>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfile;