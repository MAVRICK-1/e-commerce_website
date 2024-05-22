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
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MapComponent from '../../components/map/ITEMmap';
import { db } from '../../firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
const Compare = ({ data }) => {
  const [compareItems, setCompareItems] = useState([]);
  const [error, setError] = useState(null);
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [uid, setUid] = useState(localStorage.getItem('uid'));
  useEffect(() => {
    try {
      if (context.isLogin === 'true') {
        fetchCompareProducts();
      } else {
        navigate('/signIn'); // Navigate to About Us page if not logged in
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch data from the server'); // Set error state if there's an error with database connection
    }
  }, []);

  useEffect(() => {
    fetchCompareProducts();
  }, [db, uid]);

  const fetchCompareProducts = async () => {
    try {
      const compareRef = doc(db, 'compare', uid);
      const productsCollectionRef = collection(compareRef, 'products');
      const querySnapshot = await getDocs(productsCollectionRef);
      let products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      context.setCompareCount(products.length);
      setCompareItems(products);
    } catch (error) {
      console.error('Error fetching compare products:', error);
    }
  };
  const deleteCompareItem = async (uid, compareItemId) => {
    const compareItemRef = doc(db, 'compare', uid, 'products', compareItemId);

    try {
      await deleteDoc(compareItemRef);
      fetchCompareProducts();
      console.log('Compare item deleted successfully.');
    } catch (error) {
      console.error('Error deleting Compare item:', error);
    }
  };

  const deleteAllCompareItems = async (uid) => {
    const productsCollectionRef = collection(db, 'compare', uid, 'products');

    try {
      const querySnapshot = await getDocs(productsCollectionRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      await fetchCompareProducts();
      console.log('All compare items deleted successfully.');
    } catch (error) {
      console.error('Error deleting compare items:', error);
    }
  };

  return (
    <>
      {compareItems.length > 0 ? (
        // Render cart section if cartItems array is not empty
        <>
          {context.windowWidth > 992 && (
            <div className="breadcrumbWrapper mb-4">
              <div className="container-fluid">
                <ul className="breadcrumb breadcrumb2 mb-0">
                  <li>
                    <Link to={'/'}>Home</Link>
                  </li>
                  <li>Shop</li>
                  <li>Compare</li>
                </ul>
              </div>
            </div>
          )}
          <section className="cartSection mb-5">
            <div className="container-fluid">
              <div className={context.windowWidth > 770 && 'row'}>
                <div
                  className={`${
                    context.windowWidth < 770 ? 'col-md-full' : 'col-md-7'
                  }`}
                >
                  <div className="d-flex align-items-center w-100">
                    <div className="left">
                      <h1 className="hd mb-0">Your Compare Items</h1>
                      <p>
                        There are{' '}
                        <span className="text-g">{compareItems.length}</span>{' '}
                        products in your Compare List
                      </p>
                    </div>

                    <span
                      className="ml-auto clearCart d-flex align-items-center cursor "
                      onClick={() => deleteAllCompareItems(uid)}
                    >
                      <DeleteOutlineOutlinedIcon /> Clear Compare
                    </span>
                  </div>
                  <MapComponent data={compareItems} />
                  <div className="cartWrapper mt-4">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Brand</th>
                            <th>Shop</th>
                            <th>Remove</th>
                          </tr>
                        </thead>

                        <tbody>
                          {compareItems.length !== 0 &&
                            compareItems.map((item, index) => {
                              return (
                                <>
                                  <tr>
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

                                    <td width="20%">
                                      <span>
                                        Rs:{' '}
                                        {parseInt(
                                          item.price.split(',').join('')
                                        )}
                                      </span>
                                    </td>

                                    <td width="20%">
                                      <span>{item.brand}</span>
                                    </td>

                                    <td>
                                      <span width="20%">{item.shop_name}</span>
                                    </td>

                                    <td align="center">
                                      <span
                                        className="cursor"
                                        onClick={() =>
                                          deleteCompareItem(uid, `${item?.id}`)
                                        }
                                      >
                                        <DeleteOutlineOutlinedIcon />
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <div style={{ display: 'flex' }}></div>
                                  </tr>
                                </>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <br />

                  <div className="d-flex align-items-center">
                    <Link to="/">
                      <Button className="btn-g">
                        <KeyboardBackspaceIcon /> Continue Shopping
                      </Button>
                    </Link>
                    {/* <Button className='btn-g ml-auto' onClick={updateCartData}>
                    <RefreshIcon /> Update Cart</Button> */}
                  </div>
                </div>
              </div>
            </div>
          </section>{' '}
        </>
      ) : (
        // Render message indicating cart is empty if cartItems array is empty
        <div className="container-fluid">
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center mt-4 mb-4">
              <div className="text-center">
                <h2>Nothing to Compare</h2>
                <p>Please add some products to Compare</p>
                <Link to="/">
                  <Button className="btn-g">
                    <KeyboardBackspaceIcon /> Start Comparing
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

export default Compare;
