import React, { useEffect, useState, createContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./responsive.css";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import { getDatabase, ref, push } from 'firebase/database';
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Home from "./pages/Home/index";
import About from "./pages/About/index";
import Listing from "./pages/Listing";
import NotFound from "./pages/NotFound";
import DetailsPage from "./pages/Details";
import axios from "axios";
import Cart from "./pages/cart";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Loader from "./assets/images/loading.gif";
import AddProductForm from './pages/AddProd';

// import data from './data';
import MapComponent from "./components/map/ITEMmap";
import SellerForm from "./pages/SellerRegistration";

const MyContext = createContext();

function App() {
  const [productData, setProductData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  const [loading, setLoading] = useState(true);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [isopenNavigation, setIsopenNavigation] = useState(false);

  const [isLogin, setIsLogin] = useState();
  const [isOpenFilters, setIsopenFilters] = useState(false);
  const [data, setData] = useState([]);



useEffect(() => {
  
        const fetchData = async () => {
          try {
                const response = await fetch('https://mavrick-1.github.io/DataApi/data.json');
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // console.log("fetced data", data)
                setData(data);
            
              } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
}, []);


  useEffect(() => {
    // getData('http://localhost:5000/productData');
    getCartData("https://mavrick-1a92d-default-rtdb.firebaseio.com/");

    const is_Login = localStorage.getItem("isLogin");
    setIsLogin(is_Login);

    setTimeout(() => {
      setProductData(data[1]);
      setIsloading(false);
    }, 3000);
  }, []);

  const getData = async (url) => {
    try {
      await axios.get(url).then((response) => {
        setProductData(response.data);
        setTimeout(() => {
          // setIsLoading(false);
        }, 2000);
      });

      await axios
        .get(
          "https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=27dad2d0abd34a22965727ce8d939077"
        )
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCartData = async (url) => {
    try {
      const db = getDatabase();
      const cartRef = ref(db, url); // Assuming 'url' is the path to your cart data in Firebase
      const snapshot = await get(cartRef);
      console.log('data fetched')
  
      if (snapshot.exists()) {
        setCartItems(snapshot.val());
      } else {
        console.log('No cart data available');
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };
  

  const addToCart = async (item) => {
    item.quantity = 1;
    console.log("item");
    console.log(item)

  
    try {
      await axios.post("https://mavrick-1a92d-default-rtdb.firebaseio.com/", item).then((res) => {
          if (res !== undefined) {
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
          console.log(cartItems)
        }
        });
    } catch (error) {
      console.log(cartItems)
      console.log(error);
    }
  };
//   const addToCart = async (item) => {
//     try {
//         // Assuming Firebase is already initialized elsewhere in your application
//         const db = getDatabase(); // Assuming Firebase is initialized elsewhere
//         const cartRef = ref(db, 'cartItems');
    
//         // Add item to the cart in Firebase
//         push(cartRef, { ...item, quantity: 1 })
//             .then(() => {
//                 // Update the local state with the new cart item
//                 setCartItems([...cartItems, { ...item, quantity: 1 }]);
//             })
//             .catch((error) => {
//                 console.error('Error adding item to cart:', error);
//             });
//     } catch (error) {
//         console.error('Error adding item to cart:', error);
//     }
// };

const removeItemsFromCart = (id) => {
    const arr = cartItems.filter((obj) => obj.id !== id);
    setCartItems(arr);
};

const emptyCart = () => {
    setCartItems([]);
};

const signIn = () => {
    const is_Login = localStorage.getItem("isLogin");
    setIsLogin(is_Login);
};

  const signOut = () => {
    localStorage.removeItem("isLogin");
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
  };

  return (
    data && data.productData ?  (
      <HashRouter>
        <MyContext.Provider value={value}>
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
            <Route
              exact={true}
              path="/AboutUs"
              element={<About/>}
            />
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
            <Route
              exact={true}
              path="/seller"
              element={<SellerForm/>}
            />

            <Route
              exact={true}
              path="/product/:id"
              element={<DetailsPage data={data.productData} />}
            />
            <Route exact={true} path="/cart" element={<Cart />} />
            <Route exact={true} path="/signIn" element={<SignIn />} />
            <Route exact={true} path="/signUp" element={<SignUp />} />
            <Route
              exact={true}
              path="/map"
              element={<MapComponent data={data} />}
            />
            <Route exact={true} path="/addProduct" element={<AddProductForm />} />
            <Route exact={true} path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </MyContext.Provider>
      </HashRouter>
    ) : (
      <div className="loader">
        <img src={Loader} />
      </div>
    )
  );
}

export default App;

export { MyContext };
