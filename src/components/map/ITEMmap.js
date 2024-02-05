import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './map.css'
const MapComponent = () => {
    const [products, setProducts] = useState([]);
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
        if (userLocation) {
            const fetchData = async () => {
                try {
                    const response = await fetch('https://mavrick-1.github.io/DataApi/data.json');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                
                    const groceriesProducts = data.productData.find(item => item.cat_name === 'groceries');
                    if (groceriesProducts) {
                        const allProducts = groceriesProducts.items.reduce((acc, curr) => acc.concat(curr.products), []);
                        const sortedProducts = allProducts.sort((a, b) => {
                            const [lat1, lng1] = userLocation;
                            const [lat2, lng2] = a.coordinates;
                            const distanceA = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
                            const [lat3, lng3] = b.coordinates;
                            const distanceB = Math.sqrt(Math.pow(lat3 - lat1, 2) + Math.pow(lng3 - lng1, 2));
                            return distanceA - distanceB;
                        });
                        const top50Products = sortedProducts.slice(0, 50);
                        setProducts(top50Products);
                        setLoading(false);
                        calculateBounds(top50Products);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                }
            };
    
            fetchData();
        }
    }, [userLocation]);

    const calculateBounds = (products) => {
        if (products.length > 0) {
            let bounds = L.latLngBounds();
            products.forEach(product => {
                bounds.extend(product.coordinates);
            });
            setMapBounds(bounds);
        }
    };

    return (
        <div className="map-container">
            {loading ? (
                <div className="loading-screen">Loading...</div>
            ) : (
                <MapContainer style={{ height: '100vh', width: '100%' }} center={userLocation} bounds={mapBounds}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {userLocation && (
                        <Marker position={userLocation} icon={L.icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                            <Popup>You are here</Popup>
                        </Marker>
                    )}
                    {products.map(product => (
                        <Marker key={product.id} position={product.coordinates}>
                            <Popup>
                                <div>
                                    <img src={product.catImg} alt="Product" style={{ width: '100px' }} />
                                    <h3>{product.productName}</h3>
                                    <p>{product.address}</p>
                                    <p>Shop: {product.shop_name}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
        </div>
    );
};

export default MapComponent;
