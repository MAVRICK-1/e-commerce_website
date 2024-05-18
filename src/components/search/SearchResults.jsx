import React from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Alert, Container } from '@mui/material';
import useFetchData from "../../useFetchData";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const { data, loading, error } = useFetchData("https://mavrick-1.github.io/DataApi/data.json");

  if (loading) return <Container sx={{ textAlign: 'center', marginTop: 4 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ textAlign: 'center', marginTop: 4 }}><Alert severity="error">Error loading data</Alert></Container>;

  const filteredProducts = data.productData
    .flatMap(category =>
      category.cat_name.toLowerCase().includes(query.toLowerCase())
        ? category.items.flatMap(item => item.products)
        : category.items.flatMap(item =>
          item.products.filter(product =>
            product.productName.toLowerCase().includes(query.toLowerCase())
          )
        )
    );

  return (
    <Container sx={{ marginTop: 4 }} maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ marginTop: '20px' }}>
        Search Results for "{query}"
      </Typography>
      <Grid container spacing={4}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #ccc', borderRadius: '8px',background:"#3bb77e " }}>
                <CardMedia
                  component="img"
                  height="100%"
                  image={product.productImages[0]} 
                  alt={product.productName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.productName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    Old Price: ${product.oldPrice}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Discount: {product.discount}%
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Rating: {product.rating}
                  </Typography>
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
