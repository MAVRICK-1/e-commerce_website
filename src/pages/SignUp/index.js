import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Typography,
  Backdrop,
  CircularProgress
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword
} from '../../firebase'; // Adjust the import path according to your setup

const OTP_LIMIT = 10;

const SignUp = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [formFields, setFormFields] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    otp: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpCount, setOtpCount] = useState(0);
  const [inputErrors, setInputErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    otp: ''
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const otpData = JSON.parse(localStorage.getItem('otpData')) || {};

    if (otpData.date !== today) {
      otpData.date = today;
      otpData.count = 0;
      localStorage.setItem('otpData', JSON.stringify(otpData));
    }
    setOtpCount(otpData.count);
  }, []);

  useEffect(() => {
    const loadRecaptcha = () => {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
            callback: (response) => {
              // reCAPTCHA solved, allow user to proceed with phone authentication
            },
            'expired-callback': () => {
              // Response expired. Ask user to solve reCAPTCHA again.
            }
          },
          auth
        );
        window.recaptchaVerifier
          .render()
          .then((widgetId) => {
            window.recaptchaWidgetId = widgetId;
          })
          .catch((error) => {
            console.error('Recaptcha render error:', error);
          });
      }
    };

    if (document.getElementById('recaptcha-container')) {
      loadRecaptcha();
    } else {
      console.error('Recaptcha container not found');
    }
  }, []);

  useEffect(() => {
    const checkInputs = () => {
      const { email, password, confirmPassword, phoneNumber } = formFields;
      setIsDisabled(
        !(
          email.trim() &&
          password.trim() &&
          confirmPassword.trim() &&
          phoneNumber.trim() &&
          isOtpVerified
        )
      );
    };
    checkInputs();
  }, [formFields, isOtpVerified]);

  const signUp = () => {
    setShowLoader(true);
    if (formFields.password.length < 6) {
      setShowLoader(false);
      setSnackbarMessage(
        'Password is too weak. It must be at least 6 characters long.'
      );
      setSnackbarOpen(true);
      return;
    }
    createUserWithEmailAndPassword(auth, formFields.email, formFields.password)
      .then((userCredential) => {
        setShowLoader(false);
        setFormFields({
          email: '',
          password: '',
          confirmPassword: '',
          phoneNumber: '',
          otp: ''
        });
        setOpenDialog(true);
      })
      .catch((error) => {
        setShowLoader(false);
        setSnackbarMessage(error.message);
        setSnackbarOpen(true);
      });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password, errors) => {
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      return false;
    }
    const hasSpecialSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const hasUppercase = /[A-Z]+/;
    const hasLowercase = /[a-z]+/;
    const hasDigit = /[0-9]+/;
    if (!hasSpecialSymbol.test(password)) {
      errors.password = 'Password must contain at least one special symbol';
      return false;
    }
    if (!hasUppercase.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter';
      return false;
    }
    if (!hasLowercase.test(password)) {
      errors.password = 'Password must contain at least one lowercase letter';
      return false;
    }
    if (!hasDigit.test(password)) {
      errors.password = 'Password must contain at least one digit';
      return false;
    }
    errors.password = '';
    return true;
  };

  const validatePhoneNumber = (phoneNumber) =>
    /^\+?[1-9]\d{1,14}$/.test(phoneNumber);

  const onChangeField = (e) => {
    const { name, value } = e.target;
    let errors = { ...inputErrors };

    if (name === 'email') {
      errors.email = !validateEmail(value) ? 'Invalid email address' : '';
    }

    if (name === 'password') {
      validatePassword(value, errors);
    }

    if (name === 'confirmPassword') {
      errors.confirmPassword =
        formFields.password !== value ? 'Password Not Matched!' : '';
    }

    if (name === 'phoneNumber') {
      errors.phoneNumber = !validatePhoneNumber(value)
        ? 'Invalid phone number'
        : '';
    }

    setInputErrors(errors);
    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      [name]: value
    }));
  };

  const handleSendOtp = () => {
    if (!validatePhoneNumber(formFields.phoneNumber)) {
      setSnackbarMessage('Invalid phone number');
      setSnackbarOpen(true);
      return;
    }

    const otpData = JSON.parse(localStorage.getItem('otpData'));
    if (otpData.count >= OTP_LIMIT) {
      setSnackbarMessage(
        'OTP limit reached for today. You can sign up without phone verification.'
      );
      setSnackbarOpen(true);
      return;
    }

    setShowLoader(true);

    signInWithPhoneNumber(
      auth,
      formFields.phoneNumber,
      window.recaptchaVerifier
    )
      .then((confirmationResult) => {
        setShowLoader(false);
        window.confirmationResult = confirmationResult;
        setIsOtpSent(true);

        otpData.count += 1;
        localStorage.setItem('otpData', JSON.stringify(otpData));
        setOtpCount(otpData.count);
      })
      .catch((error) => {
        setShowLoader(false);
        setSnackbarMessage(error.message);
        setSnackbarOpen(true);
      });
  };

  const handleVerifyOtp = () => {
    const { otp } = formFields;

    if (!otp.trim()) {
      setSnackbarMessage('Please enter the OTP');
      setSnackbarOpen(true);
      return;
    }

    setShowLoader(true);

    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        setShowLoader(false);
        setIsOtpVerified(true);
        setSnackbarMessage('Phone number verified successfully');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setShowLoader(false);
        setSnackbarMessage('Invalid OTP. Please try again.');
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClose = () => {
    setOpenDialog(false);
    navigate('/signIn');
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Account Created Successfully!'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your account has been created successfully. You can now sign in.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Sign In
          </Button>
        </DialogActions>
      </Dialog>

      <section className="signIn mb-5">
        <div className="breadcrumbWrapper res-hide">
          <div className="container-fluid">
            <ul className="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>SignUp</li>
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

            <h3 className="text-center">SignUp</h3>
            <form className="height-fix w-100">
              <div className="form-group mb-4 w-100">
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  className="w-100"
                  placeholder="Email"
                  onChange={onChangeField}
                  value={formFields.email}
                  autoComplete="email"
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
                    autoComplete="new-password"
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

              <div className="form-group mb-4 w-100">
                <div className="position-relative">
                  <TextField
                    id="confirmPassword"
                    type={showPassword1 === false ? 'password' : 'text'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-100"
                    onChange={onChangeField}
                    value={formFields.confirmPassword}
                    autoComplete="new-password"
                    error={inputErrors.confirmPassword}
                  />
                  <Button
                    className="icon"
                    onClick={() => setShowPassword1(!showPassword1)}
                  >
                    {showPassword1 === false ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </Button>
                  {inputErrors.confirmPassword && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {inputErrors.confirmPassword}
                    </Typography>
                  )}
                </div>
              </div>

              {otpCount < OTP_LIMIT && (
                <div className="form-group mb-4 w-100">
                  <TextField
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    className="w-100"
                    placeholder="Phone Number"
                    onChange={onChangeField}
                    value={formFields.phoneNumber}
                    autoComplete="tel"
                  />
                  {inputErrors.phoneNumber && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {inputErrors.phoneNumber}
                    </Typography>
                  )}
                  <Button
                    onClick={handleSendOtp}
                    disabled={!validatePhoneNumber(formFields.phoneNumber)}
                  >
                    Send OTP
                  </Button>
                </div>
              )}

              {isOtpSent && (
                <div className="form-group mb-4 w-100">
                  <TextField
                    id="otp"
                    type="text"
                    name="otp"
                    className="w-100"
                    placeholder="Enter OTP"
                    onChange={onChangeField}
                    value={formFields.otp}
                    autoComplete="one-time-code"
                  />
                  <Button onClick={handleVerifyOtp}>Verify OTP</Button>
                  {inputErrors.otp && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {inputErrors.otp}
                    </Typography>
                  )}
                </div>
              )}

              <div className="form-group mt-5 mb-4 w-100">
                <Button
                  disabled={isDisabled}
                  className="btn btn-g btn-lg w-100"
                  onClick={signUp}
                >
                  Sign Up
                </Button>
              </div>

              <p className="text-center">
                Already have an account?
                <b>
                  <Link to="/signIn">Sign In</Link>
                </b>
              </p>
            </form>
            <div id="recaptcha-container"></div>
          </div>
        </div>
      </section>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </>
  );
};

export default SignUp;
