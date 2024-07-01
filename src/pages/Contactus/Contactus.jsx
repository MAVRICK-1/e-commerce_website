import React, { useRef, useState } from 'react';
import './contactus.css';
import emailjs from '@emailjs/browser';
import { Button, Snackbar, TextareaAutosize, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

import MapIcon from '@mui/icons-material/Map';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Contactus() {
  let form = useRef();
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
  const serviceId = '';
  const templateId = '';
  const publicKey = '';

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const onChangeField = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    let errors = { ...inputErrors };

    // Validate email
    if (name === 'user_email') {
      errors.user_email = !validateEmail(value) ? 'Invalid email address' : '';
    }

    if (name == 'user_name' && value.length > 0) {
      errors.user_name = '';
    }
    if (name == 'message' && value.length > 0) {
      errors.message = '';
    }
    setInputErrors(errors);
    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      [name]: value
    }));
  };
  const handleClick = (e) => {
    e.preventDefault();
    let errors = { ...inputErrors };

    if (formFields.user_name.length == 0) {
      errors.user_name = 'Please Enter Name';
      setInputErrors(errors);
      return;
    } else if (formFields.message.length == 0) {
      errors.message = 'please Enter message';
      setInputErrors(errors);
      return;
    } else if (formFields.user_email.length == 0) {
      errors.user_email = 'please Enter Email';
      setInputErrors(errors);
      return;
    }
    if (
      inputErrors.user_email ||
      inputErrors.message ||
      inputErrors.user_name
    ) {
      return;
    }
    console.log(formFields);
    emailjs
      .sendForm(serviceId, templateId, form.current, {
        publicKey: publicKey
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error);
        }
      );
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
              <form ref={form} className='contact-form'>
                {/* <div className="contact-input contact-input-light">
                  <TextField
                    id="user_name"
                    type="text"
                    name="user_name"
                    autoFocus="on"
                    autoComplete="off"
                    placeholder="Your Name"
                    
                    onChange={onChangeField}
                    value={formFields.user_name}
                    error={inputErrors.user_name}
                  />
                  {inputErrors.user_name && (
                    <Typography
                      variant="caption"
                      style={{ fontSize: '1.4rem' }}
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {inputErrors.user_name}
                    </Typography>
                  )}
                </div>
                <div className="contact-input contact-input-light">
                  <TextField
                    id="user_email"
                    type="email"
                    name="user_email"
                    placeholder="Your Email"
                    
                    onChange={onChangeField}
                    value={formFields.user_email}
                    autoComplete="email"
                    error={inputErrors.user_email}
                  />
                  {inputErrors.user_email && (
                    <Typography
                      variant="caption"
                      style={{ fontSize: '1.4rem' }}
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {inputErrors.user_email}
                    </Typography>
                  )}
                </div>

                <div className="contact-input contact-input-light">
                  <TextareaAutosize
                    id="message"
                    type="text"
                    autoComplete="off"
                    name="message"
                    placeholder="Your Message"
                    
                    onChange={onChangeField}
                    value={formFields.message}
                    error={inputErrors.message}
                  />
                  {inputErrors.message && (
                    <Typography
                      variant="caption"
                      style={{ fontSize: '1.4rem' }}
                      sx={{ color: 'red', padding: '5px' }}
                    >
                      {inputErrors.message}
                    </Typography>
                  )}
                  
                </div> */}
                <input
                  id="user_name"
                  name="user_name"
                  autoFocus="on"
                  autoComplete="off"
                  onChange={onChangeField}
                  value={formFields.user_name}
                  error={inputErrors.user_name}
                  type="text"
                  placeholder="Your Name"
                />
                <input
                  id="user_email"
                  type="email"
                  name="user_email"
                  placeholder="Your Email"
                  onChange={onChangeField}
                  value={formFields.user_email}
                  autoComplete="email"
                  error={inputErrors.user_email}
                />
                <input
                  id="message"
                  type="text"
                  autoComplete="off"
                  name="message"
                  placeholder="Your Message"
                  onChange={onChangeField}
                  value={formFields.message}
                  error={inputErrors.message}
                />
                <div className="submit-btn">
                  <Button
                    className="btn btn-g btn-lg w-100"
                    onClick={handleClick}
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </React.Fragment>
      </div>
      <section className="section-p1">
        <div className="details">
          <span>GET IN TOUCH</span>
          <h2>Visit one of our agency locations or contact us today</h2>
          <h3>Head Office</h3>
          <div>
            <li>
              <MapIcon />
              <p>5171 W Campbell Ave undefined Kent, Utah 53127 United States</p>
            </li>
            <li>
              <EmailIcon />
              <p>sale@Nest.com</p>
            </li>
            <li>
              <PhoneIcon />
              <p>(+91) - 540-025-124553</p>
            </li>
            <li>
              <AccessTimeIcon />
              <p>Monday-Saturday 10:00 am to 6:00 pm</p>
            </li>
          </div>
        </div>
        <div className="map">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153898.0090667806!2d-114.18749901456506!3d39.46981386754793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x874c6bc78f13f9cd%3A0xbddf4aa56cd7463f!2sUtah%2C%20USA!5e0!3m2!1sen!2sin!4v1719849554647!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </section>
    </div>
  );
}
