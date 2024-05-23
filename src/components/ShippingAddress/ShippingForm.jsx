import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import HomeIcon from '@mui/icons-material/Home';
import { Country, State } from 'country-state-city';
import LocationCityIcon from '@mui/icons-material/LocationCityRounded';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import './Shipping.css';
import Loader from '../../assets/images/loading.gif';
export default function Shipping() {
  const { addressId } = useParams(); // Get the addressId from URL parameters
  const navigate = useNavigate();
  const [isUpdate, setIsUpdate] = useState(!!addressId);
  const [currentDocId, setCurrentDocId] = useState(addressId || null);
  const [loading, setLoading] = useState(false);
  const [addressType, setAddressType] = useState('other');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phoneNo, setPhoneNo] = useState('');

  const user_uid = localStorage.getItem('uid');

  // Fetch the Update Address Data
  const fetchAddress = async () => {
    setLoading(true);
    const userId = user_uid ? user_uid : nanoid();
    const userDocRef = doc(db, 'users', userId);
    const addressDocRef = doc(userDocRef, 'shippingaddress', addressId);
    const addressDocSnap = await getDoc(addressDocRef);

    if (addressDocSnap.exists()) {
      const addressData = addressDocSnap.data();
      setAddressType(addressData.addressType || 'other');
      setAddress(addressData.address);
      setCity(addressData.city);
      setState(addressData.state);
      setCountry(addressData.country);
      setPinCode(addressData.pinCode);
      setPhoneNo(addressData.phoneNo);
    } else {
      console.log('No address found with the given ID.');
      navigate('/');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (addressId) {
      fetchAddress();
    }
  }, [addressId, user_uid]);

  // Update And Add New Address
  const submitShipping = async (e) => {
    e.preventDefault();

    if (phoneNo.length !== 10) {
      alert('Phone number must be 10 digits long');
      return;
    }

    try {
      const userId = user_uid ? user_uid : nanoid();
      const userDocRef = doc(db, 'users', userId);

      if (isUpdate && currentDocId) {
        const addressDocRef = doc(userDocRef, 'shippingaddress', currentDocId);
        await updateDoc(addressDocRef, {
          addressType,
          address,
          city,
          state,
          country,
          pinCode,
          phoneNo
        });

        console.log('Shipping address updated successfully');
      } else {
        await addDoc(collection(userDocRef, 'shippingaddress'), {
          addressType,
          address,
          city,
          state,
          country,
          pinCode,
          phoneNo
        });

        console.log('Shipping address added successfully');
      }

      navigate('/my-account');
    } catch (error) {
      console.error('Error adding/updating shipping address: ', error);
    }
  };
  if (loading) {
    return (
      <div className="loader">
        <img src={Loader} />
      </div>
    );
  }
  return (
    <div className="shippingContainer">
      <div className="shippingBox">
        <h2 className="shippingHeading">
          {isUpdate ? 'Update Shipping Details' : 'Add Shipping Details'}
        </h2>
        <form
          className="shippingForm"
          encType="multipart/form-data"
          onSubmit={submitShipping}
        >
          <div>
            <LocationCityIcon />
            <input
              type="text"
              placeholder="Home, Office, other..."
              required
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
            />
          </div>
          <div>
            <HomeIcon />
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <LocationCityIcon />
            <input
              type="text"
              placeholder="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <PinDropIcon />
            <input
              type="number"
              placeholder="Pin Code"
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
          </div>
          <div>
            <PhoneIcon />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              pattern="^[789]\d{9}$"
            />
          </div>
          <div>
            <PublicIcon />
            <select
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Country</option>
              {Country.getAllCountries().map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          {country && (
            <div>
              <TransferWithinAStationIcon />
              <select
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">State</option>
                {State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <input
            type="submit"
            value={isUpdate ? 'Update Details' : 'Add Details'}
            className="shippingBtn"
          />
        </form>
      </div>
    </div>
  );
}
