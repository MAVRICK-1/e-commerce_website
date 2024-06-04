import React from 'react';
import './about.css';
import About from './About';

function Tes() {
  return (
    <div style={{ margin: '10px auto 10px auto' }}>
      <div className="about-container background">
        <h1 className="contributor-text">About Us</h1>
        <hr></hr>
        <p className="desc">
          Welcome to Nest Mart & Grocery, your ultimate destination for all your
          shopping needs. Established in 2024, we offer a wide range of
          products, including groceries, fresh vegetables, electronics, and the
          latest fashion trends. Our commitment to delivering fresh products
          quickly has made us a favorite among customers who value both quality
          and convenience.
        </p>
        <p className="desc">
          At Nest Mart & Grocery, we believe in providing exceptional value,
          which is why we offer unbeatable deals every day. Our goal is to
          ensure that you receive the best products at the most competitive
          prices, all while enjoying a seamless and satisfying shopping
          experience. Whether you're stocking up on household essentials,
          upgrading your gadgets, or refreshing your wardrobe, you'll find
          everything you need in one website.
        </p>
      </div>
      <About />
    </div>
  );
}

export default Tes;
