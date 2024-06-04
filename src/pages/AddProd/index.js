import React, { useState, useCallback } from 'react';
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
import { useDropzone } from 'react-dropzone';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

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

const dropzoneStyles = {
  border: '2px dashed #388e3c',
  padding: '1rem',
  textAlign: 'center',
  color: '#388e3c',
  borderRadius: '8px',
  cursor: 'pointer',
  marginBottom: '1rem',
  backgroundColor: '#f0fff4',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100px'
};

const imagePreviewStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: '0.5rem'
};

const imageStyle = {
  width: '100px',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '4px'
};

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    discountPrice: '',
    weightsAvailable: '',
    mainImage: '',
    mainImagePreview: '',
    subsidiaryImages: [],
    subsidiaryImagesPreview: [],
    brand: '',
    quantityAvailable: ''
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onDropMainImage = useCallback((acceptedFiles) => {
    setFormData((prevFields) => ({
      ...prevFields,
      mainImage: acceptedFiles[0],
      mainImagePreview: URL.createObjectURL(acceptedFiles[0])
    }));
  }, []);

  const onDropSubImage = useCallback((acceptedFiles) => {
    const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
    setFormData((prevFields) => ({
      ...prevFields,
      subsidiaryImages: acceptedFiles,
      subsidiaryImagesPreview: previews
    }));
  }, []);

  const {
    getRootProps: getMainImageRootProps,
    getInputProps: getMainImageInputProps
  } = useDropzone({ onDrop: onDropMainImage });
  const {
    getRootProps: getSubImageRootProps,
    getInputProps: getSubImageInputProps
  } = useDropzone({ onDrop: onDropSubImage });

  const addProd = async (main, sub) => {
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
        mainImagePreview: '',
        subsidiaryImages: [],
        subsidiaryImagesPreview: [],
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
    const imageRef = ref(
      storage,
      `productImages/${localStorage.getItem('uid')}/${
        formData.productName
      }/mainImage`
    );
    await uploadBytes(imageRef, formData.mainImage);
    const imageUrl = await getDownloadURL(imageRef);

    const subsidiaryImageUrls = [];
    for (const file of formData.subsidiaryImages) {
      const imageRef1 = ref(
        storage,
        `productImages/${localStorage.getItem('uid')}/${
          formData.productName
        }/subsidiaryImages/${file.name}`
      );
      await uploadBytes(imageRef1, file);
      const imageUrl1 = await getDownloadURL(imageRef1);
      subsidiaryImageUrls.push(imageUrl1);
    }

    addProd(imageUrl, subsidiaryImageUrls);
    setIsSubmit(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{ padding: 4 }}
        style={{
          marginTop: '250px',
          padding: '40px',
          marginBottom: '50px',
          backgroundColor: 'white',
          boxShadow: '#00000066 5px 5px 10px',
          borderRadius: '20px'
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Add Product
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          style={{ marginBottom: '30px' }}
          gutterBottom
        >
          Fill out the form below to add a product to our store.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              id="productName"
              label="Product Name"
              fullWidth
              placeholder="Enter product name"
              value={formData.productName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="price"
              label="Price"
              fullWidth
              placeholder="Enter original price"
              type="number"
              color="success"
              value={formData.price}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="discountPrice"
              label="Discount Price"
              fullWidth
              placeholder="Enter discount price"
              type="number"
              variant="outlined"
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
              variant="outlined"
              color="success"
              value={formData.weightsAvailable}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {formData.mainImagePreview && (
              <Typography variant="h6">Main Image</Typography>
            )}
            <Box
              {...getMainImageRootProps()}
              sx={{
                border: '2px dashed #388e3c',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f0fff4',
                cursor: 'pointer'
              }}
            >
              <input {...getMainImageInputProps()} />
              {formData.mainImagePreview ? (
                <img
                  src={formData.mainImagePreview}
                  alt="Main Preview"
                  style={imageStyle}
                />
              ) : (
                <Typography variant="h6" color="green">
                  Drag and drop{' '}
                  <span style={{ fontWeight: 'bolder' }}>main image</span> here,
                  or click to select file
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            {formData.subsidiaryImagesPreview.length > 0 && (
              <Typography variant="h6">Subsidiary Images</Typography>
            )}
            <Box
              {...getSubImageRootProps()}
              sx={{
                border: '2px dashed #388e3c',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f0fff4',
                cursor: 'pointer'
              }}
            >
              <input {...getSubImageInputProps()} />
              {formData.subsidiaryImagesPreview.length > 0 ? (
                <div>
                  {formData.subsidiaryImagesPreview.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Sub Preview ${index}`}
                      style={imageStyle}
                    />
                  ))}
                </div>
              ) : (
                <Typography variant="h6" color="green">
                  Drag and drop{' '}
                  <span style={{ fontWeight: 'bold' }}>subsidiary images</span>{' '}
                  here, or click to select files
                </Typography>
              )}
            </Box>
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
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={handleSubmit}
              style={{ padding: '30px', fontSize: '28px' }}
            >
              {isSubmit ? 'Adding...' : 'Add Product'}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
