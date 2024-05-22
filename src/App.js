import "bootstrap/dist/css/bootstrap.min.css";
import {
  getDatabase,
  onValue,
  ref
} from "firebase/database";
import React, { createContext, useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Loader from "./assets/images/loading.gif";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import About from "./pages/About";
import AddProductForm from "./pages/AddProd";
import DetailsPage from "./pages/Details";
import Home from "./pages/Home/index";
import Listing from "./pages/Listing";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Cart from "./pages/cart";
import Wishlist from "./pages/wishList";
import "./responsive.css";
import {useSelector} from "react-redux"
import ResetPassword from './pages/ResetPassword';
// import data from './data';
import { collection, doc, getDocs } from 'firebase/firestore';
import MapComponent from './components/map/ITEMmap';
import { db } from './firebase';
import SellerForm from './pages/SellerRegistration';
import SearchResults from './components/search/SearchResults';
import GoToTop from './components/GoToTop/GoToTop';

const MyContext = createContext();

function App() {
  const [productData, setProductData] = useState([]);

  const [cartItems, setCartItems] = useState([]);

  const [isLoading, setIsloading] = useState(true);

  const [isLogin, setIsLogin] = useState();
  const [data, setData] = useState([]);

  const uid = useSelector((state)=>state.authReducer.uid)
  const logged = useSelector((state)=>state.authReducer.isAuth)

  function replaceSpecialCharacters(inputString) {
    // Use a regular expression to replace special characters with underscore _
    const replacedString = inputString.replace(/[#$\[\].]/g, "_");

    return replacedString;
  }
  const email = replaceSpecialCharacters(useSelector((state)=>state.authReducer.email))

  // useEffect(() => {
  //   fetchCartProducts();
  //   fetchWishlistProducts();
  // }, [logged]);

  // const fetchCartProducts = async () => {
  //   try {
  //     const cartRef = doc(db, "carts", uid);
  //     const productsCollectionRef = collection(cartRef, "products");
  //     const querySnapshot = await getDocs(productsCollectionRef);
  //     const products = [];
  //     querySnapshot.forEach((doc) => {
  //       products.push({ id: doc.id, ...doc.data() });
  //     });
  //     setCartItems(products);
  //     setCartCount(products.length); // Set the product count
  //   } catch (error) {
  //     console.error("Error fetching cart products:", error);
  //   }
  // };

  // const fetchWishlistProducts = async () => {
  //   console.log("fetchWishlistProducts");
  //   try {
  //     const wishlistRef = doc(db, "wishlists", uid);
  //     const productsCollectionRef = collection(wishlistRef, "products");
  //     const querySnapshot = await getDocs(productsCollectionRef);
  //     console.log(querySnapshot);
  //     const products = [];
  //     querySnapshot.forEach((doc) => {
  //       products.push({ id: doc.id, ...doc.data() });
  //     });
  //     console.log(products);
  //     setWishlistItems(products);
  //     setWishlistCount(products.length); // Set the product count
  //   } catch (error) {
  //     console.error("Error fetching wishlist products:", error);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://mavrick-1.github.io/DataApi/data.json'
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // //console.log("fetced data", data)
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getData();

    setIsLogin(logged);

    setTimeout(() => {
      setProductData(data[1]);
      setIsloading(false);
    }, 3000);
  }, [isLogin]);

  const getData = async (url) => {
    try {
      // Get a reference to the database
      const db = getDatabase();

      // Reference to the node or path you want to fetch data from

      const dataRef = ref(db, email);

      // Fetch data from the specified path
      onValue(
        dataRef,
        (snapshot) => {
          const data = snapshot.val();
          setCartItems(data);
          //console.log("Data fetched successfully:", data);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getCartData = async () => {
    try {
      // Get a reference to the database
      const db = getDatabase();

      // Reference to the node or path you want to fetch data from
      const dataRef = ref(db, localStorage.getItem('user'));

      // Fetch data from the specified path
      onValue(
        dataRef,
        (snapshot) => {
          const data = snapshot.val();
          setCartItems(data);
          //console.log("Data fetched successfully:", data);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (window.botpressWebChat) {
      window.botpressWebChat.init({
        botId: '41bcf48e-b15e-4c9e-8d0e-c9e9055742eb', // Replace with your Botpress bot ID
        host: 'https://cdn.botpress.cloud/webchat/v1' // Replace with your Botpress server URL
      });
    }
  }, []);

  return data && data.productData ? (
    <HashRouter>
        {isLoading === true && (
          <div className="loader">
            <img src={Loader} />
          </div>
        )}

        <Header data={data.productData} />
        <Routes>
          <Route
            exact={true}
            path="/"
            element={<Home data={data.productData} />}
          />
          <Route exact={true} path="/AboutUs" element={<About />} />
          <Route
            exact={true}
            path="/cat/:id"
            element={<Listing data={data.productData} single={true} />}
          />
          <Route
            exact={true}
            path="/cat/:id/:id"
            element={<Listing data={data.productData} single={false} />}
          />
          <Route exact={true} path="/seller" element={<SellerForm />} />
          <Route
            exact={true}
            path="/product/:id"
            element={<DetailsPage data={data.productData} />}
          />
          <Route exact={true} path="/cart" element={<Cart />} />
          <Route exact={true} path="/wishlist" element={<Wishlist />} />

          {/* sign in , signup Protection */}
          {(isLogin === null || isLogin === false) && (
            <Route exact={true} path="signIn" element={<SignIn />} />
          )}
           {(isLogin === null || isLogin === false) && (
            <Route
              exact={true}
              path="resetpassword"
              element={<ResetPassword />}
            />
          )}
           {(isLogin === null || isLogin === false) && (
            <Route exact={true} path="signUp" element={<SignUp />} />
          )}

          <Route
            exact={true}
            path="/map"
            element={<MapComponent data={data} />}
          />
          <Route exact={true} path="/addProduct" element={<AddProductForm />} />
          <Route exact={true} path="*" element={<NotFound />} />
          {/* search route */}
          <Route exact={true} path="/search" element={<SearchResults />} />
        </Routes>
        <Footer />

        <GoToTop />
    </HashRouter>
  ) : (
    <div className="loader">
      <img src={Loader} />
    </div>
  );
}

export default App;

export { MyContext };
