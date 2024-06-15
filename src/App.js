import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toastify-custom.css';
import { getDatabase, onValue, ref } from 'firebase/database';
import React, { createContext, useEffect, useState } from 'react';
import FAQ from './components/faq/FAQ';
import {
  createBrowserRouter,
  HashRouter,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  Routes
} from 'react-router-dom';
import './App.css';
import Loader from './assets/images/loading.gif';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import About from './pages/About';
import AddProductForm from './pages/AddProd';
import DetailsPage from './pages/Details';
import Home from './pages/Home/index';
import Listing from './pages/Listing';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import ResetPassword from './pages/ResetPassword';
import SignUp from './pages/SignUp';
import Cart from './pages/cart';
import Wishlist from './pages/wishList';
import './responsive.css';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

// import data from './data';
import { collection, doc, getDocs } from 'firebase/firestore';
import MapComponent from './components/map/ITEMmap';
import { db } from './firebase';
import SellerForm from './pages/SellerRegistration';
import SearchResults from './components/search/SearchResults';
import GoToTop from './components/GoToTop/GoToTop';
import Contributors from './pages/Contributors/Contributors';
import { Account } from './components/AccountDetails/Account';
import Contactus from './pages/Contactus/Contactus';
import Blog from './pages/blog/blog';

const MyContext = createContext();

function App() {
  const [productData, setProductData] = useState([]);

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const [isLoading, setIsloading] = useState(true);

  const [loading, setLoading] = useState(true);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [isopenNavigation, setIsopenNavigation] = useState(false);

  const [isLogin, setIsLogin] = useState();
  const [isOpenFilters, setIsopenFilters] = useState(false);
  const [data, setData] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    fetchCartProducts();
    fetchWishlistProducts();
  }, [isLogin]);

  const fetchCartProducts = async () => {
    try {
      const cartRef = doc(db, 'carts', localStorage.getItem('uid'));
      const productsCollectionRef = collection(cartRef, 'products');
      const querySnapshot = await getDocs(productsCollectionRef);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      setCartItems(products);
      setCartCount(products.length); // Set the product count
    } catch (error) {
      console.error('Error fetching cart products:', error);
    }
  };

  const fetchWishlistProducts = async () => {
    console.log('fetchWishlistProducts');
    try {
      const wishlistRef = doc(db, 'wishlists', localStorage.getItem('uid'));
      const productsCollectionRef = collection(wishlistRef, 'products');
      const querySnapshot = await getDocs(productsCollectionRef);
      console.log(querySnapshot);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      console.log(products);
      setWishlistItems(products);
      setWishlistCount(products.length); // Set the product count
    } catch (error) {
      console.error('Error fetching wishlist products:', error);
    }
  };

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

    const is_Login = localStorage.getItem('isLogin');
    setIsLogin(is_Login);

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

  const addToCart = async (item) => {
    try {
      const user = localStorage.getItem('user');
      // Initialize Firebase database with the provided database URL
      const db = getDatabase();
      const cartRef = ref(db, user);
      // Generate a unique key using the user's email and item details
      const uniqueKey = user + item.id; // Modify as per your requirement
      // Add item to the cart in Firebase
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      //console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeItemsFromCart = (id) => {
    const arr = cartItems.filter((obj) => obj.id !== id);
    setCartItems(arr);
  };

  const emptyCart = () => {
    setCartItems([]);
  };

  const signIn = () => {
    const is_Login = localStorage.getItem('isLogin');
    setIsLogin(is_Login);
  };

  const signOut = () => {
    localStorage.removeItem('isLogin');
    setIsLogin(false);
  };

  const openFilters = () => {
    setIsopenFilters(!isOpenFilters);
  };

  const value = {
    cartItems,
    isLogin,
    windowWidth,
    isOpenFilters,
    addToCart,
    removeItemsFromCart,
    emptyCart,
    signOut,
    signIn,
    openFilters,
    isopenNavigation,
    setIsopenNavigation,
    cartCount,
    setCartCount,
    wishlistCount,
    setWishlistCount,
    fetchCartProducts,
    fetchWishlistProducts
  };

  useEffect(() => {
    if (window.botpressWebChat) {
      const webChatContainer = document.querySelector('.webchat-app-container');
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
        <MyContext.Provider value={value}>
          {isLoading === true && (
            <div className="loader">
              <img src={Loader} />
            </div>
          )}
          <Header data={data.productData} />
          <Outlet />
          <Footer />
          <GoToTop />
        </MyContext.Provider>
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
          path: '/my-account',
          element: <Account />
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
          path: '/privacy-policy',
          element: <PrivacyPolicy />
        },
        {
          path: '/faq',
          element: <FAQ />
        },
        {
          path: '/contact',
          element: <Contactus />
        },
        {
          path: '/blog',
          element: <Blog />
        },
        {
          path: '/termsandconditions',
          element: <TermsAndConditions />
        },
        {
          path: '*',
          element: <NotFound />
        }
      ]
    }
  ]);

  return data && data.productData ? (
    <MyContext.Provider value={value}>
      <RouterProvider router={router} />
      <ToastContainer />
    </MyContext.Provider>
  ) : (
    <div className="loader">
      <img src={Loader} />
    </div>
  );
}

export default App;

export { MyContext };
