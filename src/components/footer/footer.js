import React, { useRef, useState, useEffect } from 'react';
import './footer.css';

import { useScrollToTop } from 'react-scroll-to-top';

import Icon1 from '../../assets/images/icon-1.svg';
import Icon2 from '../../assets/images/icon-2.svg';
import Icon3 from '../../assets/images/icon-3.svg';
import Icon4 from '../../assets/images/icon-4.svg';
import Icon5 from '../../assets/images/icon-5.svg';
import Logo from '../../assets/images/logo.svg';
import { Link } from 'react-router-dom';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import paymentImage from '../../assets/images/payment-method.webp';

import appStore from '../../assets/images/app-store.webp';
import googlePlay from '../../assets/images/google-play.webp';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedinIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import Newsletter from '../../components/newsletter/index';
import NewsletterImg from '../../assets/images/newsletter.webp';

const Footer = () => {
  const scrollToBottomRef = useRef(null);
  const [showScrollBottomButton, setShowScrollBottomButton] = useState(false);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollToBottomRef.current) {
      scrollToBottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
      setShowScrollBottomButton(false); // Hide the button after clicking
    }
  };
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 200) {
      setShowScrollBottomButton(true);
    } else {
      setShowScrollBottomButton(false);
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const currentYear = new Date().getFullYear();
  const location = `5171 W Campbell Ave undefined Kent, Utah 53127 United States`;
  const FooterData = [
    {
      title: 'Company',
      data: [
        { link: '/AboutUs', text: 'About Us' },
        { link: '#', text: 'Delivery Information' },
        { link: '/privacy-policy', text: 'Privacy Policy' },
        { link: '/termsandconditions', text: 'Terms & Conditions' },
        { link: '#', text: 'Contact Us' },
        { link: '/faq', text: 'FAQ' },
        { link: '/feedback', text: 'Feedback' },
        { link: '#', text: 'Contributors' }
      ]
    },
    {
      title: 'Corporate',
      data: [
        { link: '/AboutUs', title: 'About Us' },
        { link: '#', title: 'Delivery Information' },
        { link: '/privacy-policy', text: 'Privacy Policy' },
        { link: '/termsandconditions', text: 'Terms & Conditions' },
        { link: '#', text: 'Contact Us' },
        { link: '#', text: 'Support Center' },
        { link: '#', text: 'Careers' },
        { link: '#', text: 'Contributors' }
      ]
    },
    {
      title: 'Popular',
      data: [
        { link: '/AboutUs', text: 'About Us' },
        { link: '#', text: 'Delivery Information' },
        { link: '/privacy-policy', text: 'Privacy Policy' },
        { link: '/termsandconditions', text: 'Terms & Conditions' },
        { link: '#', text: 'Contact Us' },
        { link: '#', text: 'Support Center' },
        { link: '#', text: 'Careers' },
        { link: '#', text: 'Contributors' }
      ]
    }
  ];
  const SocialMedia = [
    {
      link: 'https://www.linkedin.com/in/rishi-mondal-5238b2282/',
      icon: <LinkedinIcon />
    },
    { link: 'https://github.com/MAVRICK-1#', icon: <GitHubIcon /> },
    {
      link: 'https://mavrick-portfolio.vercel.app/',
      icon: <DeveloperBoardIcon />
    },
    {
      link: 'https://www.instagram.com/realmavrick_1/?hl=en',
      icon: <InstagramIcon />
    },
    { link: '', icon: <XIcon /> }
  ];
  const fluid = [
    { img: Icon1, header: 'Best prices & offers', para: 'Orders $50 or more' },
    { img: Icon2, header: 'Free delivery', para: 'Orders $50 or more' },
    { img: Icon3, header: 'Great daily deal', para: 'Orders $50 or more' },
    { img: Icon4, header: 'Wide assortment', para: 'Orders $50 or more' },
    { img: Icon5, header: 'Easy returns', para: 'Orders $50 or more' }
  ];
  
  const addGoogleTranslateScript = () => {
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }
  };
  
  window.googleTranslateElementInit = () => {
    if (!window.googleTranslateElementInitialized) {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element'
      );
      window.googleTranslateElementInitialized = true;
    }
  };
  
  addGoogleTranslateScript();
  
  return (
    <>
      <section className="newsLetterSection">
        <div className="container-fluid">
          <div className="box d-flex align-items-center">
            <div className="info">
              <h2>
                Stay home & get your daily <br />
                needs from our shop
              </h2>
              <p>Start You'r Daily Shopping with Nest Mart</p>
              <br />
              <br className="res-hide" />
              <Newsletter />
            </div>

            <div className="img">
              <img src={NewsletterImg} className="w-100" />
            </div>
          </div>
        </div>
      </section>

      <div className="footerWrapper">
        <div className="footerBoxes">
          <div className="container-fluid">
            <div className="row">
              {fluid.map((item, index) => (
                <div key={index} className="col">
                  <div className="box d-flex align-items-center w-100">
                    <span>
                      <img src={item.img} />
                    </span>
                    <div className="info">
                      <h4>{item.header}</h4>
                      <p>{item.para}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3 part1">
                <Link to="/">
                  <img src={Logo} />
                </Link>
                <br />
                <br />
                <h4>Awesome grocery store website template🍊🥝 </h4>
                <br />

                <h5
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${location}`,
                      '_blank'
                    )
                  }
                >
                  <LocationOnOutlinedIcon />
                  <strong>Address : </strong> {location}
                </h5>
                <h5
                  className="mail-tel"
                  onClick={() => (window.location = 'tel: +91 540-025-124553')}
                >
                  <HeadphonesOutlinedIcon /> <strong> Call Us : </strong> (+91)
                  - 540-025-124553{' '}
                </h5>
                <h5
                  className="mail-tel"
                  onClick={() => (window.location = 'mailto:sale@Nest.com')}
                >
                  <EmailOutlinedIcon /> <strong> Email : </strong> sale@Nest.com
                </h5>
                <h5>
                  <WatchLaterOutlinedIcon />
                  <strong> Hours : </strong> 10:00 - 18:00, Mon - Sat
                </h5>
              </div>

              <div className="col-md-6 part2">
                <div className="footer-grid">
                  {FooterData.map((item, index) => (
                    <div key={index} className="col">
                      <h3>{item.title}</h3>
                      <ul className="footer-list mb-sm-5 mb-md-0">
                        {item.data.map((ele, eleIndex) => (
                          <li key={eleIndex}>
                            <Link to={ele.link}>{ele.text}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-3 part3">
                <h3>Install App</h3>
                <br className="res-hide" />
                <h6>From App Store or Google Play</h6>

                <div className="d-flex">
                  <Link to={''}>
                    <img src={appStore} width={150} />
                  </Link>
                  <Link to={''}>
                    <img src={googlePlay} className="mx-2" width={150} />
                  </Link>
                </div>

                <br />

                <h6>Secured Payment Gateways</h6>
                <img src={paymentImage} />
                <div id="google_translate_element" className="mt-5 p-2 bg-[#2E8B57] rounded-lg shadow-md w-8 h-16"></div>
              </div>
            </div>

            <hr />

            <div className="row lastStrip">
              <div className="col-md-4 part_1">
                <h6>© {currentYear}, Nest - HTML Ecommerce Template</h6>
                <h6>All rights reserved</h6>
              </div>

              <div className="col-md-4 d-flex part_2 align-items-center">
                <div className="phNo d-flex align-items-center mx-5">
                  <span>
                    <HeadphonesOutlinedIcon />
                  </span>
                  <div
                    className="mail-tel info ml-3"
                    onClick={() => (window.location = 'tel: 1900 - 888')}
                  >
                    <h3 className="text-g mb-0">1900 - 888</h3>
                    <h6 className="mb-0">24/7 Support Center</h6>
                  </div>
                </div>
              </div>

              <div className="col-md-4 part3 part_3">
                <div className="d-flex align-items-center">
                  <h4 className="m-0">Follow Us</h4>
                  <ul className="follow list list-inline d-inline">
                    {SocialMedia.map((item, index) => (
                      <li key={index} className="list-inline-item">
                        <Link to={item.link}>{item.icon}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* Scroll down button */}
        <button className="scroll-down-btn" onClick={scrollToBottom}>
          ↓
        </button>

        {/* Ref element for scrolling to bottom */}
        <div ref={scrollToBottomRef} />
      </div>
    </>
  );
};

export default Footer;
