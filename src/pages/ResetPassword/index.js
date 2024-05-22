import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

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
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail
} from 'firebase/auth';
import { app, db } from '../../firebase';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from '../../App';
import GoogleImg from '../../assets/images/google.webp';
import useLoggedInUserEmail from '../../Hooks/useLoggedInUserEmail';
import { useDispatch } from 'react-redux';
import { logIn } from '../../Redux/auth-slice';
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [mssg, setmssg] = useState();
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
    email: ''
  });

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

  const onChangeField = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      [name]: value
    }));

    let errors = { ...inputErrors };

    // Validate email

    errors.email = '';
    setInputErrors(errors);
  };

  const forgotPassword = async (e) => {
    e.preventDefault();
    let errors = { ...inputErrors };

    // Validate email
    console.log(formFields.email);
    errors.email = !validateEmail(formFields.email)
      ? 'Invalid email address'
      : '';
    setInputErrors(errors);
    if (!validateEmail(formFields.email)) {
      setmssg('Invalid email address');
      return;
    }

    let signInMethods = await fetchSignInMethodsForEmail(
      auth,
      formFields.email
    );
    console.log(signInMethods, 'count');

    try {
      const email = formFields.email;
      const res = await sendPasswordResetEmail(auth, email);
      console.log(res);
      setSnackbarOpen(true);
      formFields.email = '';

      setmssg('Password reset mail has been sent!');
    } catch {
      (error) => {
        console.log(error);
        setmssg('some error has occured!');

        setError(error.message);
      };
    }
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
              <li>
                <Link to="/signIn">SignIn</Link>
              </li>
              <li>Forgot Password</li>
            </ul>
          </div>
        </div>

        <div className="loginWrapper">
          <div className="card shadow">
            <Backdrop
              sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={showLoader}
              className="formLoader"
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <p className="text-left">
              <b>
                <Link to="/signIn">Go to Signin</Link>
              </b>
            </p>

            <h3 className="text-center">Forget Password</h3>
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

              <div className="form-group mt-5 mb-4 w-100">
                <Button
                  className="btn btn-g btn-lg w-100"
                  onClick={forgotPassword}
                >
                  send Email
                </Button>
              </div>
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
