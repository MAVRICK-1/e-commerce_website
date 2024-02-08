import React, { useState } from "react";
import { Typography, Container, Grid, TextField, Button } from "@mui/material";
import { getDatabase, ref, push, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const SellerForm = () => {
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    ownerName: "",
    phoneNumber: "",
    location: "",
    pincode: "",
    shopName: "",
    shopPhoto: null,
    location:[]
  });

  const onChangeField = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleShopPhotoChange = (e) => {
    const file = e.target.files[0];
    setFormFields((prevFields) => ({
      ...prevFields,
      shopPhoto: file,
    }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          //location=[latitude,longitude]
          console.log("Current latitude:", latitude);
          console.log("Current longitude:", longitude);
          
          // Optionally, you can set the latitude and longitude in the formFields state
          setFormFields((prevFields) => ({
            ...prevFields,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error("Error getting current location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const database = getDatabase();
      const sellersRef = ref(database, "sellers");

      const newSellerRef = push(sellersRef);
      await set(newSellerRef, {
        ownerName: formFields.ownerName,
        phoneNumber: formFields.phoneNumber,
        location: formFields.location,
        pincode: formFields.pincode,
        shopName: formFields.shopName,
        // Handle shop photo upload here
        // shopPhoto: formFields.shopPhoto,
      });

      console.log("Seller data sent to Firebase successfully!");

      // Redirect to '/addProduct' page
      navigate("/addProduct");
    } catch (error) {
      console.error("Error sending data to Firebase:", error.message);
    }
  };

  return (
    <Container style={{marginTop:'30px'}}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Seller Registration Form
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Owner Name"
                  name="ownerName"
                  value={formFields.ownerName}
                  onChange={onChangeField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formFields.phoneNumber}
                  onChange={onChangeField}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formFields.location}
                  onChange={onChangeField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formFields.pincode}
                  onChange={onChangeField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shop Name"
                  name="shopName"
                  value={formFields.shopName}
                  onChange={onChangeField}
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
                  color="primary"
                  onClick={handleGetCurrentLocation}
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
                >
                  Register
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