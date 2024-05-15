import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './map.css';
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const MapComponent = (props) => {
  let navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [key, setKey] = useState(0); // Key to force re-render of MapContainer

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

  const calculateBounds = (products) => {
    if (products.length > 0) {
      let bounds = L.latLngBounds();
      products.forEach((product) => {
        bounds.extend(product.coordinates);
      });
      setMapBounds(bounds);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await props.data;
        ////console.log(data.length , data)
        // only when there is one item or viewing the product details
        if (typeof props.data === 'object' && !Array.isArray(props.data)) {
          // //console.log("one item")
          setProducts([props.data]); // Wrap the single object in an array
          setLoading(false);
          calculateBounds([props.data]); // Wrap the single object in an array
          return;
        }

        const groceriesProducts = data.filter(
          (item) =>
            item.parentCatName === 'Electronics' ||
            item.parentCatName === 'groceries' ||
            item.parentCatName === 'Fashion'
        );

        if (groceriesProducts.length > 0) {
          const allProducts = groceriesProducts.reduce(
            (acc, curr) => acc.concat(curr),
            []
          );
          const sortedProducts = allProducts.sort((a, b) => {
            const [lat1, lng1] = userLocation;
            const [lat2, lng2] = a.coordinates;
            const distanceA = Math.sqrt(
              Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)
            );
            const [lat3, lng3] = b.coordinates;
            const distanceB = Math.sqrt(
              Math.pow(lat3 - lat1, 2) + Math.pow(lng3 - lng1, 2)
            );
            return distanceA - distanceB;
          });
          const top50Products = sortedProducts.slice(0, 50);
          // //console.log(top50Products)
          setProducts(top50Products);
          setLoading(false);
          calculateBounds(top50Products);
        } else {
          console.error('No groceries products found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    if (userLocation) {
      fetchData();
    }
  }, [userLocation, props.data]);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [props.data]);

  // Re-render MapContainer when key changes (props.data changes)
  const memoizedMapContainer = useMemo(
    () => (
      <MapContainer
        scrollWheelZoom={false}
        key={key}
        zoom={4}
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
        {products.map((product) => {
          const [lat, lng] = product.coordinates;
          const distance = L.latLng(lat, lng).distanceTo(
            L.latLng(userLocation)
          );
          const distanceInKm = (distance / 1000).toFixed(2);
          return (
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
                  <p>Distance from you: {distanceInKm} km</p>
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
          );
        })}
      </MapContainer>
    ),
    [key, userLocation, mapBounds, products]
  );

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="map-container">
      {loading ? (
        <div className="loading-screen">Loading...</div>
      ) : (
        memoizedMapContainer
      )}
    </div>
  );
};

export default MapComponent;
