import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../SignIn/style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import {
  Button,
  Snackbar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Typography
} from '@mui/material';
import { getAuth, updatePassword } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const auth = getAuth();

const ChangePassword = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [formFields, setFormFields] = useState({
    password: '',
    confirmPassword: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const [InputErrors, setInputErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  const checkInputs = (password, confirmPassword) => {
    if (password.trim() !== '' && confirmPassword.trim() !== '') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const changePassword = () => {
    setShowLoader(true);
    const user = auth.currentUser;

    if (!user) {
      setShowLoader(false);
      setSnackbarMessage('No user is currently signed in.');
      setSnackbarOpen(true);
      return;
    }

    // Check for password strength
    if (formFields.password.length < 6) {
      setShowLoader(false);
      setSnackbarMessage(
        'Password is too weak. It must be at least 6 characters long.'
      );
      setSnackbarOpen(true);
      return;
    }

    updatePassword(user, formFields.password)
      .then(() => {
        setShowLoader(false);
        setFormFields({
          password: '',
          confirmPassword: ''
        });
        setOpenDialog(true);
      })
      .catch((error) => {
        setShowLoader(false);
        const errorMessage = error.message;
        console.error('Error changing password:', errorMessage);
        setSnackbarMessage(errorMessage);
        setSnackbarOpen(true);
      });
  };

  const validatePassword = (password, error) => {
    if (password.length < 6) {
      error.password = 'Password must be at least 6 characters long';
      return false;
    }

    const hasSpecialSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const hasUppercase = /[A-Z]+/;
    const hasLowercase = /[a-z]+/;
    const hasDigit = /[0-9]+/;

    if (!hasSpecialSymbol.test(password)) {
      error.password = 'Password must contain at least one special symbol';
      return false;
    }

    if (!hasUppercase.test(password)) {
      error.password = 'Password must contain at least one uppercase letter';
      return false;
    }

    if (!hasLowercase.test(password)) {
      error.password = 'Password must contain at least one lowercase letter';
      return false;
    }

    if (!hasDigit.test(password)) {
      error.password = 'Password must contain at least one digit';
      return false;
    }

    error.password = '';
    return true;
  };

  const onChangeField = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    let errors = { ...InputErrors };

    if (name === 'password') {
      validatePassword(value, errors);
    }

    if (name === 'confirmPassword') {
      errors.confirmPassword =
        formFields.password !== value ? 'Password Not Matched!' : '';
    }

    setInputErrors(errors);
    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      [name]: value
    }));
    checkInputs(formFields.password, value);
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
          {'Password Changed Successfully!'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your password has been changed successfully. You can now sign in
            with your new password.
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
              <li>Change Password</li>
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

            <h3 className="text-center">Change Your Password</h3>
            <form className="mt-4 w-100">
              <div className="form-group mb-4 w-100">
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
                  {InputErrors.email && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {InputErrors.email}
                    </Typography>
                  )}
                </div>

                <div className="position-relative ">
                  <TextField
                    id="password"
                    type={showPassword === false ? 'password' : 'text'}
                    name="password"
                    placeholder="New Password"
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
                  {InputErrors.password && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {InputErrors.password}
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
                    placeholder="Confirm New Password"
                    className="w-100"
                    onChange={onChangeField}
                    value={formFields.confirmPassword}
                    autoComplete="new-password"
                    error={InputErrors.confirmPassword}
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
                  {InputErrors.confirmPassword && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {InputErrors.confirmPassword}
                    </Typography>
                  )}
                </div>
              </div>

              <div className="form-group mt-5 mb-4 w-100">
                <Button
                  disabled={isDisabled}
                  className="btn btn-g btn-lg w-100"
                  onClick={changePassword}
                >
                  Change Password
                </Button>
              </div>

              <p className="text-center">
                Remember Your Password?
                <b>
                  <Link to="/signIn"> Sign In</Link>
                </b>
              </p>
            </form>
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
            CLOSE
          </Button>
        }
      />
    </>
  );
};

export default ChangePassword;
