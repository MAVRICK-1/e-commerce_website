import React, { useEffect, useContext, useState } from 'react';
import './nav.css';
import { Link, NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GridViewIcon from '@mui/icons-material/GridView';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import { MyContext } from '../../../App';
import { useSelector } from 'react-redux';

//BROWSE ALL CATEGORY ICONS
import milk from '../../../assets/images/milk.svg';
import drink from '../../../assets/images/drink.svg';
import cloth from '../../../assets/images/cloth.svg';
import fish from '../../../assets/images/fish.svg';
import fastfood from '../../../assets/images/fastfood.svg';
import pet from '../../../assets/images/pet.svg';
import fruit from '../../../assets/images/fruit.svg';
import juice from '../../../assets/images/juice.svg';
import cake from '../../../assets/images/cake.svg';
import dress from '../../../assets/images/dress.svg';
import beauty from '../../../assets/images/beauty.svg';
import tv from '../../../assets/images/tv.svg';
import speaker from '../../../assets/images/speaker.svg';
import mobile from '../../../assets/images/mobile.svg';
import oil from '../../../assets/images/oil.svg';
import diet from '../../../assets/images/diet.svg';
import snack from '../../../assets/images/snack.svg';
import veg from '../../../assets/images/veg.svg';
import flour from '../../../assets/images/flour.svg';
import rice from '../../../assets/images/rice.svg';
//END OF BROWSE ALL CATEGORY ICONS

const Nav = (props) => {
  const logged = useSelector((state) => state.authReducer.value.isAuth);

  const [navData, setNavData] = useState([]);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [openDropdownMenu, setDropdownMenu] = useState(false);
  const [openDropdownMenuIndex, setDropdownMenuIndex] = useState(null);
  const [openMegaMenu, setOpenMegaMenu] = useState(false);
  const context = useContext(MyContext);

  //BROWSE ALL CATEGORY CONTENT
  const initialItems = [
    { id: 1, imgSrc: milk, text: 'Milk and Dairies', link: '/' },
    { id: 2, imgSrc: drink, text: 'Wines & Drinks', link: '/' },
    { id: 3, imgSrc: beauty, text: 'Beauty Products', link: '/' },
    { id: 4, imgSrc: fish, text: 'Fresh Seafood', link: '/' },
    { id: 5, imgSrc: pet, text: 'Pet Foods & Toy', link: '/' },
    { id: 6, imgSrc: fastfood, text: 'Fast Food', link: '/' },
    { id: 7, imgSrc: cake, text: 'Baking material', link: '/' },
    { id: 8, imgSrc: veg, text: 'Vegetables', link: '/' },
    { id: 9, imgSrc: fruit, text: 'Fresh Fruit', link: '/' },
    { id: 10, imgSrc: juice, text: 'Bread and Juice', link: '/' }
  ];

  const moreItems = [
    {
      id: 11,
      imgSrc: mobile,
      text: 'Mobile & Tablets',
      link: '/mobiles-&-tablets'
    },
    { id: 12, imgSrc: tv, text: 'TV ', link: '/tv-&-speaker' },
    { id: 13, imgSrc: speaker, text: 'Speaker', link: '/' },
    { id: 14, imgSrc: dress, text: 'Womens wear', link: '/' },
    { id: 15, imgSrc: cloth, text: 'Mens wear', link: '/men-western-wear' },
    { id: 16, imgSrc: oil, text: 'Oils', link: '/women-western-wear' },
    { id: 17, imgSrc: flour, text: 'Atta & Flours', link: '/atta-&-flours' },
    { id: 18, imgSrc: snack, text: 'Snacks', link: '/' },
    { id: 19, imgSrc: rice, text: 'Dals and pulses', link: '/dals-and-pulses' },
    { id: 20, imgSrc: diet, text: 'Diet Food', link: '/' }
  ];
  //END OF CONTENT

  const [items, setItems] = useState(initialItems);
  const [expanded, setExpanded] = useState(false);

  const handleShowMore = () => {
    setItems([...initialItems, ...moreItems]);
    setExpanded(true);
  };

  const handleShowLess = () => {
    setItems(initialItems);
    setExpanded(false);
  };
  useEffect(() => {
    setNavData(props.data);
  }, []);

  useEffect(() => {
    setIsOpenNav(props.openNav);
  }, [props.openNav]);

  const closeNav = () => {
    props.closeNav();
  };

  const openDropdownFun = (index) => {
    setDropdownMenu(!openDropdownMenu);
    setDropdownMenuIndex(index);
  };

  return (
    <>
      {isOpenNav && (
        <div className="navbarOverlay" onClick={props.closeNav}></div>
      )}
      <div
        className={`nav d-flex align-items-center ${isOpenNav ? 'click' : ''}`}
      >
        <div className="container-fluid">
          <div className="row position-relative">
            {/*BROWSE ALL CATEGORY CODE */}
            <div className="col-sm-2 browBtn d-flex align-items-center justify-content-center">
              <nav>
                <ul className="list list-inline">
                  <li className="list-inline-item position-static">
                    <Button className="bg-g text-white catTab res-hide">
                      <GridViewIcon /> &nbsp;
                      <h2 className="browHead">Browse All Categories</h2>
                      <KeyboardArrowDownIcon />
                    </Button>
                    <div
                      className={`all_menu browse_menu ${
                        expanded ? 'expanded' : ''
                      }`}
                    >
                      <div
                        className={`grid-container ${
                          expanded ? 'expanded' : ''
                        }`}
                      >
                        {items.map((item, index) => (
                          <div key={item.id} className="set-box">
                            <ul className="cut-box mt-3 mb-2 px-3">
                              <li>
                                <img
                                  src={item.imgSrc}
                                  className="green-icon"
                                  alt=""
                                />
                                <Link to={item.link} className="text-beox">
                                  {item.text}
                                </Link>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="showM">
                        {!expanded ? (
                          <Link onClick={handleShowMore}>Show More</Link>
                        ) : (
                          <Link onClick={handleShowLess}>Show Less</Link>
                        )}
                      </div>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>{' '}
            {/*END OF BROWSE ALL CATEGORY */}
            <div className="col-sm-8 part2 position-static">
              <nav className={isOpenNav ? 'open' : ''}>
                <ul className="list list-inline mb-0">
                  <li className="list-inline-item">
                    <Button>
                      <NavLink
                        to={'/'}
                        onClick={props.closeNav}
                        className={({ isActive }) =>
                          isActive ? 'active-link' : ''
                        }
                      >
                        Home
                      </NavLink>
                    </Button>
                  </li>

                  {navData.length !== 0 &&
                    navData.map((item, index) => (
                      <li className="list-inline-item" key={index}>
                        <Button onClick={() => openDropdownFun(index)}>
                          <a
                            href={`${windowWidth > 992 ? `#` : '#'}`}
                            onClick={() =>
                              sessionStorage.setItem(
                                'cat',
                                item.cat_name.toLowerCase()
                              )
                            }
                          >
                            {item.cat_name}{' '}
                            <KeyboardArrowDownIcon
                              className={`${
                                openDropdownMenu &&
                                openDropdownMenuIndex === index &&
                                'rotateIcon'
                              }`}
                            />
                          </a>
                        </Button>

                        {item.items.length !== 0 && (
                          <div
                            className={`dropdown_menu ${
                              openDropdownMenu &&
                              openDropdownMenuIndex === index &&
                              'open'
                            }`}
                          >
                            <ul>
                              {item.items.map((item_, index_) => (
                                <li key={index_}>
                                  <Button
                                    onClick={() => {
                                      props.closeNav();
                                      setDropdownMenu(!openDropdownMenu);
                                      setDropdownMenuIndex(null);
                                    }}
                                  >
                                    <a
                                      href={`/cat/${item.cat_name.toLowerCase()}/${item_.cat_name
                                        .replace(/\s/g, '-')
                                        .toLowerCase()}`}
                                      onClick={() =>
                                        sessionStorage.setItem(
                                          'cat',
                                          item.cat_name.toLowerCase()
                                        )
                                      }
                                    >
                                      {item_.cat_name}
                                    </a>
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}

                  <li className="list-inline-item">
                    <Button onClick={props.closeNav}>
                      <NavLink
                        to={'/AboutUs'}
                        className={({ isActive }) =>
                          isActive ? 'active-link' : ''
                        }
                      >
                        About
                      </NavLink>
                    </Button>
                  </li>

                  <li className="list-inline-item position-static">
                    <Button onClick={() => setOpenMegaMenu(!openMegaMenu)}>
                      <Link>
                        Shop
                        <KeyboardArrowDownIcon
                          className={`${openMegaMenu === true && 'rotateIcon'}`}
                        />
                      </Link>
                    </Button>
                    <div
                      className={`dropdown_menu megaMenu w-100 ${
                        openMegaMenu === true && 'open'
                      }`}
                    >
                      <div className="row">
                        {props.data.length !== 0 &&
                          props.data.map((item, index) => {
                            return (
                              <div className="col">
                                <a href={`/cat/${item.cat_name.toLowerCase()}`}>
                                  {' '}
                                  <h2 className="text-g text-capitalize">
                                    {item.cat_name}
                                  </h2>
                                </a>
                                {item.items.length !== 0 && (
                                  <ul className="mt-4 mb-0 text-g text-capitalize font-weight-bold">
                                    {item.items.map((item_, index) => {
                                      return (
                                        <li>
                                          <Link
                                            onClick={props.closeNav}
                                            to={`/cat/${item.cat_name.toLowerCase()}/${item_.cat_name
                                              .replace(/\s/g, '-')
                                              .toLowerCase()}`}
                                          >
                                            {item_.cat_name}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            );
                          })}

                        <div className="col">
                          <img
                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/banner/banner-menu.png"
                            className="w-100"
                            alt="Banner"
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-inline-item">
                    {/* <li className='list-inline-item'>
                                        <Button><Link>Pages  <KeyboardArrowDownIcon /></Link>
                                        </Button>

                                        <div className='dropdown_menu'>
                                            <ul>
                                                <li><Button><Link to="/about">About Us</Link></Button></li>
                                                <li><Button><Link to="/about">Contact</Link></Button></li>
                                                <li><Button><Link to="/about">My Account</Link></Button></li>
                                                <li><Button><Link to="/about">Login</Link></Button></li>
                                                <li><Button><Link to="/about">Register</Link></Button></li>
                                                <li><Button><Link to="/about">Forgot password</Link></Button></li>
                                                <li><Button><Link to="/about">Reset password</Link></Button></li>
                                                <li><Button><Link to="/about">Purchase Guide</Link></Button></li>
                                                <li><Button><Link to="/about">Privacy Policy</Link></Button></li>
                                                <li><Button><Link to="/about">Terms of Service</Link></Button></li>
                                                <li><Button><Link to="/about">404 Page</Link></Button></li>
                                            </ul>
                                        </div>

                                    </li> */}
                    <Button>
                      <NavLink
                        to="/blog"
                        className={({ isActive }) =>
                          isActive ? 'active-link' : ''
                        }
                      >
                        Blog
                      </NavLink>
                    </Button>
                  </li>

                  <li className="list-inline-item">
                    <Button>
                      <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                          isActive ? 'active-link' : ''
                        }
                      >
                        Contact
                      </NavLink>
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button>
                      <NavLink
                        className={({ isActive }) =>
                          isActive ? 'active-link' : ''
                        }
                        to={'/contributors'}
                      >
                        Contributors
                      </NavLink>
                    </Button>
                  </li>
                </ul>

                {windowWidth < 992 && (
                  <>
                    {context.isLogin !== 'true' && (
                      <div className="pl-3 pr-3">
                        <br />
                        <Link to={'/signIn'}>
                          <Button
                            className="btn btn-g btn-lg w-100"
                            onClick={closeNav}
                          >
                            Sign In
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </nav>
            </div>
            <div className="col-sm-2 part3 d-flex align-items-center">
              <div className="phNo d-flex align-items-center ml-auto">
                <span>
                  <HeadphonesOutlinedIcon />
                </span>
                <div className="info ml-3">
                  <h4 class="bold-h4">1900-888</h4>
                  <p className="mb-0">24/7 Support Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
