import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Button, Snackbar, Typography } from '@mui/material';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { app } from '../../firebase';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import GoogleImg from '../../assets/images/google.webp';
import useLoggedInUserEmail from '../../Hooks/useLoggedInUserEmail';
import { useDispatch } from 'react-redux';
import { logIn } from '../../Redux/auth-slice';
import { toast } from 'react-toastify';
import { Border } from 'react-bootstrap-icons';
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mssg, setmssg] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [formFields, setFormFields] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const context = useContext(MyContext);
  const history = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loggedInUserEmail, setLoggedInUseEmail] = useLoggedInUserEmail(); //get_email hook
  const [isDisabled, setIsDisabled] = useState(true);

  const [inputErrors, setInputErrors] = useState({
    email: '',
    password: ''
  });

  const checkInputs = (email, password) => {
    if (email.trim() !== '' && password.trim() !== '') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const dispatch = useDispatch();

  function replaceSpecialCharacters(inputString) {
    // Use a regular expression to replace special characters with underscore _
    const replacedString = inputString.replace(/[#$\[\].]/g, '_');

    return replacedString;
  }

  // Email validation function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    return password.length != 0;
  };

  const onChangeField = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    let errors = { ...inputErrors };

    // Validate email
    if (name === 'email') {
      errors.email = !validateEmail(value) ? 'Invalid email address' : '';
    }

    // Validate password
    if (name === 'password') {
      errors.password = !validatePassword(value) ? 'Password is required' : '';
    }

    setInputErrors(errors);
    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      [name]: value
    }));
    checkInputs(formFields.email, formFields.password, value);
  };

  const signIn = () => {
    setShowLoader(true);
    signInWithEmailAndPassword(auth, formFields.email, formFields.password)
      .then((userCredential) => {
        const user = userCredential.user;
        setShowLoader(false);
        setFormFields({
          email: '',
          password: ''
        });
        localStorage.setItem('isLogin', true);
        const udata = replaceSpecialCharacters(user.email);
        localStorage.setItem('user', udata);
        context.signIn();
        dispatch(logIn({ email: user.email }));
        setLoggedInUseEmail(user.email);
        localStorage.setItem('uid', userCredential.user.uid);
        localStorage.setItem('userImage', '');
        //console.log(loggedInUserEmail);
        history('/');
        toast.success('Successfully signed in!', {
          className: 'Toastify__toast--custom',
          progressClassName: 'Toastify__progress-bar--custom'
        });
      })
      .catch((error) => {
        setShowLoader(false);
        setError(error.message);
      });
  };

  const signInWithGoogle = () => {
    //console.log('hi sign in');
    setShowLoader(true);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        setShowLoader(false);
        localStorage.setItem('isLogin', true);
        const udata = replaceSpecialCharacters(result.user.email);
        localStorage.setItem('user', udata);
        localStorage.setItem('uid', result.user.uid);
        context.signIn();
        setLoggedInUseEmail(udata);
        localStorage.setItem('userImage', result.user.photoURL);
        //console.log(loggedInUserEmail);
        history('/');
        toast.success('Successfully signed in with Google!', {
          className: 'Toastify__toast--custom',
          progressClassName: 'Toastify__progress-bar--custom'
        });
      })
      .catch((error) => {
        setShowLoader(false);
        setError(error.message);
      });
  };

  const forgotPassword = async () => {
    history('/resetpassword');
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <section className="signIn mb-5">
        <div className="breadcrumbWrapper">
          <div className="container-fluid">
            <ul className="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li >Sign In</li>
            </ul>
          </div>
        </div>

        <div className="loginWrapper ">
          <div className="card shadow animator">
            <Backdrop
              sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={showLoader}
              className="formLoader"
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <h3 className="text-center h-size">Sign In</h3>
            <form className="mt-4">
              <div className="form-group mb-4 w-100">
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-100 text-zinc-800"
                  onChange={onChangeField}
                  value={formFields.email}
                  autoComplete="email"
                  error={inputErrors.email}
                  sx={{
                    '.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input::placeholder':{
                     fontSize:"1.5rem "
                    }
                   ,}}
                />
                {inputErrors.email && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'red', padding: '5px' }}
                  >
                    {inputErrors.email}
                  </Typography>
                )}
              </div>
              <div className="form-group mb-4 w-100">
                <div className="position-relative">
                  <TextField
                    id="password"
                    type={showPassword === false ? 'password' : 'text'}
                    name="password"
                    placeholder="Password"
                    className="w-100"
                    onChange={onChangeField}
                    value={formFields.password}
                    autoComplete="current-password"
                    error={inputErrors.password}
                    sx={{
           '.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input::placeholder':{
            fontSize:"1.5rem "
           }
          ,}}
                  />
                  <Button
                    className="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword === false ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </Button>
                  {inputErrors.password && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {inputErrors.password}
                    </Typography>
                  )}
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  Invalid Email or Password
                </div>
              )}

              <div className="form-group mt-3 mb-4 w-100 d-flex justify-content-end">
                <Button
                  className="btn btn-link float-end"
                  onClick={forgotPassword}
                  sx={{fontSize:"1.3rem"}}
                >
                  Forgot Password?
                </Button>
              </div>

              <div className="form-group mt-5 mb-4 w-100">
                <Button
                  disabled={isDisabled}
                  className="btn btn-g btn-lg w-100 "
                  onClick={signIn}
                >
                  Sign In
                </Button>
              </div>

              <div className="form-group  mb-4 w-100 signInOr  " >
                <p className="text-center">OR</p>
                <Button
                  className="w-100"
                  variant="outlined"
                  onClick={signInWithGoogle}
                >
                  <img src={GoogleImg} alt="Google Logo" /> Sign In with Google
                </Button>
              </div>

              <p className="text-center" style={{fontSize:"1.6rem",cursor:"auto"}}>
                Don't have an account?{' '}
                <b>
                  <Link to="/signup" >Sign Up</Link>
                </b>
              </p>
            </form>
          </div>
        </div>
      </section>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={mssg}
      />
    </>
  );
};

export default SignIn;