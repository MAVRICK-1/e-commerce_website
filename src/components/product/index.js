import React, { useEffect, useState, useContext } from 'react';
import './style.css';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  child,
  remove
} from 'firebase/database';

import { MyContext } from '../../App';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import Product_Skeleton from '../Skeletons/Product_Skeleton';

const Product = (props) => {
  const [productData, setProductData] = useState();
  const [isAdded, setIsadded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drivingDistance, setDrivingDistance] = useState(null);
  const context = useContext(MyContext);

  useEffect(() => {
    setProductData(props.item);
  }, [props.item]);

  const setProductCat = () => {
    sessionStorage.setItem('parentCat', productData.parentCatName);
    sessionStorage.setItem('subCatName', productData.subCatName);
  };
  ////console.log(productData); //printing1000 data

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // //console.log(position.coords.latitude, position.coords.longitude);
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, [context.isLogin]);

  // const getDrivingDistance = async (start, end) => {
  //     const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}`);
  //     const data = await response.json();
  //     if (data.code === 'Ok') {
  //       const distance = data.routes[0].distance; // Distance in meters
  //       //console.log(distance) ;
  //       return distance;
  //     } else {
  //       throw new Error('Unable to calculate driving distance');
  //     }
  //   };

  const getDistance = (start, end) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(end[0] - start[0]);
    const dLon = toRadians(end[1] - start[1]);

    const lat1 = toRadians(start[0]);
    const lat2 = toRadians(end[0]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c; // Distance in kilometers

    return distance; // Convert distance to meters
  };

  const getDisplacement = (start, end) => {
    const distance = getDistance(start, end); // Calculate the straight-line distance
    return distance;
  };

  useEffect(() => {
    if (userLocation && productData?.coordinates) {
      const userCoords = userLocation;
      const productCoords = productData.coordinates;
      // taking the nearest integer value
      const distance = Math.round(getDisplacement(userCoords, productCoords));
      setDrivingDistance(distance);
      setLoading(false);
    }
  }, [userLocation, productData]);

  const addToCart = async (item) => {
    try {
      const user = localStorage.getItem('uid');
      const cartRef = doc(db, 'carts', user);
      const productRef = doc(cartRef, 'products', `${item.id}`);
      await setDoc(productRef, { ...item, quantity: 1 });
      setIsadded(true);
      context.fetchCartProducts();
      toast.success('Item added in cart', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('something went wrong!', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    }
  };

  const addToWishlist = async (item) => {
    console.log('addToWishlist');
    try {
      const user = localStorage.getItem('uid');
      const wishlistRef = doc(db, 'wishlists', user);
      const productRef = doc(wishlistRef, 'products', `${item.id}`);
      await setDoc(productRef, { ...item, quantity: 1 });
      setIsadded(true);
      context.fetchWishlistProducts();
      toast.success('Item added to whishlist', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      toast.error('Error adding item to whishlist', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Product_Skeleton />
      </div>
    );
  }

  return (
    <div className="productThumb" onClick={setProductCat}>
      {props.tag !== null && props.tag !== undefined && (
        <span className={`badge ${props.tag}`}>{props.tag}</span>
      )}

      {productData !== undefined && (
        <>
          <Link to={`/product/${productData.id}`}>
            <div className="imgWrapper">
              <div className="p-4 wrapper mb-3">
                <img
                  src={productData.catImg + '?im=Resize=(420,420)'}
                  className="w-100"
                />
              </div>

              <div className="overlay transition">
                <ul className="list list-inline mb-0">
                  <li
                    className="list-inline-item"
                    onClick={() => addToWishlist(productData)}
                  >
                    <a className="cursor" tooltip="Add to Wishlist">
                      <FavoriteBorderOutlinedIcon />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="cursor" tooltip="Compare">
                      <CompareArrowsOutlinedIcon />
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="cursor" tooltip="Quick View">
                      <RemoveRedEyeOutlinedIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Link>

          <div className="info">
            <span className="d-block catName">{productData.brand}</span>
            <h4 className="title">
              <Link>{productData.productName.substr(0, 50) + '...'}</Link>
            </h4>
            <Rating
              name="half-rating-read"
              value={parseFloat(productData.rating)}
              precision={0.5}
              readOnly
            />
            <span className="brand d-block text-g">
              By <Link className="text-g">{productData.brand}</Link>
            </span>
            <span className="d-block text-g">
              Distance: {drivingDistance} km
            </span>
            <div className="d-flex align-items-center mt-3">
              <div className="d-flex align-items-center w-100">
                <span className="price text-g font-weight-bold">
                  Rs {productData.price}
                </span>{' '}
                <span className="oldPrice ml-auto">
                  Rs {productData.oldPrice}
                </span>
              </div>
            </div>

            <Button
              className="w-100 transition mt-3"
              onClick={() => addToCart(productData)}
            >
              <ShoppingCartOutlinedIcon />
              {isAdded === true ? 'Added' : 'Add'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
