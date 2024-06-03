import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Rating from '@mui/material/Rating';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography
} from '@mui/material';
import QuantityBox from '../../components/quantityBox';
import { MyContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MapComponent from '../../components/map/ITEMmap';
import { db } from '../../firebase';
import Snackbar from '@mui/material/Snackbar';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { toast } from 'react-toastify';

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [buttonStatus, setButtonStatus] = useState({});
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [uid, setUid] = useState(localStorage.getItem('uid'));

  useEffect(() => {
    try {
      if (context.isLogin === 'true') {
        fetchWishlistProducts();
      } else {
        navigate('/signIn');
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data from the server');
    }
  }, []);

  useEffect(() => {
    fetchWishlistProducts();
  }, [db, uid]);

  const fetchWishlistProducts = async () => {
    try {
      const wishlistsRef = doc(db, 'wishlists', uid);
      const productsCollectionRef = collection(wishlistsRef, 'products');
      const querySnapshot = await getDocs(productsCollectionRef);
      let products = [];
      let price = 0;
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
        price += parseInt(doc.data()?.price) * doc.data()?.quantity;
      });
      context.setWishlistCount(products.length);
      setWishlistItems(products);
      setTotalPrice(price);
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
    }
  };

  const moveToCart = async (item) => {
    try {
      const user = localStorage.getItem('uid');
      const cartRef = doc(db, 'carts', user);
      const productRef = doc(cartRef, 'products', `${item.id}`);

      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const existingQuantity = productSnapshot.data().quantity || 0;
        await updateDoc(productRef, {
          quantity: existingQuantity + item?.quantity
        });
      } else {
        await setDoc(productRef, { ...item, quantity: item?.quantity });
      }

      context.fetchCartProducts();
      setButtonStatus((prevState) => ({
        ...prevState,
        [item.id]: 'Item moved to cart'
      }));

      setTimeout(() => {
        deleteWishlistItem(user, `${item.id}`);
      }, 2000);
      toast.success('Item moved to cart', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const deleteWishlistItem = async (uid, wishlistItemId) => {
    const wishlistItemRef = doc(
      db,
      'wishlists',
      uid,
      'products',
      wishlistItemId
    );

    try {
      await deleteDoc(wishlistItemRef);
      fetchWishlistProducts();
      console.log('Wishlist item deleted successfully.');
      toast.success('Wishlist item deleted successfully', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      toast.error('Error deleting wishlist item', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    }
  };

  const deleteAllWishlistItems = async (uid) => {
    const productsCollectionRef = collection(db, 'wishlists', uid, 'products');

    try {
      const querySnapshot = await getDocs(productsCollectionRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      await fetchWishlistProducts();
      console.log('All wishlist items deleted successfully.');
      toast.success('All wishlist items deleted successfully', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    } catch (error) {
      console.error('Error deleting wishlist items:', error);
      toast.error('Error deleting wishlist items', {
        className: 'Toastify__toast--custom',
        progressClassName: 'Toastify__progress-bar--custom'
      });
    }
  };

  const updateWishlist = (items) => {
    setWishlistItems(items);
  };

  return (
    <>
      {wishlistItems.length > 0 ? (
        <>
          {context.windowWidth > 992 && (
            <div className="breadcrumbWrapper mb-4">
              <div className="container-fluid">
                <ul className="breadcrumb breadcrumb2 mb-0">
                  <li>
                    <Link to={'/'}>Home</Link>
                  </li>
                  <li>Shop</li>
                  <li>Wishlist</li>
                </ul>
              </div>
            </div>
          )}

          <section className="cartSection mb-5">
            <div className="container-fluid">
              <div className="row">
                <div className={`col-md-12`}>
                  <div className="d-flex align-items-center w-100">
                    <div className="left">
                      <h1 className="hd mb-0">Your Wishlist</h1>
                      <p>
                        There are{' '}
                        <span className="text-g">{wishlistItems.length}</span>{' '}
                        products in your Wishlist
                      </p>
                    </div>

                    <span
                      className="ml-auto clearCart d-flex align-items-center cursor "
                      onClick={() => deleteAllWishlistItems(uid)}
                    >
                      <DeleteOutlineOutlinedIcon /> Clear Wishlist
                    </span>
                  </div>
                  <MapComponent data={wishlistItems} />
                  <div className="cartWrapper mt-4">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Remove</th>
                            <th></th>
                          </tr>
                        </thead>

                        <tbody>
                          {wishlistItems.length !== 0 &&
                            wishlistItems.map((item, index) => {
                              return (
                                <tr key={item.id}>
                                  <td width={'50%'}>
                                    <div className="d-flex align-items-center">
                                      <div className="img">
                                        <Link to={`/product/${item.id}`}>
                                          <img
                                            src={
                                              item.catImg +
                                              '?im=Resize=(100,100)'
                                            }
                                            className="w-100"
                                          />
                                        </Link>
                                      </div>

                                      <div className="info pl-4">
                                        <Link to={`/product/${item.id}`}>
                                          <h4>{item.productName}</h4>
                                        </Link>
                                        <Rating
                                          name="half-rating-read"
                                          value={parseFloat(item.rating)}
                                          precision={0.5}
                                          readOnly
                                        />{' '}
                                        <span className="text-light">
                                          ({parseFloat(item.rating)})
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  <td width="15%">
                                    <span>
                                      Rs:{' '}
                                      {parseInt(item.price.split(',').join(''))}
                                    </span>
                                  </td>

                                  <td>
                                    <QuantityBox
                                      item={item}
                                      inputItems={wishlistItems}
                                      index={index}
                                      quantity={item?.quantity}
                                      updateInfo={updateWishlist}
                                      name={'wishlists'}
                                    />
                                  </td>

                                  <td>
                                    <span className="text-g">
                                      Rs.{' '}
                                      {parseInt(
                                        item.price.split(',').join('')
                                      ) * parseInt(item.quantity)}
                                    </span>
                                  </td>

                                  <td align="center">
                                    <span
                                      className="cursor"
                                      onClick={() =>
                                        deleteWishlistItem(uid, `${item?.id}`)
                                      }
                                    >
                                      <DeleteOutlineOutlinedIcon />
                                    </span>
                                  </td>

                                  <td width="15%" align="center">
                                    <Button
                                      //  className="btn-g mt-3 "
                                      className={
                                        buttonStatus[item.id] ===
                                        'Item moved to cart'
                                          ? 'blue'
                                          : 'green'
                                      }
                                      onClick={() => moveToCart(item)}
                                      disabled={
                                        buttonStatus[item.id] ==
                                        'Item moved to cart'
                                      }
                                    >
                                      {buttonStatus[item.id] || 'Move to cart'}
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center mt-4 mb-4">
              <div className="text-center">
                <h2>Your Wishlist is Empty</h2>
                <p>Please add some products to your wishlist</p>
                <Link to="/">
                  <Button className="btn-g">
                    <KeyboardBackspaceIcon /> Start Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WishList;
