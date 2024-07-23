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
import { MyContext } from '../../App';
import { db } from '../../firebase';
import { doc, setDoc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import Product_Skeleton from '../Skeletons/Product_Skeleton';

const Product = (props) => {
  const [productData, setProductData] = useState();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, [context.isLogin]);

  const getDistance = (start, end) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const earthRadiusKm = 6371;
    const dLat = toRadians(end[0] - start[0]);
    const dLon = toRadians(end[1] - start[1]);

    const lat1 = toRadians(start[0]);
    const lat2 = toRadians(end[0]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    return distance;
  };

  const getDisplacement = (start, end) => {
    const distance = getDistance(start, end);
    return distance;
  };

  useEffect(() => {
    if (userLocation && productData?.coordinates) {
      const userCoords = userLocation;
      const productCoords = productData.coordinates;
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
      setIsAdded(true);
      setQuantity(1);
      context.fetchCartProducts();
      toast.success('Item added to cart', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Something went wrong!', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    }
  };

  const addToWishlist = async (item) => {
    try {
      const user = localStorage.getItem('uid');
      const wishlistRef = doc(db, 'wishlists', user);
      const productRef = doc(wishlistRef, 'products', `${item.id}`);
      await setDoc(productRef, { ...item, quantity: 1 });
      setIsAdded(true);
      context.fetchWishlistProducts();
      toast.success('Item added to wishlist', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      toast.error('Error adding item to wishlist', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    }
  };

  const increaseQuantity = async () => {
    try {
      const user = localStorage.getItem('uid');
      const cartRef = doc(db, 'carts', user, 'products', `${productData.id}`);
      await updateDoc(cartRef, { quantity: quantity + 1 });
      setQuantity(quantity + 1);
      context.fetchCartProducts();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error updating quantity', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    }
  };

  const decreaseQuantity = async () => {
    if (quantity === 1) return;
    try {
      const user = localStorage.getItem('uid');
      const cartRef = doc(db, 'carts', user, 'products', `${productData.id}`);
      await updateDoc(cartRef, { quantity: quantity - 1 });
      setQuantity(quantity - 1);
      context.fetchCartProducts();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error updating quantity', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    }
  };

  const removeFromCart = async () => {
    try {
      const user = localStorage.getItem('uid');
      const cartRef = doc(db, 'carts', user, 'products', `${productData.id}`);
      await deleteDoc(cartRef);
      setIsAdded(false);
      context.fetchCartProducts();
      toast.success('Item removed from cart', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Error removing item from cart', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    }
  };

  useEffect(() => {
    const checkIfItemIsInCart = async () => {
      const user = localStorage.getItem('uid');
      const cartRef = doc(db, 'carts', user, 'products', `${productData.id}`);
      const docSnap = await getDoc(cartRef);
      if (docSnap.exists()) {
        setIsAdded(true);
        setQuantity(docSnap.data().quantity);
      }
    };

    if (productData) {
      checkIfItemIsInCart();
    }
  }, [productData]);

  if (loading) {
    return (
      <div>
        <Product_Skeleton />
      </div>
    );
  }

  return (
    <div className="productThumb1" onClick={setProductCat}>
      {props.tag && (
        <span className={`badge-icon ${props.tag}`}>{props.tag}</span>
      )}

      {productData && (
        <>
          <Link to={`/product/${productData.id}`}>
            <div className="imgWrapper1">
              <div className="p-4 wrapping mb-3">
                <img
                  src={productData.catImg + '?im=Resize=(420,420)'}
                  className="w-100"
                />
              </div>

              <div className="overlays transition">
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
            <span className="d-block catNames">{productData.brand}</span>
            <h4 className="titles">
              <Link>{productData.productName.substr(0, 50) + '...'}</Link>
            </h4>
            <Rating
              name="half-rating-read"
              value={parseFloat(productData.rating)}
              precision={0.5}
              readOnly
            />
            <span className="branding d-block text-g">
              By <Link className="text-g">{productData.brand}</Link>
            </span>
            <span className="d-block text-g">
              Distance: {drivingDistance} km
            </span>
            <div className="d-flex align-items-center mt-3">
              <div className="d-flex align-items-center w-100">
                <span className="price text-g font-weight-bold">
                  Rs {productData.price}
                </span>
                <span className="oldPrice ml-auto">
                  Rs {productData.oldPrice}
                </span>
              </div>
            </div>

            {isAdded ? (
              <div className="d-flex align-items-center mt-3">
                <div className='plusminus'>
                <Button className="transition" onClick={decreaseQuantity}>
                  -
                </Button>
                <span className="mx-2">{quantity}</span>
                <Button className="transition" onClick={increaseQuantity}>
                  +
                </Button>
                </div>
                <Button
                  className="ml-auto transition bg-red"
                  onClick={removeFromCart}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                className="w-100 transition mt-3"
                onClick={() => addToCart(productData)}
              >
                <ShoppingCartOutlinedIcon />
                Add
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Product;
