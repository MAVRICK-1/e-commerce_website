import React, { useState } from "react";
import { Typography, Container, Grid, TextField, Button } from "@mui/material";
import { getDatabase, ref, push } from "firebase/database";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    discountPrice: '',
    weightsAvailable: '',
    mainImage: '',
    subsidiaryImages: [],
    brand: '',
    quantityAvailable: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {
    const db = getDatabase('https://mavrick-1a92d-default-rtdb.firebaseio.com/');
    const productRef = ref(db, 'products');

    // Add email ID to the form data
    const emailId = 'example@example.com'; // Replace this with the actual email ID
    const productDataWithEmail = { ...formData, emailId };

    // Send the form data to Firebase
    push(productRef, productDataWithEmail)
      .then(() => {
        alert('Product added successfully!');
        // Optionally, you can reset the form here
        setFormData({
          productName: '',
          price: '',
          discountPrice: '',
          weightsAvailable: '',
          mainImage: '',
          subsidiaryImages: [],
          brand: '',
          quantityAvailable: '',
        });
      })
      .catch((error) => {
        console.error('Error adding product: ', error);
      });
  };

  return (
    <Container maxWidth="md" sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Add Product
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Fill out the form below to add a product to our store.
      </Typography>
      <Grid container spacing={4}>
        {/* Form fields */}
        {/* onChange event handlers added to handle input changes */}
        {/* values are controlled by the state */}
        <Grid item xs={12} md={6}>
          <TextField
            id="productName"
            label="Product Name"
            fullWidth
            placeholder="Enter product name"
            value={formData.productName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="filled-number"
            label="Price"
            fullWidth
            placeholder="Enter original price"
            type="number"
            variant="filled"
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="filled-number"
            label="Discount Price"
            fullWidth
            placeholder="Enter discount price"
            type="number"
            variant="filled"
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="filled-number"
            label="Weights Available"
            fullWidth
            placeholder="Enter weights"
            type="number"
            variant="filled"
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="main-image"
            InputLabelProps={{ shrink: true }}
            label="Main Image"
            fullWidth
            type="file"
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="subsidiary-images"
            InputLabelProps={{ shrink: true }}
            label="Subsidiary Images"
            fullWidth
            multiple
            type="file"
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="brand"
            label="Brand"
            fullWidth
            placeholder="Enter brand"
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="quantity"
            label="Quantity Available"
            fullWidth
            placeholder="Enter quantity available"
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            color="success"
          />
        </Grid>
        <Grid item xs={12}>
          {/* onClick event handler added to trigger form submission */}
          <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
            Add Product
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}