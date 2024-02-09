import React, { useEffect, useState, useContext } from 'react';
import './style.css';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { getDatabase, ref, onValue, set, push, child, remove } from "firebase/database";

import { MyContext } from '../../App';


const Product = (props) => {

    const [productData, setProductData] = useState();
    const [isAdded, setIsadded] = useState(false);
    
    const context  = useContext(MyContext);

    useEffect(() => {
        setProductData(props.item);
    }, [props.item])

    const setProductCat=()=>{
        sessionStorage.setItem('parentCat', productData.parentCatName);
        sessionStorage.setItem('subCatName', productData.subCatName);
    }
    //console.log(productData); //printing1000 data



    const addToCart = async (item) => {
        try {
            const user=localStorage.getItem('user')
            // Initialize Firebase database with the provided database URL
            const db = getDatabase();
            const cartRef = ref(db,user );
            // Generate a unique key using the user's email and item details
            const uniqueKey =  user+item.id; // Modify as per your requirement
            // Add item to the cart in Firebase
            await set(child(cartRef, uniqueKey), { ...item, quantity: 1 });
            setIsadded(true)
            // Assuming setIsAdded updates the state to indicate the item is added
            console.log('Item added to cart successfully');
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };


    return (
        <div className='productThumb' onClick={setProductCat}>
            {
                props.tag !== null && props.tag !== undefined &&
                <span className={`badge ${props.tag}`}>{props.tag}</span>
            }

            {
                productData !== undefined &&
                <>
                    <Link to={`/product/${productData.id}`}>
                        <div className='imgWrapper'>
                            <div className='p-4 wrapper mb-3'>
                                <img src={productData.catImg+'?im=Resize=(420,420)'} className='w-100' />
                            </div>

                            <div className='overlay transition'>
                                <ul className='list list-inline mb-0'>
                                    <li className='list-inline-item'>
                                        <a className='cursor' tooltip="Add to Wishlist">
                                            <FavoriteBorderOutlinedIcon />
                                        </a>
                                    </li>
                                    <li className='list-inline-item'>
                                        <a className='cursor' tooltip="Compare">
                                            <CompareArrowsOutlinedIcon />
                                        </a>
                                    </li>
                                    <li className='list-inline-item'>
                                        <a className='cursor' tooltip="Quick View">
                                            <RemoveRedEyeOutlinedIcon />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </Link>

                    <div className='info'>
                        <span className='d-block catName'>{productData.brand}</span>
                        <h4 className='title'><Link>{productData.productName.substr(0,50)+'...'}</Link></h4>
                        <Rating name="half-rating-read" 
                        value={parseFloat(productData.rating)} precision={0.5} readOnly />
                        <span className='brand d-block text-g'>By <Link className='text-g'>{productData.brand}</Link></span>

                        <div className='d-flex align-items-center mt-3'>
                            <div className='d-flex align-items-center w-100'>
                                <span className='price text-g font-weight-bold'>
                                    Rs {productData.price}</span> <span className='oldPrice ml-auto'>Rs {productData.oldPrice}</span>
                            </div>
                        </div>

                        <Button className='w-100 transition mt-3' onClick={()=>addToCart(productData)}><ShoppingCartOutlinedIcon /> 
                            {
                                isAdded===true ? 'Added' : 'Add'
                            }
                        </Button>

                    </div>

                </>
            }






        </div>
    )
}

export default Product;