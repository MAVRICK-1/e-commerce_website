import React, { useContext } from 'react';
import './blog.css';
import { categories, blogs } from './data';
import { ArrowRightAltRounded } from '@mui/icons-material';
import Slider from 'react-slick';
import { MyContext } from '../../App';

function Blog() {
  return (
    <>
      <section class="top">
        <div class="main">
          <LatestStories />
        </div>
        <ExploreTopics />
      </section>
      <StoriesList
        title="Top Stories"
        list={blogs.sort((a, b) => b.hearts - a.hearts).slice(0, 4)}
      />
      {categories.map((cat) => {
        return (
          <StoriesList
            title={cat.name}
            categoryId={cat.id}
            list={blogs.filter((blog) => blog.category === cat.id).slice(0, 4)}
          />
        );
      })}
    </>
  );
}

export default Blog;

function LatestStories() {
  const context = useContext(MyContext);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: context.windowWidth > 992 ? true : false,
    autoplay: true
  };

  return (
    <section className="homeSlider">
      <div className="homeSlider-inner">
        <Slider {...settings} className="home_slider_Main">
          {blogs
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 4)
            .map((blog) => {
              return (
                <div className="item">
                  <img src={blog.imageUrl} alt="" />
                  <div class="content">
                    <h3>Latest Stories</h3>
                    <h2>{blog.title}</h2>
                    <p>
                      <span>{blog.date}</span>
                      <span>
                        <span className="hearts">&hearts;</span>
                        <span>{blog.hearts}</span>
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
        </Slider>
      </div>
    </section>
  );
}
function ExploreTopics() {
  return (
    <div class="topics">
      <h3>Explore Topics</h3>
      <ul>
        {categories.map((cat) => {
          return (
            <a href={`#${cat.id}`}>
              <li key={cat.id}>
                <img src={cat.image} alt="" />
                <div>{cat.name}</div>
              </li>
            </a>
          );
        })}
      </ul>
      <a href="#">See more...</a>
    </div>
  );
}
function StoriesList({ title, categoryId, list }) {
  return (
    <section class="cards" id={categoryId ? categoryId : ''}>
      <h1>
        {title}{' '}
        <button>
          View more <ArrowRightAltRounded />
        </button>
      </h1>
      <div class="cards-wrapper">
        {list.map((blog) => {
          return (
            <div class="card" key={blog.id}>
              <div class="image">
                <img src={blog.imageUrl} alt="" />
              </div>
              <div class="title">{blog.title}.</div>
              <p>
                <span>{blog.date}</span>
                <span>
                  <span>&hearts;</span>
                  <span>{blog.hearts}</span>
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
