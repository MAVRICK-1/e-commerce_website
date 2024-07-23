import { Button, TextareaAutosize, TextField, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './contactus.css';

export default function Contactus() {
  const form = useRef();
  const [formFields, setFormFields] = useState({
    user_email: '',
    user_name: '',
    message: ''
  });
  const [inputErrors, setInputErrors] = useState({
    user_email: '',
    user_name: '',
    message: ''
  });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onChangeField = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    let errors = { ...inputErrors };

    if (name === 'user_email') {
      errors.user_email = !validateEmail(value) ? 'Invalid email address' : '';
    }

    if (name === 'user_name' && value.length > 0) {
      errors.user_name = '';
    }
    if (name === 'message' && value.length > 0) {
      errors.message = '';
    }

    setInputErrors(errors);
    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let errors = { ...inputErrors };

    if (formFields.user_name.length === 0) {
      errors.user_name = 'Please Enter Name';
    }
    if (formFields.message.length === 0) {
      errors.message = 'Please Enter Message';
    }
    if (formFields.user_email.length === 0) {
      errors.user_email = 'Please Enter Email';
    }

    setInputErrors(errors);

    if (errors.user_email || errors.message || errors.user_name) {
      return;
    }

    setFormFields({
      user_email: '',
      user_name: '',
      message: ''
    });

    toast.success('Sent Successfully!', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Slide,
      closeButton: true,
      style: { fontSize: '16px' }
    });
  };

  return (
    <div className="contact-section-light">
      <div className="contact-parent">
        <React.Fragment>
          <div className="contact-card contact-card-light">
            <h1 className="contact-header-text contact-header-text-light">
              Get In Touch
            </h1>
            <div className="inside-contact">
              <form ref={form} onSubmit={handleSubmit}>
                <div className="contact-input contact-input-light">
                  <TextField
                    id="user_name"
                    type="text"
                    name="user_name"
                    autoFocus
                    autoComplete="off"
                    placeholder="Your Name"
                    style={{ width: '100%' }}
                    onChange={onChangeField}
                    value={formFields.user_name}
                    error={!!inputErrors.user_name}
                    helperText={inputErrors.user_name}
                  />
                </div>
                <br />
                <div className="contact-input contact-input-light">
                  <TextField
                    id="user_email"
                    type="email"
                    name="user_email"
                    placeholder="Your Email"
                    onChange={onChangeField}
                    value={formFields.user_email}
                    autoComplete="email"
                    style={{ width: '100%' }}
                    error={!!inputErrors.user_email}
                    helperText={inputErrors.user_email}
                    InputProps={{
                      style: { fontSize: '1.2rem', padding: '10px' }
                    }}
                  />
                </div>
                <br />
                <div className="contact-input contact-input-light">
                  <TextareaAutosize
                    id="message"
                    type="text"
                    autoComplete="off"
                    name="message"
                    placeholder="Your Message"
                    onChange={onChangeField}
                    value={formFields.message}
                    style={{
                      width: '100%',
                      height: '100px',
                      padding: '10px',
                      fontSize: '1.2rem'
                    }}
                    className={inputErrors.message ? 'error' : ''}
                  />
                  {inputErrors.message && (
                    <Typography
                      variant="caption"
                      style={{ fontSize: '1rem' }}
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {inputErrors.message}
                    </Typography>
                  )}
                </div>
                <br />
                <div className="submit-btn">
                  <Button
                    type="submit"
                    className="btn btn-g btn-lg w-100"
                    style={{ fontSize: '1.2rem' }}
                  >
                    Submit
                  </Button>
                </div>
              </form>
              <ToastContainer />
            </div>
          </div>
        </React.Fragment>
      </div>
    </div>
  );
}
