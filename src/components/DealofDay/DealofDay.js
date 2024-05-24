// In your component
import React from 'react';
import strawberryBottle from '../../assets/images/strawberryBottle.webp';
import './DealofDay.css';

const DealofDay = () => {
  return (
    <div className="Deal-container">
      <div className="Deal-card">
        <div className="image-container">
          <img
            src={strawberryBottle}
            className="img-fluid transition"
            alt="Strawberry Bottle"
          />
        </div>
        <div>
          <h1>Deal of Day</h1>
          <button>X</button>
        </div>
      </div>
    </div>
  );
};

export default DealofDay;
