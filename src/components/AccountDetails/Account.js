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
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  query,
  where,
  documentId,
  getDocs
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { nanoid } from 'nanoid';

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

  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [address, setAddress] = useState('');
  const [file, setFile] = useState(pfp);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const docref = doc(db, 'users', `${user_uid ? user_uid : nanoid()}`);
      const docSnap = await getDoc(docref);
      if (docSnap.exists()) {
        setName(docSnap.data().Name);
        setEmail(docSnap.data().Email);
        setAddress(docSnap.data().Address);
        setFile(docSnap.data().photo);
      } else {
        console.log(null);
      }
    })();
  }, []);

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

  return (
    <>
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center p-5">
        <h3
          className="d-flex align-self-start ml-5 justify-content-center back-but"
          onClick={handlehistory}
        >
          <IoIosArrowRoundBack size="40px" />
          BACK
        </h3>
        <Card
          variant="outlined"
          className="cardwidth m-5 md:shrink-0 d-flex flex-column justify-content-center align-items-center"
        >
          <CardHeader className=" d-flex  flex-column justify-content-center align-items-center card-header">
            <div className=" header-background back-div  hidden">
              <CardImg
                src={imageBackground}
                className="md:shrink-0 imgbackground w-100 hidden"
              />
              <CardTitle className="negmargin    p-5">
                <Row className="d-flex  flex-row justify-content-start align-items-center">
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
                </Row>
              </CardTitle>
            </div>
          </CardHeader>
          <CardBody className="card-body">
            <CardTitle>
              <h3 className="font-weight-bold my-profile text-center">
                MY PROFILE
              </h3>
            </CardTitle>
            <CardText>
              <Form id="addEditForm" onSubmit={Onsubmit}>
                <Form.Group className="myacc-form-group">
                  <Form.Label className="myacc-label">Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Name"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    value={name}
                    required={true}
                    isInvalid={!!errors.name}
                    className="myacc-input"
                  />
                  <Form.Control.Feedback>
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="myacc-form-group">
                  <Form.Label className="myacc-label">Email</Form.Label>
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
                    className="myacc-input"
                  />
                  <Form.Control.Feedback>
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="myacc-form-group">
                  <Form.Label className="myacc-label">Address</Form.Label>
                  <Form.Control
                    className="myacc-input"
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
          <CardFooter className="d-flex justify-content-center align-items-center myacc-save-div">
            <Button
              className="myacc-save"
              type="submit"
              form="addEditForm"
              disabled={isSubmitting}
              style={{ padding: '0px' }}
            >
              <h5 className="font-weight-bold">Save</h5>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
