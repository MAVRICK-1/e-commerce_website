import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import arrowIcon from '../../assets/images/icons-arrow.png';
import CloseButton from 'react-bootstrap/CloseButton';
import './DealofDay.css';

const DealofDay = ({ productData }) => {
  const [product, setProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const modalDisplayed = sessionStorage.getItem('modalDisplayed');
    if (!modalDisplayed) {
      const randomProduct = getRandomProduct();
      setProduct(randomProduct);
      setModalVisible(true);
      sessionStorage.setItem('modalDisplayed', true);
    }
  }, []);

  const closeModal = () => {
    setModalVisible(false);
    sessionStorage.setItem('modalDisplayed', true);
  };

  const getRandomProduct = () => {
    if (!productData || productData.length === 0) return null;
    const categories = productData[0].items;
    if (!categories || categories.length === 0) return null;
    const selectedCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const products = selectedCategory.products;
    if (!products || products.length === 0) return null;
    return products[Math.floor(Math.random() * products.length)];
  };

  const truncateDescription = (description) => {
    const index = description.indexOf('.');
    return index !== -1 ? description.substring(0, index + 1) : description;
  };

  if (!product) return null;

  return (
    <>
      {modalVisible && (
        <div className="deal-container">
          <Container className="deal-card">
            <Row>
              <Col xs={12} md={6} className="image-container">
                <img
                  src={product.catImg || 'https://via.placeholder.com/150'}
                  className="img-fluid transition"
                  alt={product.productName || 'Product Image'}
                />
              </Col>
              <Col xs={12} md={6} className="text-container">
                {/* Close button */}
                <div className="close-btn" onClick={closeModal}>
                  <div className="cross" alt="Close">
                    &times;
                  </div>
                </div>
                <div className="deal-heading">
                  <h1>Deal of the Day</h1>
                </div>
                <div className="offer-details">
                  <h1>
                    {product.discount ? `${product.discount}% off` : '50% off'}
                  </h1>
                  <p>{truncateDescription(product.description)}</p>
                  <p>
                    <s>{`$${product.oldPrice}`}</s>{' '}
                    <span>{`$${product.price}`}</span>
                  </p>
                </div>
                <div className="shop-buttons">
                  <Button className="view-product">
                    <a href="#">
                      View Product
                      <img src={arrowIcon} alt="Arrow Icon" />
                    </a>
                  </Button>
                  <Button className="buy">
                    <a href="#">Buy Now</a>
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default DealofDay;
