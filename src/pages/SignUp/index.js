import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Button, Snackbar } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebase';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const auth = getAuth(app);

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [formFields, setFormFields] = useState({
        email: '',
        password: '',
        conformPassword: ''
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const signUp = () => {
        setShowLoader(true);
        // Check for password strength
        if (formFields.password.length < 6) {
            setShowLoader(false);
            setSnackbarMessage('Password is too weak. It must be at least 6 characters long.');
            setSnackbarOpen(true);
            return;
        }
        createUserWithEmailAndPassword(auth, formFields.email, formFields.password)
            .then((userCredential) => {
                //console.log("User signed up successfully:", userCredential.user);
                setShowLoader(false);
                setFormFields({
                    email:'',
                    password:'',
                    conformPassword:''
                });
            })
            .catch((error) => {
                setShowLoader(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error signing up:", errorMessage);
                setSnackbarMessage(errorMessage);
                setSnackbarOpen(true);
            });
    }

    const onChangeField = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormFields(() => ({
            ...formFields,
            [name]: value,
        }));
    }

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    }

    return (
        <>
            <section className='signIn mb-5'>
                <div className="breadcrumbWrapper res-hide">
                    <div className="container-fluid">
                        <ul className="breadcrumb breadcrumb2 mb-0">
                            <li><Link to="/">Home</Link></li>
                            <li>SignUp</li>
                        </ul>
                    </div>
                </div>

                <div className='loginWrapper'>
                    <div className='card shadow'>
                        <Backdrop
                            sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={showLoader}
                            className="formLoader"
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                        <h3>SignUp</h3>
                        <form className='mt-4'>
                            <div className='form-group mb-4 w-100'>
                                <TextField id="email" type="email" name='email' label="Email" className='w-100' onChange={onChangeField}  value={formFields.email} autoComplete='email'/>
                            </div>
                            <div className='form-group mb-4 w-100'>
                                <div className='position-relative'>
                                    <TextField id="password" type={showPassword === false ? 'password' : 'text'} name='password' label="Password" className='w-100' onChange={onChangeField} 
                                     value={formFields.password} 
                                     autoComplete='new-password'/>
                                    <Button className='icon' onClick={() => setShowPassword(!showPassword)}>
                                        {
                                            showPassword === false ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
                                        }

                                    </Button>
                                </div>

                            </div>

                            <div className='form-group mb-4 w-100'>
                                <div className='position-relative'>
                                    <TextField id="conformPassword" type={showPassword1 === false ? 'password' : 'text'} name='conformPassword' label="Confirm Password" className='w-100' onChange={onChangeField}  value={formFields.conformPassword} autoComplete='new-password'/>
                                    <Button className='icon' onClick={() => setShowPassword1(!showPassword1)}>
                                        {
                                            showPassword1 === false ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
                                        }

                                    </Button>
                                </div>

                            </div>

                            <div className='form-group mt-5 mb-4 w-100'>
                                <Button className='btn btn-g btn-lg w-100' onClick={signUp}>Sign Up</Button>
                            </div>

                            <p className='text-center'>Already have an account?
                                <b><Link to="/signIn">Sign In</Link></b>
                            </p>
                        </form>
                    </div>
                </div>
            </section>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
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
}

export default SignUp;