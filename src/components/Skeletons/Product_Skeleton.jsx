import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const Product_Skeleton = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '1rem',
    boxSizing: 'border-box'
  };

  return (
    <div style={containerStyle}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height="32rem"
        style={{ maxWidth: '28rem' }}
        animation="pulse"
      />
    </div>
  );
};

export default Product_Skeleton;
