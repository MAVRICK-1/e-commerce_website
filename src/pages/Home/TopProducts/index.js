import React, { useState, useEffect, useMemo } from 'react';
import './style.css';
import img1 from '../../../assets/images/thumbnail-1.webp';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import TopProductsSkeleton from '../../../components/Skeletons/TopProductsSkeleton';

const products = [
  {
    id: 1,
    title: 'Nestle Original Coffee-Mate Coffee Creamer',
    price: '$28.85',
    oldPrice: '$32.8',
    rating: 3.5,
    img: img1,
  },
  {
    id: 2,
    title: 'Nestle Original Coffee-Mate Coffee Creamer',
    price: '$28.85',
    oldPrice: '$32.8',
    rating: 3.5,
    img: img1,
  },
  {
    id: 3,
    title: 'Nestle Original Coffee-Mate Coffee Creamer',
    price: '$28.85',
    oldPrice: '$32.8',
    rating: 3.5,
    img: img1,
  },
];

const TopProducts = ({ title }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading time (2 seconds)
    return () => clearTimeout(timer);
  }, []);

  const productItems = useMemo(() => {
    return products.map((product) => (
      <div className="items d-flex align-items-center" key={product.id}>
        <div className="img">
          <Link to="">
            <img src={product.img} className="w-100" alt={product.title} loading="lazy" />
          </Link>
        </div>
        <div className="info px-3">
          <Link to="">
            <h4>{product.title}</h4>
          </Link>
          <Rating name="half-rating-read" defaultValue={product.rating} precision={0.5} readOnly />
          <div className="d-flex align-items-center">
            <span className="price text-g font-weight-bold">{product.price}</span>
            <span className="oldPrice">{product.oldPrice}</span>
          </div>
        </div>
      </div>
    ));
  }, []);

  if (loading) {
    return <TopProductsSkeleton />;
  }

  return (
    <div className="topSelling_box">
      <h3>{title}</h3>
      {productItems}
    </div>
  );
};

export default TopProducts;
