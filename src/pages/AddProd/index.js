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
    const db = getDatabase();
    const productRef = ref(db, `seller/${localStorage.getItem('user')}/product`);

    // Add email ID to the form data
    // Send the form data to Firebase
    const productData = {
      productName: formData.productName,
      price: formData.price,
      discountPrice: formData.discountPrice,
      weightsAvailable: formData.weightsAvailable,
      mainImage: formData.mainImage,
      subsidiaryImages: formData.subsidiaryImages,
      brand: formData.brand,
      quantityAvailable: formData.quantityAvailable,
    };
    push(productRef,productData)
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
            id="price"
            label="Price"
            fullWidth
            placeholder="Enter original price"
            type="number"
            variant="filled"
            color="success"
            value={formData.price}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="discountPrice"
            label="Discount Price"
            fullWidth
            placeholder="Enter discount price"
            type="number"
            variant="filled"
            color="success"
            value={formData.discountPrice}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="weightsAvailable"
            label="Weights Available"
            fullWidth
            placeholder="Enter weights"
            type="number"
            variant="filled"
            color="success"
            value={formData.weightsAvailable}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="mainImage"
            InputLabelProps={{ shrink: true }}
            label="Main Image"
            fullWidth
            type="file"
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="subsidiaryImages"
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
            value={formData.brand}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="quantityAvailable"
            label="Quantity Available"
            fullWidth
            placeholder="Enter quantity available"
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            color="success"
            value={formData.quantityAvailable}
            onChange={handleChange}
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
