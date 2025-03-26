import styles from './SignUp.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/registrationSlice';
import { useCreateUserMutation } from '../../store/apiSlice';
import { Button } from 'antd';
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createUser] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
    reset,
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const resp = await createUser({
        username: data.userName,
        email: data.email,
        password: data.password,
      }).unwrap();

      if (resp.user && resp.user.token) {
        localStorage.setItem('token', resp.user.token);
      }

      reset();
      dispatch(
        setUser({
          userName: data.userName,
          urlImage: 'https://s3-alpha-sig.figma.com/img/ec78/8be1/2bf7cbea0e8e0ac709ec6af74b5bc3fa?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IsjM8h~DUA9w-S6BVaBSvv4KGQxj6J9M1PxakhkjEJXi2kQAQUvrlWKd6gT5KB27XD8aKCYdvFvUXev2w8igTJh8naJrkLXFHDNYu2pw27uopRhr~P1bziIqF7xp75EG~Zz51h9~3VKmk-o0D7vTTuya~k7AjysuvGXiPjX~MsHxzXiyJuL6DPpWZuFscRyqe0WUjL8tcuYRIOafRBlyKk~bgAEigKrkcKGryeA~IuM0TC8ygEq3J~gMB~Hsd3C3bHsvI6w22XUGJUcFn1UinhtCKQuJO4bC4N-UdUa3-Or-AnPapc-HCB4cCJDHPUXg9MDjEq25ZzYB2jg~VAzx~g__',
          password: data.password,
        })
      );

      navigate('/');
    } catch (err) {
      console.error('Failed to register user: ', err);
      if (err.data && err.data.errors) {
        if (err.data.errors['username']) {
          setError('userName', {
            type: 'server',
            message: 'is already taken',
          });
        } else if (err.data.errors['email']) {
          setError('email', {
            type: 'server',
            message: 'is already taken',
          });
        }
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  const password = watch('password');
  const isConsent = watch('consent');

  return (
    <div className={styles.signIn}>
      <h1 className={styles.title}>Create new account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.wrap}>
          <label className={styles.labelEmail} htmlFor="userName">
            User name
          </label>
          <input
            {...register('userName', {
              required: 'Enter username',
              minLength: {
                value: 3,
                message: 'The name must be at least 3 characters long',
              },
              maxLength: {
                value: 20,
                message: 'The name must be no more than 20 characters long',
              },
            })}
            placeholder="User name"
            type="text"
            onBlur={() => trigger('userName')}
            className={errors.userName ? `${styles.userName} ${styles.inputRed}` : styles.userName}
          />
          {errors.userName && <p className={styles.error}>{errors.userName.message}</p>}

          <label className={styles.labelEmail} htmlFor="email">
            Email address
          </label>
          <input
            {...register('email', {
              required: 'Enter your email',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid mail format',
              },
            })}
            placeholder="Email address"
            type="email"
            onBlur={() => trigger('email')}
            className={errors.email ? `${styles.email} ${styles.inputRed}` : styles.email}
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}

          <label className={styles.labelPassword} htmlFor="password">
            Password
          </label>
          <input
            {...register('password', {
              required: 'Enter your password',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
              maxLength: {
                value: 40,
                message: 'The password must be no more than 40 characters long.',
              },
            })}
            placeholder="Password"
            type="password"
            className={errors.password ? `${styles.password} ${styles.inputRed}` : styles.password}
            onBlur={() => trigger('password')}
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}

          <label className={styles.labelPasswordAgain} htmlFor="passwordAgain">
            Repeat Password
          </label>
          <input
            {...register('passwordAgain', {
              required: 'Enter your password',

              validate: (value) => value === password || 'The passwords do not match',
            })}
            placeholder="Password"
            type="password"
            onBlur={() => trigger('passwordAgain')}
            className={
              errors.passwordAgain ? `${styles.password} ${styles.inputRed}` : styles.password
            }
          />
          {errors.passwordAgain && <p className={styles.error}>{errors.passwordAgain.message}</p>}

          <div className={styles.agreementWrap}>
            <input {...register('consent')} className={styles.checkbox} type="checkbox" />
            <p className={styles.agreement}>
              I agree to the processing of my personal <br />
              information
            </p>
          </div>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          className={!isConsent ? `${styles.btnLogin} ${styles.disabled}` : `${styles.btnLogin}`}
          disabled={!isConsent}
        >
          Create
        </Button>
      </form>
      <p className={styles.info}>
        Already have an account? <Link to={'/signIn'}>Sign In.</Link>
      </p>
    </div>
  );
};

export default SignUp;