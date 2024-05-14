import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './map.css';
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const CartMapComponent = ({ data }) => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting user location:', error);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (data) {
      // Extracting coordinates from data
      const coordinates = data.map((item) => item.coordinates);
      // Creating LatLngBounds object to include all coordinates
      const bounds = L.latLngBounds(coordinates);
      setMapBounds(bounds);
      setLoading(false);
    }
  }, [data]);

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="map-container">
      {loading ? (
        <div className="loading-screen">Loading...</div>
      ) : (
        <MapContainer
          scrollWheelZoom={false}
          style={{ height: '100vh', width: '100%' }}
          center={userLocation}
          bounds={mapBounds}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userLocation && (
            <Marker
              position={userLocation}
              icon={L.icon({
                iconUrl:
                  'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41]
              })}
            >
              <Popup>You are here</Popup>
            </Marker>
          )}
          {data.map((product) => (
            <Marker key={product.id} position={product.coordinates}>
              <Popup>
                <div>
                  <img
                    src={product.catImg}
                    alt="Product"
                    style={{ width: '100px' }}
                  />
                  <h3>{product.productName}</h3>
                  <p>{product.address}</p>
                  <p>Shop: {product.shop_name}</p>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: green[500] }}
                    onClick={() => handleViewProduct(product.id)}
                  >
                    View Product
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default CartMapComponent;
