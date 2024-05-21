import React from 'react';
import Slider from "react-slick";
import './index.css';

import Slide1 from '../../../assets/images/slider-1.png';
import Slide2 from '../../../assets/images/slider-2.png';
import Button from '@mui/material/Button';

import Newsletter from '../../../components/newsletter';


import { useSelector } from 'react-redux';

const HomeSlider = () => {

    const windowWidth = useSelector((state)=>state.filter.windowWidth);

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        arrows: windowWidth>992 ? true : false,
        autoplay:true
    };



    return (
        <section className='homeSlider'>
            <div className='container-fluid position-relative'>
                <Slider {...settings} className='home_slider_Main'>
                    <div className="item">
                        <img src={Slide1} className='w-100' />
                        <div className='info'>
                            <h2 className="mb-4">
                                Don’t miss amazing<br />
                                grocery deals
                            </h2>
                            <p>Sign up for the daily newsletter</p>
                        </div>
                    </div>
                    <div className="item">
                        <img src={Slide2} className='w-100' />
                        <div className='info'>
                            <h2 className="mb-3">
                                Fresh Vegetables<br />
                                Big discount
                            </h2>
                            <p>Sign up for the daily newsletter</p>
                        </div>
                    </div>
                </Slider>

                {
                    windowWidth>992 && <Newsletter/>
                }
                

            </div>
        </section>
    )
}

export default HomeSlider;