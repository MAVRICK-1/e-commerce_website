import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Rating from "@mui/material/Rating";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import QuantityBox from "../../components/quantityBox";
import { MyContext } from "../../App";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MapComponent from "../../components/map/ITEMmap";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (context.isLogin === "true") {
        getCartData();
      } else {
        navigate("/aboutus"); // Navigate to About Us page if not logged in
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch data from the server"); // Set error state if there's an error with database connection
    }
  }, []);

  const getCartData = async () => {
    try {
      const db = getDatabase();
      const dataRef = ref(db, `${localStorage.getItem("user")}`);
      onValue(
        dataRef,
        (snapshot) => {
          const data = snapshot.val();
          console.log("Data fetched successfully:", data);
          if (data) {
            setCartItems(Object.values(data));
            console.log(Object.values(data).length);
            // Calculate total price
            const totalPrice = Object.values(data).reduce((acc, item) => {
              const itemPrice = parseInt(item.price.split(",").join(""));
              return acc + itemPrice * item.quantity;
            }, 0);
            setTotalPrice(totalPrice);
          } else {
            setCartItems([]);
            // If data is null, set cartItems to an empty array
          }
          setError(null); // Reset error state if data fetch is successful
        },
        (error) => {
          console.error("Error fetching data:", error);
          setError(error.message); // Set error state if there's an error fetching data
        }
      );
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch data from the server"); // Set error state if there's an error with database connection
    }
  };

  const deleteItem = async (id) => {
    try {
      const db = getDatabase();
      const itemRef = ref(
        db,
        `${localStorage.getItem("user")}/${localStorage.getItem("user")}${id}`
      );
      remove(itemRef)
        .then(() => {
          console.log("Item deleted successfully");
          context.removeItemsFromCart(id);
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const emptyCart = () => {
    try {
      const db = getDatabase();
      const itemRef = ref(db, `${localStorage.getItem("user")}`);
      remove(itemRef)
        .then(() => {
          context.emptyCart();
          console.log("Item deleted successfully");
          setCartItems([]);
          // Reset cartItems to an empty array after emptying the cart
          setTotalPrice(0); // Reset total price
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateCart = (items) => {
    setCartItems(items);
  };

  return (
    <>
      {cartItems.length > 0 ? (
        // Render cart section if cartItems array is not empty
        <>
          {context.windowWidth > 992 && (
            <div className="breadcrumbWrapper mb-4">
              <div className="container-fluid">
                <ul className="breadcrumb breadcrumb2 mb-0">
                  <li>
                    <Link to={"/"}>Home</Link>
                  </li>
                  <li>Shop</li>
                  <li>Cart</li>
                </ul>
              </div>
            </div>
          )}
          <section className="cartSection mb-5">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-8">
                  <div className="d-flex align-items-center w-100">
                    <div className="left">
                      <h1 className="hd mb-0">Your Cart</h1>
                      <p>
                        There are{" "}
                        <span className="text-g">{cartItems.length}</span>{" "}
                        products in your cart
                      </p>
                    </div>

                    <span
                      className="ml-auto clearCart d-flex align-items-center cursor "
                      onClick={() => emptyCart()}
                    >
                      <DeleteOutlineOutlinedIcon /> Clear Cart
                    </span>
                  </div>
                  <MapComponent data={cartItems} />
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
                          </tr>
                        </thead>

                        <tbody>
                          {cartItems.length !== 0 &&
                            cartItems.map((item, index) => {
                              return (
                                <tr>
                                  <td width={"50%"}>
                                    <div className="d-flex align-items-center">
                                      <div className="img">
                                        <Link to={`/product/${item.id}`}>
                                          <img
                                            src={
                                              item.catImg +
                                              "?im=Resize=(100,100)"
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
                                        />{" "}
                                        <span className="text-light">
                                          ({parseFloat(item.rating)})
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  <td width="20%">
                                    <span>
                                      Rs:{" "}
                                      {parseInt(item.price.split(",").join(""))}
                                    </span>
                                  </td>

                                  <td>
                                    <QuantityBox
                                      item={item}
                                      cartItems={cartItems}
                                      index={index}
                                      updateCart={updateCart}
                                    />
                                  </td>

                                  <td>
                                    <span className="text-g">
                                      Rs.{" "}
                                      {parseInt(
                                        item.price.split(",").join("")
                                      ) * parseInt(item.quantity)}
                                    </span>
                                  </td>

                                  <td align="center">
                                    <span
                                      className="cursor"
                                      onClick={() => deleteItem(item.id)}
                                    >
                                      <DeleteOutlineOutlinedIcon />
                                    </span>
                                  </td>
                                </tr>
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

                <div className="col-md-4 cartRightBox">
                  <div className="card p-4 ">
                    <div className="d-flex align-items-center mb-4">
                      <h5 className="mb-0 text-light">Subtotal</h5>
                      <h3 className="ml-auto mb-0 font-weight-bold">
                        <span className="text-g">
                          {cartItems.length !== 0 &&
                            cartItems
                              .map(
                                (item) =>
                                  parseInt(item.price.split(",").join("")) *
                                  item.quantity
                              )
                              .reduce((total, value) => total + value, 0)}
                        </span>
                      </h3>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <h5 className="mb-0 text-light">Shipping</h5>
                      <h3 className="ml-auto mb-0 font-weight-bold">
                        <span>Free</span>
                      </h3>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <h5 className="mb-0 text-light">Estimate for</h5>
                      <h3 className="ml-auto mb-0 font-weight-bold">
                        United Kingdom
                      </h3>
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <h5 className="mb-0 text-light">Total</h5>
                      <h3 className="ml-auto mb-0 font-weight-bold">
                        <span className="text-g">
                          {cartItems.length !== 0 &&
                            cartItems
                              .map(
                                (item) =>
                                  parseInt(item.price.split(",").join("")) *
                                  item.quantity
                              )
                              .reduce((total, value) => total + value, 0)}
                        </span>
                      </h3>
                    </div>

                    <br />
                    <Button className="btn-g btn-lg">
                      Proceed To CheckOut
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>{" "}
        </>
      ) : (
        // Render message indicating cart is empty if cartItems array is empty
        <div className="container-fluid">
          <div className="row">
            <div className="col d-flex align-items-center justify-content-center mt-4 mb-4">
              <div className="text-center">
                <h2>Your Cart is Empty</h2>
                <p>Please add some products to your cart</p>
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

export default Cart;
