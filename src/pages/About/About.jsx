import React, { useState, useEffect } from 'react';
import './about.css';
import product from '../../assets/images/product.png';
import producthover from '../../assets/images/producthover.png';
import ux from '../../assets/images/ux.png';
import uxhover from '../../assets/images/uxhover.png';
import payment from '../../assets/images/payment.png';
import paymenthover from '../../assets/images/paymenthover.png';
import delivery from '../../assets/images/delivery.png';
import deliveryhover from '../../assets/images/deliveryhover.png';

const AboutUs = () => {
  const [productHovered, setProductHovered] = useState(false);
  const [paymentHovered, setPaymentHovered] = useState(false);
  const [deliveryHovered, setDeliveryHovered] = useState(false);
  const [uxHovered, setUxHovered] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <div
      id="about-us"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '3rem'
      }}
    >
      <h1 className="about-us-heading">Features</h1>
      <div className="about-us-block">
        <div
          className="about-us-community"
          onMouseOver={() => setProductHovered(true)}
          onMouseLeave={() => setProductHovered(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={productHovered ? producthover : product}
              alt=""
              style={{ marginLeft: '1rem', marginTop: '1rem', width: '3rem' }}
            />
            <div className="about-us-blk-text">Diverse Product Range</div>
          </div>
          <p className="about-us-blk-para">
            ONDC offers an extensive selection across various categories, from
            electronics and fashion to groceries and home essentials. By
            partnering with multiple sellers, ONDC ensures that users have a
            wide array of options, making it easier to find exactly what they
            need. This diversity also fosters competitive pricing and
            high-quality offerings.
          </p>
        </div>
        <div
          className="about-us-product"
          onMouseOver={() => setUxHovered(true)}
          onMouseLeave={() => setUxHovered(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={uxHovered ? uxhover : ux}
              alt=""
              style={{ marginLeft: '1rem', marginTop: '1rem', width: '3rem' }}
            />
            <div className="about-us-blk-text">Seamless User Experience</div>
          </div>
          <p className="about-us-blk-para">
            ONDC prioritizes a user-friendly interface designed for easy
            navigation. The platform features intuitive search functions,
            personalized recommendations, and streamlined checkout processes.
            Whether users are tech-savvy or new to online shopping, ONDC’s
            design ensures a hassle-free and enjoyable shopping experience.
          </p>
        </div>
      </div>
      <div className="about-us-block">
        <div
          className="about-us-location"
          onMouseOver={() => setPaymentHovered(true)}
          onMouseLeave={() => setPaymentHovered(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={paymentHovered ? paymenthover : payment}
              alt=""
              style={{ marginLeft: '1rem', marginTop: '1rem', width: '3rem' }}
            />
            <div className="about-us-blk-text">Secure Payment Options</div>
          </div>
          <p className="about-us-blk-para">
            Security is paramount on ONDC, with multiple payment methods
            available, including credit/debit cards, digital wallets, and net
            banking. Advanced encryption technologies and secure gateways are
            employed to protect users’ financial information, ensuring safe and
            trustworthy transactions every time.
          </p>
        </div>
        <div
          className="about-us-event"
          onMouseOver={() => setDeliveryHovered(true)}
          onMouseLeave={() => setDeliveryHovered(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={deliveryHovered ? deliveryhover : delivery}
              alt=""
              style={{ marginLeft: '1rem', marginTop: '1rem', width: '3rem' }}
            />
            <div className="about-us-blk-text">Efficient Delivery Services</div>
          </div>
          <p className="about-us-blk-para">
            ONDC partners with reliable logistics providers to offer prompt and
            efficient delivery services. Customers can choose from various
            delivery options, including standard and express shipping, to meet
            their needs. Real-time tracking and timely updates keep customers
            informed about their order status, enhancing overall satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
