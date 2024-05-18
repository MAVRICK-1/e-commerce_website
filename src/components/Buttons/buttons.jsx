import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import './buttons.css';

const Buttons = () => {
  return (
    <div className="button-container">
      <button className="buy-now-button">Buy Now</button>
      <button className="add-to-cart-button">
        <FaShoppingCart className="cart-icon" /> Add to Cart
      </button>
    </div>
  );
};

export default Buttons;
