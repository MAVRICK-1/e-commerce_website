import React from "react";
import { Typography, Container, Grid, TextField, Button } from "@mui/material";

export default function AddProductForm() {
  return (
    <Container maxWidth="md" sx={{ padding: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Add Product
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Fill out the form below to add a product to our store.
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <TextField
            id="product-name"
            label="Product Name"
            fullWidth
            placeholder="Enter product name"
            color="success"
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
          <Button variant="contained" color="success" fullWidth>
            Add Product
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
