import React, { useState, useEffect } from "react";
import "./OrderTracking.css"; // Update the correct CSS file path
import MapComponent from "../../components/map/ITEMmap";
const OrderTracking = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Simulate fetching data from Firebase
        const simulatedData = {
          orderId: "123456",
          status: "Delivered",
          deliveryTime: "2024-05-18 12:00 PM",
          requirements: "Handle with care",
          arrivalLocation: "Your Arrival Location"
        };
        setOrderDetails(simulatedData);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };

    fetchOrderDetails();
  }, []);

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`order-tracking ${isOpen ? "open" : ""}`} onClick={toggleDetails}>
      <h2>Order Tracking</h2>
      <div className="order-details">
        <h3>Order ID: {orderDetails.orderId}</h3>
        {isOpen && (
          <>
            <p>Status: {orderDetails.status}</p>
            <p>Estimated Delivery Time: {orderDetails.deliveryTime}</p>
            <p>Order Requirements: {orderDetails.requirements}</p>
          </>
        )}
      </div>
      <div className="map-container">
        <MapComponent location={orderDetails.arrivalLocation} />
      </div>
    </div>
  );
};

export default OrderTracking;
