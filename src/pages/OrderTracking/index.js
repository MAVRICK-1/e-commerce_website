import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setOrderId(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = () => {
    if (orderId.trim() === '') {
      setError('Order ID is required');
      return;
    }

    // Assuming Order ID should be a certain format, add your validation logic here
    if (!/^[a-zA-Z0-9]+$/.test(orderId)) {
      setError('Invalid Order ID format');
      return;
    }

    navigate(`/track-my-order/${orderId}`);
  };

  return (
    <Box width={'100%'} height={'100%'} minHeight={'100vh'} p={5}>
      <Stack
        direction="row"
        sx={{
          gap: '30px'
        }}
        alignItems={'center'}
      >
        <ArrowBackIosNewIcon fontSize={'medium'} />
        <Typography variant="body">Order Tracking</Typography>
      </Stack>

      <Stack
        width={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
        my={4}
      >
        <Box
          width={'500px'}
          p={2}
          borderRadius={'10px'}
          borderColor={'gray'}
          border={'1px solid gray'}
        >
          <Typography
            variant="title"
            textTransform={'uppercase'}
            fontWeight={900}
            my={3}
          >
            Track Your Order
          </Typography>
          <TextField
            fullWidth
            sx={{
              my: 3,
              fontSize: 20
            }}
            id="order-id"
            label="Order ID"
            variant="outlined"
            name="orderId"
            className="w-100"
            placeholder="Enter Your Order ID"
            size="medium"
            value={orderId}
            onChange={handleInputChange}
            error={Boolean(error)}
            helperText={error}
          />
          <Button
            sx={{
              mx: 'auto',
              width: '100%',
              my: 2
            }}
            variant="contained"
            color="success"
            onClick={handleSubmit}
          >
            Track My Order
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
