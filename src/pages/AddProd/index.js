import React, { useState } from 'react';
import { Typography, Container, Grid, TextField, Button } from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    discountPrice: '',
    weightsAvailable: '',
    mainImage: '',
    subsidiaryImages: [],
    brand: '',
    quantityAvailable: ''
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFields) => ({
      ...prevFields,
      mainImage: file
    }));
  };

  const handleSubImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFields) => ({
      ...prevFields,
      subsidiaryImages: file
    }));
  };

  const addProd = async (main, sub) => {
    // funtion to add products data to firestore
    try {
      await addDoc(
        collection(db, 'sellers', localStorage.getItem('uid'), 'products'),
        {
          productName: formData.productName,
          price: formData.price,
          discountPrice: formData.discountPrice,
          weightsAvailable: formData.weightsAvailable,
          mainImage: main,
          subsidiaryImages: sub,
          brand: formData.brand,
          quantityAvailable: formData.quantityAvailable
        }
      );

      console.log('product added successfully');
      setFormData({
        productName: '',
        price: '',
        discountPrice: '',
        weightsAvailable: '',
        mainImage: '',
        subsidiaryImages: [],
        brand: '',
        quantityAvailable: ''
      });
      alert('Product Added successfully!');
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmit(true);
    //Upload the main image to firebase storage and get url
    const imageRef = ref(
      storage,
      `productImages/${localStorage.getItem('uid')}/${
        formData.productName
      }/mainImage`
    );
    await uploadBytes(imageRef, formData.mainImage);
    const imageUrl = await getDownloadURL(imageRef);

    //Upload the subsidiary image to firebase storage and get url
    const imageRef1 = ref(
      storage,
      `productImages/${localStorage.getItem('uid')}/${
        formData.productName
      }/subsidiaryImages`
    );
    await uploadBytes(imageRef1, formData.subsidiaryImages);
    const imageUrl1 = await getDownloadURL(imageRef1);

    //Adding products data to firebase firestore
    addProd(imageUrl, imageUrl1);
    setIsSubmit(false);
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
            onChange={handleMainImageChange}
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
            onChange={handleSubImageChange}
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
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            color="success"
            value={formData.quantityAvailable}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          {/* onClick event handler added to trigger form submission */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSubmit}
          >
            {isSubmit ? 'adding...' : 'Add Product'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
