import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import QuantityBox from '../../components/quantityBox';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { MyContext } from '../../App';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';


const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        if(context.isLogin==="true"){
            getCartData("http://localhost:5000/cartItems");
        }else{
            history('/');
        }

        window.scrollTo(0,0);
        
    }, [])

    const getCartData = async (url) => {
        try {
            await axios.get(url).then((response) => {
                setCartItems(response.data);
            })

        } catch (error) {
            console.log(error.message);
        }
    }


    const deleteItem = async (id) => {
        const response = await axios.delete(`http://localhost:5000/cartItems/${id}`);
        if (response !== null) {
            getCartData("http://localhost:5000/cartItems");
            context.removeItemsFromCart(id);
        }
    }



    const emptyCart = () => {
        let response = null;
        cartItems.length !== 0 &&
            cartItems.map((item) => {
                response = axios.delete(`http://localhost:5000/cartItems/${parseInt(item.id)}`);
            })
        if (response !== null) {
            getCartData("http://localhost:5000/cartItems");
        }

        context.emptyCart();
    }


    const updateCart = (items) => {
        setCartItems(items)
    }




    return (
        <>
           {
            context.windowWidth>992 &&  <div className="breadcrumbWrapper mb-4">
            <div className="container-fluid">
                <ul className="breadcrumb breadcrumb2 mb-0">
                    <li>
                        <Link to={'/'}>Home</Link>
                    </li>
                    <li>
                        Shop
                    </li>
                    <li>
                        Cart
                    </li>
                </ul>
            </div>
        </div>

           }

            <section className='cartSection mb-5'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-8'>
                            <div className='d-flex align-items-center w-100'>
                                <div className='left'>
                                    <h1 className='hd mb-0'>Your Cart</h1>
                                    <p>There are <span className='text-g'>3</span> products in your cart</p>
                                </div>

                                <span className='ml-auto clearCart d-flex align-items-center cursor '
                                    onClick={() => emptyCart()}><DeleteOutlineOutlinedIcon /> Clear Cart</span>

                            </div>



                            <div className='cartWrapper mt-4'>
                                <div className='table-responsive'>
                                    <table className='table'>
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
                                            {
                                                cartItems.length !== 0 &&
                                                cartItems.map((item, index) => {
                                                    return (
                                                        <tr>
                                                            <td width={"50%"}>
                                                                <div className='d-flex align-items-center'>

                                                                    <div className='img'>
                                                                        <Link to={`/product/${item.id}`}>
                                                                            <img src={item.catImg + '?im=Resize=(100,100)'} className='w-100' />
                                                                        </Link>
                                                                    </div>


                                                                    <div className='info pl-4'>
                                                                        <Link to={`/product/${item.id}`}><h4>{item.productName}</h4></Link>
                                                                        <Rating name="half-rating-read"
                                                                            value={parseFloat(item.rating)} precision={0.5} readOnly /> <span className='text-light'>({parseFloat(item.rating)})</span>
                                                                    </div>

                                                                </div>
                                                            </td>

                                                            <td width="20%"><span>Rs:  {parseInt(item.price.split(",").join(""))}</span></td>

                                                            <td>
                                                            <QuantityBox item={item} cartItems={cartItems} index={index} updateCart={updateCart} />
                                                            </td>

                                                            <td>
                                                            <span className='text-g'>Rs. {parseInt(item.price.split(",").join("")) * parseInt(item.quantity)}</span>
                                                            </td>

                                                            <td align='center'>
                                                                <span className='cursor'
                                                                    onClick={() => deleteItem(item.id)}
                                                                ><DeleteOutlineOutlinedIcon /></span>
                                                            </td>

                                                        </tr>
                                                    )
                                                })
                                            }


                                        </tbody>

                                    </table>
                                </div>
                            </div>

                            <br />


                            <div className='d-flex align-items-center'>
                                <Link to="/">
                                    <Button className='btn-g'>
                                        <KeyboardBackspaceIcon /> Continue Shopping</Button>

                                </Link>
                                {/* <Button className='btn-g ml-auto' onClick={updateCartData}>
                    <RefreshIcon /> Update Cart</Button> */}


                            </div>


                        </div>

                        <div className='col-md-4 cartRightBox'>
                            <div className='card p-4 '>
                                <div className='d-flex align-items-center mb-4'>
                                    <h5 className='mb-0 text-light'>Subtotal</h5>
                                    <h3 className='ml-auto mb-0 font-weight-bold'><span className='text-g'>
                                    {
                                            cartItems.length !== 0 &&
                                            cartItems.map(item => parseInt(item.price.split(",").join("")) * item.quantity).reduce((total, value) => total + value, 0)
                                        }
                                    </span></h3>
                                </div>

                                <div className='d-flex align-items-center mb-4'>
                                    <h5 className='mb-0 text-light'>Shipping</h5>
                                    <h3 className='ml-auto mb-0 font-weight-bold'><span >Free</span></h3>
                                </div>


                                <div className='d-flex align-items-center mb-4'>
                                    <h5 className='mb-0 text-light'>Estimate for</h5>
                                    <h3 className='ml-auto mb-0 font-weight-bold'>United Kingdom</h3>
                                </div>


                                <div className='d-flex align-items-center mb-4'>
                                    <h5 className='mb-0 text-light'>Total</h5>
                                    <h3 className='ml-auto mb-0 font-weight-bold'><span className='text-g'>
                                    {
                                            cartItems.length !== 0 &&
                                            cartItems.map(item => parseInt(item.price.split(",").join("")) * item.quantity).reduce((total, value) => total + value, 0)
                                        }
                                    </span></h3>
                                </div>


                                <br />
                                <Button className='btn-g btn-lg'>Proceed To CheckOut</Button>


                            </div>
                        </div>

                    </div>
                </div>
            </section>


        </>
    )
}

export default Cart;