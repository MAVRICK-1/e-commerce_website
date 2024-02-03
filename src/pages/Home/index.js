import React, { useState, useEffect, useRef, useContext } from 'react';
import SliderBanner from './slider/index';
import CatSlider from '../../components/catSlider';

import Banners from '../../components/banners';

import './style.css';
import Product from '../../components/product';
import Banner4 from '../../assets/images/banner4.jpg';

import Slider from "react-slick";
import TopProducts from './TopProducts';
import axios from 'axios';
import { MyContext } from '../../App';

const Home = (props) => {

    const [prodData, setprodData] = useState(props.data)
    const [catArray, setcatArray] = useState([])
    const [activeTab, setactiveTab] = useState();
    const [activeTabIndex, setactiveTabIndex] = useState(0);
    const [activeTabData, setActiveTabData] = useState([]);

    const [bestSells, setBestSells] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const productRow=useRef();
    const context = useContext(MyContext);

    var settings = {
        dots: false,
        infinite: context.windowWidth<992 ? false : true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        fade: false,
        arrows: context.windowWidth<992 ? false : true,
    };

    const catArr = [];

    useEffect(() => {

        prodData.length !== 0 &&
            prodData.map((item) => {
                item.items.length !== 0 &&
                    item.items.map((item_) => {
                        catArr.push(item_.cat_name);
                    })
            })

        const list2 = catArr.filter((item, index) => catArr.indexOf(item) === index);
        setcatArray(list2)

        setactiveTab(list2[0])

        window.scrollTo(0,0);

    }, [])





    useEffect(() => {
        var arr = [];
        setActiveTabData(arr);
        prodData.length !== 0 &&
            prodData.map((item, index) => {
                item.items.map((item_, index_) => {
                    if (item_.cat_name === activeTab) {
                        {
                            item_.products.length !== 0 &&
                                item_.products.map((product) => {
                                    arr.push({ ...product, parentCatName: item.cat_name, subCatName: item_.cat_name })
                                })

                            setActiveTabData(arr)
                            setTimeout(()=>{
                                setIsLoadingProducts(false);
                            },[1000]);
                        }
                    }
                })

            })

    }, [activeTab, activeTabData])





    const bestSellsArr = [];

    useEffect(() => {
        prodData.length !== 0 &&
            prodData.map((item) => {
                if (item.cat_name === "Electronics") {
                    item.items.length !== 0 &&
                        item.items.map((item_) => {
                            item_.products.length !== 0 &&
                                item_.products.map((product, index) => {
                                    bestSellsArr.push(product);
                                })
                        })
                }

            });


        setBestSells(bestSellsArr);

    }, [])




    return (
        <div style={{display:'block'}}>
            <SliderBanner />
            <CatSlider data={prodData} />

            <Banners />


            <section className='homeProducts homeProductWrapper'>
                <div className='container-fluid'>
                    <div className='d-flex align-items-center homeProductsTitleWrap'>
                        <h2 className='hd mb-0 mt-0 res-full'>Popular Products</h2>
                        <ul className='list list-inline ml-auto filterTab mb-0 res-full'>

                            {
                                catArray.length !== 0 &&
                                catArray.map((cat, index) => {
                                    return (
                                        <li className="list list-inline-item">
                                            <a className={`cursor text-capitalize 
                                                ${activeTabIndex === index ? 'act' : ''}`}
                                                onClick={() => {
                                                    setactiveTab(cat)
                                                    setactiveTabIndex(index);
                                                    productRow.current.scrollLeft=0;
                                                    setIsLoadingProducts(true);
                                                }}
                                            >
                                                {cat}
                                            </a>
                                        </li>
                                    )
                                })
                            }

                        </ul>
                    </div>


                    <div className={`productRow ${isLoadingProducts===true && 'loading'}`} ref={productRow}>

                        {
                            activeTabData.length !== 0 &&
                            activeTabData.map((item, index) => {
                                return (
                                    <div className='item' key={index}>

                                        <Product tag={item.type} item={item} />
                                    </div>
                                )
                            })
                        }

                    </div>

                </div>
            </section>






            <section className='homeProducts homeProductsRow2 pt-0'>
                <div className='container-fluid'>
                    <div className='d-flex align-items-center'>
                        <h2 className='hd mb-0 mt-0'>Daily Best Sells</h2>

                    </div>

                    <br className='res-hide' /><br  className='res-hide'/>
                    <div className='row'>
                        <div className='col-md-3 pr-5 res-hide'>
                            <img src={Banner4} className='w-100' />
                        </div>

                        <div className='col-md-9'>
                            <Slider {...settings} className='prodSlider'>

                                {
                                    bestSells.length !== 0 &&
                                    bestSells.map((item, index) => {
                                        return (
                                            <div className='item' key={index}>
                                                <Product tag={item.type} item={item} />
                                            </div>
                                        )
                                    })
                                }

                            </Slider>
                        </div>
                    </div>


                </div>
            </section>



            <section className='topProductsSection'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col'>
                            <TopProducts title="Top Selling" />
                        </div>

                        <div className='col'>
                            <TopProducts title="Trending Products" />
                        </div>

                        <div className='col'>
                            <TopProducts title="Recently added" />
                        </div>

                        <div className='col'>
                            <TopProducts title="Top Rated" />
                        </div>

                    </div>
                </div>
            </section>


        </div>
    )
}

export default Home;






