import {useForm} from "react-hook-form";
import {Button, Card} from "@mui/material";
import {CardBody, CardFooter, CardHeader, CardImg, CardText, CardTitle, Col, Form, Row} from "react-bootstrap";
import "./Account.css"
import imageBackground from "../../assets/images/slider-1.png"
import pfp from "../../assets/images/pfp.jpg"
import {useEffect, useState} from "react";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
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
    getDocs,
} from "firebase/firestore";
import {db, storage} from "../../firebase";
import {nanoid} from "nanoid";
import {useParams} from "react-router-dom";


export function Account(){
    const { register , handleSubmit, formState:{errors, isSubmitting}} = useForm()

    const [name , setName] = useState("")
    const [email , setEmail] = useState("")
    const [address , setAddress] = useState("")
    const [file , setFile] = useState(pfp)

    let user_uid = localStorage.getItem("uid")



    useEffect(()=>{
        (async ()=>{
            const docref = doc(db,"users", `${user_uid? user_uid : nanoid()}`)
            const docSnap = await getDoc(docref)
            if(docSnap.exists()){
                setName(docSnap.data().Name)
                setEmail(docSnap.data().Email)
                setAddress(docSnap.data().Address)
                setFile(docSnap.data().photo)

            }else{
                console.log(null)
            }
        })()

    },[])

    function Onsubmit(e){
        e.preventDefault()
        const collectionRef = collection(db, 'users');

        const querySnapshot = getDocs(collectionRef)

        querySnapshot.then((doc)=>{
            console.log(doc.docs.includes(user_uid))
            if(doc.docs.includes(user_uid)){
                return updateUser()
            }else {
                return addUser(name, email , address, file)
            }
        })
    }

    const addUser = async  (name, email , address, file) => {

        try{
            const imageRef = ref(storage, `AccountImage/${localStorage.getItem("uid")}`);
            await uploadBytes(imageRef, file);
            const imageUrl = await getDownloadURL(imageRef);
            await setDoc(doc(db,"users", `${user_uid}`), {
                Name : name,
                Email : email,
                Address : address,
                photo : imageUrl
            })
            setFile(imageUrl)

        }catch (error){
            console.log(error)
        }
    }


    const updateUser = async () =>{
        try {
            await updateDoc(doc(db,"users", user_uid),{
                Name : name,
                Email : email,
                Address : address,
                photo : file
            })
        }catch (err){
            console.log(err)
        }
    }


    return(
        <>
            <div className="container-fluid d-flex justify-content-center align-items-center p-5">
                <Card variant="outlined" className="cardwidth m-5 md:shrink-0 d-flex flex-column justify-content-center align-items-stretch">
                    <CardHeader className="d-flex flex-column justify-content-center align-items-center">
                        <div className="position-relative header-background  ">
                            <CardImg src={imageBackground} className="md:shrink-0 imgbackground w-100 " />
                            <CardTitle  className="position-absolute  negmargin   p-5">
                                <Row  className="d-flex flex-row justify-content-start align-items-center">
                                    <Col  className="d-flex  flex-column justify-content-center align-items-stretch " >
                                        <CardImg src={file} className="rounded-circle profileImageP md:shrink-1 mb-4"/>
                                        <input required={true}  type="file" name="file" onChange={(e)=>setFile(e.target.files[0])}/>
                                    </Col>
                                    <Col  className=" d-flex flex-column justify-content-start  mx-auto my-4" >
                                        <Row className="d-flex flex-row">
                                            <Col>
                                                <h2>{name}</h2>
                                            </Col>
                                            <Col>
                                                <h4>{email}</h4>
                                            </Col>
                                        </Row>
                                        <Row className=" d-flex  justify-content-center align-items-center mx-auto my-4">
                                            {address}
                                        </Row>
                                    </Col>
                                </Row>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <CardTitle ><h3 className="font-weight-bold ">Personal</h3></CardTitle>
                        <CardText>
                            <Form id="addEditForm" onSubmit={Onsubmit}>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        name="name"
                                        type="text"
                                        placeholder="name"
                                        onChange={(e)=>{setName(e.target.value)}}
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
                                        onChange={(e)=>{setEmail(e.target.value)}}
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
                                        onChange={(e)=>{setAddress(e.target.value)}}
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
                        <Button className="w-100  "   type="submit" form="addEditForm" disabled={isSubmitting}><h5 className="font-weight-bold">Save</h5>
                        </Button>
                        <Button className="w-100  "   type="submit" form="addEditForm" disabled={isSubmitting}><h5 className="font-weight-bold">Edit</h5>
                        </Button>
                    </CardFooter>
                </Card>

            </div>
        </>
    )
}