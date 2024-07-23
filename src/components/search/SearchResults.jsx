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
import useFetchData from '../../useFetchData';
import Product from '../product';
import './style.css'

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
    <Container className='searchbox_conatiner' >
      <div className='searchbox'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product,index) => (
            <div className="item" key={index}>
                      <Product tag={product.type} item={product} />
                    </div>
          ))
        ) : (
          <Typography variant="body1" component="p">
            No results found
          </Typography>
        )}
      </div>
    </Container>
  );
};

export default SearchResults;
