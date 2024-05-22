import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Container,
  Rating,
  IconButton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import useFetchData from '../../useFetchData';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const { data, loading, error } = useFetchData(
    'https://mavrick-1.github.io/DataApi/data.json'
  );

  if (loading)
    return (
      <Container sx={{ textAlign: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Container>
    );
  if (error)
    return (
      <Container sx={{ textAlign: 'center', marginTop: 4 }}>
        <Alert severity="error">Error loading data</Alert>
      </Container>
    );

  const filteredProducts = data.productData.flatMap((category) =>
    category.cat_name.toLowerCase().includes(query.toLowerCase())
      ? category.items.flatMap((item) => item.products)
      : category.items.flatMap((item) =>
          item.products.filter((product) =>
            product.productName.toLowerCase().includes(query.toLowerCase())
          )
        )
  );

  return (
    <Container sx={{ marginTop: 10, marginBottom: 10 }} maxWidth="xl">
      <Grid container spacing={4}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  position: 'relative', // Add this for positioning the heart icon
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    cursor: 'pointer'
                  }
                }}
              >
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    color: 'red'
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
                <CardMedia
                  component="img"
                  height="100%"
                  image={product.productImages[0]}
                  alt={product.productName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Product Name */}
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: 'blue'
                      }
                    }}
                  >
                    {product.productName}
                  </Typography>
                  {/* Rating and Brand Name */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}
                  >
                    <Rating
                      name="product-rating"
                      value={product.rating}
                      readOnly
                      precision={0.5}
                      emptyIcon={
                        <StarIcon
                          style={{ opacity: 0.55 }}
                          fontSize="inherit"
                        />
                      }
                    />
                    <Typography
                      sx={{
                        marginLeft: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        backgroundColor: 'green', // Background color
                        padding: '8px 30px',
                        borderRadius: '4px',
                        color: '#fff'
                      }}
                    >
                      {product.brand}
                    </Typography>
                  </Typography>
                  {/* Price, Old Price, Discount */}
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '8px'
                    }}
                  >
                    <h1
                      style={{
                        color: 'black',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        marginRight: '8px'
                      }}
                    >
                      ₹{product.price}
                    </h1>
                    <Typography
                      sx={{
                        color: 'gray',
                        fontSize: '22px',
                        textDecoration: 'line-through',
                        marginRight: '8px'
                      }}
                    >
                      ₹{product.oldPrice}
                    </Typography>
                    <p
                      style={{
                        color: 'green',
                        fontSize: '22px',
                        letterSpacing: '-.2px',
                        fontWeight: '500'
                      }}
                    >
                      {product.discount}% off
                    </p>
                  </Typography>
                  {/* Additional Info */}
                  <p
                    style={{
                      color: 'black',
                      fontSize: '18px',
                      fontWeight: 700
                    }}
                  >
                    Free delivery
                  </p>
                  <p
                    style={{
                      color: 'red',
                      fontSize: '18px',
                      fontWeight: 700
                    }}
                  >
                    Only Few Left
                  </p>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" component="p">
            No results found
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default SearchResults;
