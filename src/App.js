
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getDatabase,
  onValue,
  ref
} from "firebase/database";
import React, { createContext, useEffect, useState } from "react";
import {
  createBrowserRouter,
  HashRouter,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  Routes
} from 'react-router-dom';
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
import Contributors from './pages/Contributors/Contributors';



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

const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          {isLoading === true && (
            <div className="loader">
              <img src={Loader} />
            </div>
          )}
          <Header data={data.productData} />
          <Outlet />
          <Footer />
          <GoToTop />
        </>
      ),
      children: [
        {
          index: true,
          element: <Home data={data.productData} />
        },
        {
          path: '/AboutUs',
          element: <About />
        },
        {
          path: '/cat/:id',
          element: <Listing data={data.productData} single={true} />
        },
        {
          path: '/cat/:id/:id',
          element: <Listing data={data.productData} single={false} />
        },
        {
          path: '/seller',
          element: <SellerForm />
        },
        {
          path: '/product/:id',
          element: <DetailsPage data={data.productData} />
        },
        {
          path: '/cart',
          element: <Cart />
        },
        {
          path: '/wishlist',
          element: <Wishlist />
        },
        {
          path: '/signIn',
          element: isLogin === null ? <SignIn /> : <Navigate to="/" replace />
        },
        {
          path: '/resetpassword',
          element:
            isLogin === null ? <ResetPassword /> : <Navigate to="/" replace />
        },
        {
          path: '/signUp',
          element: isLogin === null ? <SignUp /> : <Navigate to="/" replace />
        },
        {
          path: '/map',
          element: <MapComponent data={data} />
        },
        {
          path: '/addProduct',
          element: <AddProductForm />
        },
        {
          path: '/search',
          element: <SearchResults />
        },
        {
          path: '/contributors',
          element: <Contributors />
        },
        {
          path: '*',
          element: <NotFound />
        }
      ]
    }
  ]);

  return data && data.productData ? (
      <RouterProvider router={router} />
  ) : (
    <div className="loader">
      <img src={Loader} />
    </div>
  );
}
          
export default App;

