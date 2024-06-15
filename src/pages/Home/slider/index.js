import React, { useEffect, useContext, useState, useMemo } from 'react';
import Slider from 'react-slick';
import './index.css';

import Slide1 from '../../../assets/images/slider-1.webp';
import Slide2 from '../../../assets/images/slider-2.webp';
import mobile from '../../../assets/images/elec.jpg';
import fash from '../../../assets/images/fashion.jpg';
import fruit from '../../../assets/images/fruits.jpg';

import Newsletter from '../../../components/newsletter';

import { MyContext } from '../../../App';
import HomeSliderSkeleton from '../../../components/Skeletons/HomeSliderSkeleton';

const slides = [
  {
    src: Slide1,
    title: 'Don’t miss amazing grocery deals',
    description: 'Sign up for the daily newsletter',
  },
  {
    src: Slide2,
    title: 'Fresh Vegetables - Big discount',
    description: 'Sign up for the daily newsletter',
  },
  {
    src: fash,
    title: 'Latest Fashion - upto 60% off',
    description: 'Grab Now!',
  },
  {
    src: mobile,
    title: 'Laptops - At great discounts',
    description: 'Get them today, before it ends!',
  },
  {
    src: fruit,
    title: 'Fresh and Exotic Fruits - great offers',
    description: 'Get them delivered at your doorsteps!',
  },
];

const HomeSlider = () => {
  const context = useContext(MyContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate loading time (2 seconds)

    return () => clearTimeout(timer);
  }, []);

  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: context.windowWidth > 992,
    autoplay: true,
  }), [context.windowWidth]);

  const renderSlides = () => slides.map((slide, index) => (
    <div className="item" key={index}>
      <img src={slide.src} className="w-n" alt={slide.title} loading="lazy" />
      <div className="info">
        <h2 className="mb-4">{slide.title.split(' - ')[0]}<br />{slide.title.split(' - ')[1]}</h2>
        <p>{slide.description}</p>
      </div>
    </div>
  ));

  if (loading) {
    return <HomeSliderSkeleton />;
  }

  return (
    <section className="homeSlider">
      <div className="container-fluid position-relative">
        <Slider {...settings} className="home_slider_Main">
          {renderSlides()}
        </Slider>
        {context.windowWidth > 992 && <Newsletter />}
      </div>
    </section>
  );
};

export default HomeSlider;
