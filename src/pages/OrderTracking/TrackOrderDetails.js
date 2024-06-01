import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useParams, useNavigate } from 'react-router-dom';
import StepCounter from '../../components/OrderTracking/StepCounter';
import { CopyAll } from '@mui/icons-material';
import OrderTable from '../../components/OrderTracking/OrderTable';
import { db } from '../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const fetchOrderDetails = async (orderId) => {
  const docRef = doc(db, 'orders', orderId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error('Order not found');
  }

  const orderData = docSnap.data();
  const orderItemsCollectionRef = collection(
    db,
    'orders',
    orderId,
    'order_items'
  );
  const orderItemsSnapshot = await getDocs(orderItemsCollectionRef);
  const orderItems = orderItemsSnapshot.docs.map((doc) => doc.data());

  // Convert Firestore timestamps to JavaScript Date objects
  if (orderData.orderDate) {
    orderData.orderDate = orderData.orderDate.toDate().toLocaleDateString();
  }

  return { ...orderData, orderItems };
};

export default function TrackOrderDetails() {
  const { orderid } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderTablerows, setOrderTablerows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState({
    copied: false,
    message: ''
  });
  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await fetchOrderDetails(orderid);
        setOrderDetails(data);
        setOrderTablerows(data.orderItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [orderid]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied({
          copied: true,
          message: 'Link copied to Successfully'
        });
      })
      .catch((err) => {
        setCopied({
          copied: false,
          message: 'Error while copying link'
        });
      });

    setTimeout(() => {
      setCopied({
        copied: false,
        message: ''
      });
    }, 1000);
  };

  if (loading) {
    return (
      <Box
        width={'100%'}
        minHeight={'100vh'}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        width={'100%'}
        minHeight={'100vh'}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        p={3}
        borderRadius={2}
        textAlign="center"
      >
        <Typography
          variant="h3"
          mb={4}
          textTransform={'uppercase'}
          fontWeight={'800'}
          color={'red'}
        >
          {error}
        </Typography>
        <Button
          size="large"
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={handleBack}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box width={'100%'} minHeight={'100vh'} p={3}>
      <Stack direction="row" sx={{ gap: '30px' }} alignItems={'center'}>
        <ArrowBackIosNewIcon
          fontSize={'medium'}
          onClick={handleBack}
          style={{ cursor: 'pointer' }}
        />
        <Typography variant="body">Order Tracking Details</Typography>
      </Stack>

      <Stack direction={'column'} spacing={5} my={4}>
        <Box>
          <Stack
            direction={'row'}
            spacing={3}
            alignItems={'center'}
            justifyContent={'start'}
          >
            <Typography variant="h4" fontWeight={'600'}>
              Order Details : #{orderid}
            </Typography>
            <Typography
              variant="title"
              color={'green'}
              fontWeight={600}
              textTransform={'uppercase'}
              sx={{
                backdropFilter: 'blur(10px)',
                background: 'lightgreen',
                py: 1,
                px: 2
              }}
            >
              {orderDetails.orderStatus}
            </Typography>
          </Stack>
          <Typography variant="title">
            Order Date: {orderDetails.orderDate}
          </Typography>
        </Box>

        <StepCounter order_status={orderDetails.orderStatus} />

        <Stack spacing={1} width={'100%'}>
          <Typography variant="body"> Shipping Tracking URL: </Typography>

          <Stack
            width={'100%'}
            justifyContent={'space-between'}
            alignItems={'center'}
            direction={'row'}
            py={1}
            px={2}
            border={1}
            borderColor={'grey.300'}
          >
            <Typography readOnly variant="outlined" fullWidth color={'green'}>
              {window.location.href}
            </Typography>
            <IconButton onClick={handleCopy}>
              <CopyAll />
            </IconButton>
          </Stack>
        </Stack>

        <Box my={4}>
          <Typography variant="h4" fontWeight={700}>
            Order Items
          </Typography>
          <OrderTable rows={orderTablerows}></OrderTable>
        </Box>
      </Stack>

      {copied.copied && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={copied.copied}
          autoHideDuration={1000}
          message={copied.message}
        >
          <Alert severity={'success'} variant="filled" sx={{ width: '100%' }}>
            {copied.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
