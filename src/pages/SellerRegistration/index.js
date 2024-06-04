import React, { useEffect, useRef, useState } from 'react';
import {
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  createTheme,
  ThemeProvider,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { db, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef
} from 'firebase/storage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#388e3c'
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '1rem',
          '& .MuiInputBase-input': {
            height: '4.5rem',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '20px'
          },
          '& .MuiInputLabel-root': {
            display: 'flex',
            alignItems: 'center',
            fontSize: '25px',
            fontWeight: 500
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          height: '3rem',
          fontSize: '1rem'
        }
      }
    }
  }
});

const SellerForm = () => {
  const navigate = useNavigate();
  const uploadRef = useRef(null);

  const [formFields, setFormFields] = useState({
    ownerName: '',
    phoneNumber: '',
    location: '',
    pincode: '',
    shopName: '',
    shopPhoto: null,
    coordinate: []
  });

  const [isSubmit, setIsSubmit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
  };

  const handleShopPhotoChange = (files) => {
    const file = files[0];
    setFormFields((prevFields) => ({
      ...prevFields,
      shopPhoto: file
    }));
    setImagePreview(URL.createObjectURL(file));
  };

  let position = [];

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          position = [latitude, longitude];
          setFormFields((prevFields) => ({
            ...prevFields,
            coordinate: position
          }));
        },
        (error) => {
          console.error('Error getting current location:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const addUser = async (userId, photo) => {
    try {
      await setDoc(doc(db, 'sellers', userId), {
        uid: userId,
        ownerName: formFields.ownerName,
        phoneNumber: formFields.phoneNumber,
        location: formFields.location,
        pincode: formFields.pincode,
        shopName: formFields.shopName,
        shopPhoto: photo,
        coordinate: formFields.coordinate
      });
      console.log('User added successfully');
      navigate('/addProduct');
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  const checkUserInSellers = async (userId) => {
    try {
      const sellerDocRef = doc(db, 'sellers', userId);
      const sellerDocSnapshot = await getDoc(sellerDocRef);
      if (sellerDocSnapshot.exists()) {
        console.log('User data exists in sellers collection');
        navigate('/addProduct');
      } else {
        console.log('User data does not exist in sellers collection');
      }
    } catch (error) {
      console.error('Error checking user data: ', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const uniqueKey = localStorage.getItem('uid');

    const imageRef = storageRef(
      storage,
      `sellerImages/${localStorage.getItem('uid')}/shopPhoto`
    );
    await uploadBytes(imageRef, formFields.shopPhoto);
    const imageUrl = await getDownloadURL(imageRef);

    addUser(uniqueKey, imageUrl);

    setIsSubmit(false);
  };

  useEffect(() => {
    checkUserInSellers(localStorage.getItem('uid'));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: handleShopPhotoChange
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        style={{
          marginTop: '150px',
          padding: '40px',
          marginBottom: '50px',
          backgroundColor: 'white',
          boxShadow: '#00000066 5px 5px 10px',
          borderRadius: '20px'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h3"
              align="center"
              fontWeight="bold"
              gutterBottom
            >
              Seller Registration Form
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Owner Name"
                    name="ownerName"
                    value={formFields.ownerName}
                    onChange={onChangeField}
                    color="primary"
                    variant="outlined"
                    InputProps={{
                      style: { alignItems: 'center' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formFields.phoneNumber}
                    onChange={onChangeField}
                    color="primary"
                    variant="outlined"
                    InputProps={{
                      style: { alignItems: 'center' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formFields.location}
                    onChange={onChangeField}
                    color="primary"
                    variant="outlined"
                    InputProps={{
                      style: { alignItems: 'center' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    name="pincode"
                    value={formFields.pincode}
                    onChange={onChangeField}
                    color="primary"
                    variant="outlined"
                    InputProps={{
                      style: { alignItems: 'center' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Shop Name"
                    name="shopName"
                    value={formFields.shopName}
                    onChange={onChangeField}
                    color="primary"
                    variant="outlined"
                    InputProps={{
                      style: { alignItems: 'center' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: '2px dashed #388e3c',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      backgroundColor: '#f0fff4',
                      cursor: 'pointer'
                    }}
                    onClick={() => uploadRef.current.click()}
                  >
                    <input {...getInputProps()} ref={uploadRef} />
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Shop Photo"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    ) : (
                      <>
                        <Typography variant="h6">
                          Drag and drop files here
                        </Typography>
                        <Typography variant="body1">or</Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginTop: '10px' }}
                        >
                          Browse files
                        </Button>
                      </>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGetCurrentLocation}
                    fullWidth
                    style={{ height: '80px', fontSize: 'large' }}
                  >
                    Get Current Location
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ height: '80px', fontSize: 'large' }}
                  >
                    {isSubmit ? 'Registering...' : 'Register'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default SellerForm;
