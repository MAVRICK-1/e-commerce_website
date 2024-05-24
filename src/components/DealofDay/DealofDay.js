// In your component
import React, { useState, useEffect } from 'react';
import arrowIcon from '../../assets/images/icons-arrow.png';
import strawberryBottle from '../../assets/images/strawberryBottle.webp';
import './DealofDay.css';

const DealofDay = () => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const modalDisplayed = sessionStorage.getItem('modalDisplayed');
    if (!modalDisplayed) {
      setModalVisible(true);
      sessionStorage.setItem('modalDisplayed', true);
    }
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    sessionStorage.setItem('modalDisplayed', true);
  };

  return (
    <>
      {modalVisible && (
        <div className="Deal-container">
          <div className="Deal-card">
            <div className="image-container">
              <img
                src={strawberryBottle}
                className="img-fluid transition"
                alt="Strawberry Bottle"
              />
            </div>
            <div className="text-container">
              <div className="deal-heading">
                <h1>Deal of Day</h1>
              </div>
              <div className="offer-details">
                <h1>50% off</h1>
                <p>
                  Bursting with the sweet tanginess of ripe strawberries, this
                  refreshing beverage is the perfect blend of health and
                  indulgence.{' '}
                </p>
                <p>
                  <s>$22.17</s> <span>$11.08</span>
                </p>
              </div>
              <div className="shop-buttons">
                <button className="buy-now">
                  Buy Now<img src={arrowIcon}></img>
                </button>
                <button className="close" onClick={closeModal}>
                  close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DealofDay;
