import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, TextField, Button } from '@mui/material';
//import { getDatabase, ref, push, set, child } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

const SellerForm = () => {
  const navigate = useNavigate();

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

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value
    }));
  };

  const handleShopPhotoChange = (e) => {
    const file = e.target.files[0];
    setFormFields((prevFields) => ({
      ...prevFields,
      shopPhoto: file
    }));
  };
  let postion = [];

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          postion = [latitude, longitude];
          //console.log("Current latitude:", latitude);
          //console.log("Current longitude:", longitude);

          // Optionally, you can set the latitude and longitude in the formFields state
          setFormFields((prevFields) => ({
            ...prevFields,
            coordinate: postion
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
    // funtion to add sellers data to firestore
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
    // funtion to check seller is already exists or not in firestore
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
    // Generate a unique key
    const uniqueKey = localStorage.getItem('uid');

    //Upload the shop photo image to firebase storage and get url
    const imageRef = ref(
      storage,
      `sellerImages/${localStorage.getItem('uid')}/shopPhoto`
    );
    await uploadBytes(imageRef, formFields.shopPhoto);
    const imageUrl = await getDownloadURL(imageRef);

    //Adding seller data to firebase firestore
    addUser(uniqueKey, imageUrl);

    setIsSubmit(false);
  };

  useEffect(() => {
    checkUserInSellers(localStorage.getItem('uid'));
  }, []);

  return (
    <Container
      style={{ marginTop: '90px', padding: '20px', marginBottom: '50px' }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
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
                  color="success"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formFields.phoneNumber}
                  onChange={onChangeField}
                  color="success"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formFields.location}
                  onChange={onChangeField}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formFields.pincode}
                  onChange={onChangeField}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Shop Name"
                  name="shopName"
                  value={formFields.shopName}
                  onChange={onChangeField}
                  color="success"
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleShopPhotoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="success" // Change color to success
                  onClick={handleGetCurrentLocation}
                  fullWidth
                >
                  Get Current Location
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success" // Change color to success
                  fullWidth
                >
                  {isSubmit ? 'Registering...' : 'Register'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SellerForm;
