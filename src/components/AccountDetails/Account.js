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
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [file, setFile] = useState(pfp);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const docref = doc(db, 'users', `${user_uid ? user_uid : nanoid()}`);
      const docSnap = await getDoc(docref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.Name);
        setEmail(data.Email);
        setAddress(data.Address);
        setPhone(data.Phone);
        setAge(data.Age);
        setDob(data.Dob);
        setGender(data.Gender);
        setFile(data.photo);
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

    querySnapshot.then((doc) => {
      if (doc.docs.map(d => d.id).includes(user_uid)) {
        return updateUser(name, email, address, phone, age, dob, gender, file);
      } else {
        return addUser(name, email, address, phone, age, dob, gender, file);
      }
    });
  }

  const addUser = async (name, email, address, phone, age, dob, gender, file) => {
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
        Phone: phone,
        Age: age,
        Dob: dob,
        Gender: gender,
        photo: imageUrl
      });
      setFile(imageUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (name, email, address, phone, age, dob, gender, file) => {
    try {
      const imageRef = ref(
        storage,
        `AccountImage/${localStorage.getItem('uid')}`
      );
      await uploadBytes(imageRef, file);

      const imageUrl = await getDownloadURL(imageRef);

      await updateDoc(doc(db, 'users', `${user_uid}`), {
        Name: name,
        Email: email,
        Address: address,
        Phone: phone,
        Age: age,
        Dob: dob,
        Gender: gender,
        photo: imageUrl
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
    <div className="Profile-section container-fluid d-flex flex-column justify-content-center align-items-center p-5">
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
              <Form.Group className="myacc-form-group">
                  <Form.Label className="myacc-label">Phone Number</Form.Label>
                  <Form.Control
                    className="myacc-input"
                    name="phone"
                    type="text"
                    placeholder="Phone Number"
                    required={true}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback>
                    {errors.phone?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="myacc-form-group">
                  <Form.Label className="myacc-label">Age</Form.Label>
                  <Form.Control
                    className="myacc-input"
                    name="age"
                    type="number"
                    placeholder="Age"
                    required={true}
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                    }}
                    isInvalid={!!errors.age}
                  />
                  <Form.Control.Feedback>
                    {errors.age?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="myacc-form-group">
                  <Form.Label className="myacc-label">Date of Birth</Form.Label>
                  <Form.Control
                    className="myacc-input"
                    name="dob"
                    type="date"
                    placeholder="Date of Birth"
                    required={true}
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                    }}
                    isInvalid={!!errors.dob}
                  />
                  <Form.Control.Feedback>
                    {errors.dob?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="myacc-form-group">
                  <Form.Label className="myacc-label">Gender</Form.Label>
                  <Form.Control
                    as="select"
                    className="myacc-input"
                    name="gender"
                    required={true}
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                    isInvalid={!!errors.gender}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                  <Form.Control.Feedback>
                    {errors.gender?.message}
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
