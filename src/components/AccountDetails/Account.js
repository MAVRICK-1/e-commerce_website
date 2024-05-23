import { useForm } from 'react-hook-form';
import { Button, Card } from '@mui/material';
import {
  CardBody,
  CardFooter,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Form,
  Row
} from 'react-bootstrap';
import './Account.css';
import imageBackground from '../../assets/images/slider-1.webp';
import pfp from '../../assets/images/pfp.webp';
import React, { useEffect, useState } from 'react';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  updateMetadata
} from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { nanoid } from 'nanoid';
import AddressData from '../ShippingAddress/AddressData';
import Loader from '../../assets/images/loading.gif';
export function Account() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const user_uid = localStorage.getItem('uid');
  const userImage = localStorage.getItem('userImage');
  const userName = localStorage.getItem('uname');
  const userEmail = localStorage.getItem('uemail');
  const [loading, setLoadding] = useState(false);
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [address, setAddress] = useState('');
  const [file, setFile] = useState(pfp);
  const navigate = useNavigate();
  const [shippingAddresses, setShippingAddresses] = useState([]);

  async function FetchTheData() {
    setLoadding(true);
    const docref = doc(db, 'users', `${user_uid ? user_uid : nanoid()}`);
    const docSnap = await getDoc(docref);
    if (docSnap.exists()) {
      setName(docSnap.data().Name);
      setEmail(docSnap.data().Email);
      setAddress(docSnap.data().Address);
      setFile(docSnap.data().photo);

      // Fetch the shipping address subcollection
      const shippingAddressCollectionRef = collection(
        docref,
        'shippingaddress'
      );
      const shippingAddressQuerySnapshot = await getDocs(
        shippingAddressCollectionRef
      );

      const shippingAddresses = shippingAddressQuerySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data()
        })
      );

      // Print the array of shipping address documents
      console.log('Shipping Address Documents:', shippingAddresses);
      setShippingAddresses(shippingAddresses);
    } else {
      console.log(null);
    }
    setLoadding(false);
  }

  function handlehistory() {
    navigate('/');
  }

  function Onsubmit(e) {
    e.preventDefault();
    const collectionRef = collection(db, 'users');

    const querySnapshot = getDocs(collectionRef);

    // return updateUser(name, email, address, file)

    querySnapshot.then((doc) => {
      console.log(doc.docs.includes(user_uid));
      if (doc.docs.includes(user_uid)) {
        return updateUser(name, email, address, file);
      } else {
        return addUser(name, email, address, file);
      }
    });
  }

  const addUser = async (name, email, address, file) => {
    try {
      const imageRef = ref(
        storage,
        `AccountImage/${localStorage.getItem('uid')}`
      );
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);
      await setDoc(doc(db, 'users', `${user_uid}`), {
        Name: name,
        Email: email,
        Address: address,
        photo: imageUrl
      });
      setFile(imageUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (name, email, address, file) => {
    try {
      const imageRef = ref(
        storage,
        `AccountImage/${localStorage.getItem('uid')}`
      );
      await uploadBytes(imageRef, file);

      const imageUrl = await getDownloadURL(imageRef);

      console.log(imageUrl);
      console.log(name);
      console.log(email);
      console.log(address);

      await updateDoc(doc(db, 'users', `${user_uid}`), {
        Name: name,
        Email: email,
        Address: address,
        photo: imageUrl
      });
    } catch (err) {
      console.log(err);
    }
  };

  // shipping Address delete
  const deleteShippingAddress = async (id) => {
    try {
      const userId = user_uid ? user_uid : nanoid();
      const userDocRef = doc(db, 'users', userId);
      const shippingAddressDocRef = doc(userDocRef, 'shippingaddress', id);

      // Delete the shipping address document
      await deleteDoc(shippingAddressDocRef);

      // Update the local state to remove the deleted address
      setShippingAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address.id !== id)
      );

      console.log('Shipping address deleted successfully');
    } catch (error) {
      console.error('Error deleting shipping address: ', error);
    }
  };
  useEffect(() => {
    FetchTheData();
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <img src={Loader} />
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center p-5">
        <h3 className="d-flex align-self-start ml-5 justify-content-center">
          <Button
            onClick={handlehistory}
            className="text-lg-center border border-dark font-weight-bold rounded-circle p-2 mr-2 cursor"
          >
            ←
          </Button>
          My Account
        </h3>
        <Card
          variant="outlined"
          className="cardwidth m-5 md:shrink-0 d-flex flex-column justify-content-center align-items-stretch"
        >
          <CardHeader className="d-flex flex-column justify-content-center align-items-center">
            <div className="position-relative header-background  ">
              <CardImg
                src={imageBackground}
                className="md:shrink-0 imgbackground w-100 "
              />
              <CardTitle className="negmargin    p-5">
                <Row className="d-flex  flex-row justify-content-start align-items-center">
                  <Col className="d-flex  flex-column justify-content-center align-items-stretch ">
                    {userImage !== '' ? (
                      <CardImg
                        src={userImage}
                        className="rounded-circle profileImageP md:shrink-1 mb-4"
                      />
                    ) : (
                      <div>
                        <CardImg
                          src={file}
                          className="rounded-circle profileImageP md:shrink-1 mb-4"
                        />
                        <input
                          required={true}
                          type="file"
                          name="file"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </div>
                    )}
                  </Col>
                  <Col className=" d-flex flex-column justify-content-start  mx-auto my-4">
                    <Row className=" d-flex flex-row">
                      <Col>
                        <h2>{name}</h2>
                      </Col>
                      <Col>
                        <h4>{email}</h4>
                      </Col>
                    </Row>
                    <Row className="text-justify d-flex  justify-content-center align-items-center mx-auto my-4">
                      {address}
                    </Row>
                  </Col>
                  <Col className="col-4"></Col>
                </Row>
              </CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <CardTitle>
              <h3 className="font-weight-bold ">Personal</h3>
            </CardTitle>
            <CardText>
              <Form id="addEditForm" onSubmit={Onsubmit}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    required={true}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback>
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Email"
                    required={true}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback>
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    name="address"
                    type="type"
                    placeholder="Address"
                    required={true}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback>
                    {errors.address?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            </CardText>
          </CardBody>
          <CardFooter className="d-flex justify-content-center align-items-center">
            <Button
              className="w-100  "
              type="submit"
              form="addEditForm"
              disabled={isSubmitting}
            >
              <h5 className="font-weight-bold">Save</h5>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center ">
        <h1 class="h1 font-weight-bold mt-0 mb-4">Manage Addresses</h1>

        <div className="container-fluid d-flex justify-content-center align-items-stretch flex-wrap p-2  ">
          {shippingAddresses.length > 0 ? (
            <>
              {shippingAddresses.map((add, i) => {
                return (
                  <AddressData
                    key={i}
                    address={add}
                    deleteShippingAddress={deleteShippingAddress}
                  />
                );
              })}
              <Link to={'/add-shipping-address'} className="align-self-center">
                <button
                  type="button"
                  class="btn btn-success py-4 px-5 mx-5 font-weight-bold btn-lg text-uppercase "
                >
                  Add New Address
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="my-5 d-flex flex-column align-items-center justify-content-center">
                <h3 className="text-capitalize">No Any Address Found </h3>
                <Link to={'/add-shipping-address'}>
                  <button
                    type="button"
                    class="btn btn-success py-4 px-5 my-5 font-weight-bold btn-lg text-uppercase"
                  >
                    Add New Address
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
