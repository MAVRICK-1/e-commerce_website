
import React, { useState, useEffect } from 'react';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';



const QuantityBox = (props) => {
    const [inputValue, setinputValue] = useState(props.quantity);
    const [cartItems, setcartItems] = useState([]);
    const uid = localStorage.getItem("uid");
    useEffect(() => {
        setcartItems(props.cartItems);
        //setinputValue(props.item.quantity)
    }, [props.cartItems])



    const updateCart=(items)=>{
        props.updateCart(items)
    }
    const updateDb = async (uid, cartItemId, newData) => {
        const cartItemRef = doc(db, 'carts', uid, 'products', cartItemId);
      
        try {
          await updateDoc(cartItemRef, newData);
          console.log('Cart item updated successfully.');
        } catch (error) {
          console.error('Error updating cart item:', error);
        }
      };
      

    // const plus = () => {
    //     setinputValue(inputValue + 1)
    // }

    // const minus = () => {
    //     if (inputValue !== 1) {
    //         setinputValue(inputValue - 1)
    //     }
    // }



    return (
        <div className='addCartSection pt-4 pb-4 d-flex align-items-center '>
            <div className='counterSec mr-3'>
                <input type='number' value={inputValue} />
                <span className='arrow plus'
                   
                   onClick={
                    async () => {
                        setinputValue(inputValue + 1);
                        const _cart = props.cartItems?.map((cartItem, key) => {
                            return key === parseInt(props.index) ? { ...cartItem, quantity: inputValue+1 } : {...cartItem}
                        });
                        await updateDb(uid,`${props?.item?.id}`,_cart[props?.index])
                        updateCart(_cart);
                        setcartItems(_cart);
                       
                    }
                }      
                
                ><KeyboardArrowUpIcon /></span>


                <span className='arrow minus'
                 onClick={
                       async () => {
                            if (inputValue !== 1) {
                                setinputValue(inputValue - 1)
                            }
                            
                            const _cart = props.cartItems?.map((cartItem, key) => {
                                return key === parseInt(props.index) ? { ...cartItem, quantity: cartItem.quantity !== 1 ? inputValue-1 : cartItem.quantity } : {...cartItem}
                            });
                            await updateDb(uid,`${props?.item?.id}`,_cart[props?.index])
                            updateCart(_cart);
                            setcartItems(_cart);



                        }
                    }
                ><KeyboardArrowDownIcon /></span>
            </div>

        </div>
    )
}

export default QuantityBox;