import React, { useEffect, useState } from 'react';
import { FaChevronUp } from 'react-icons/fa6';
import './GoToTop.css';

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const gotoBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const listentoscroll = () => {
    const heightToShow = 150;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll >= heightToShow) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', listentoscroll);
    return () => {
      window.removeEventListener('scroll', listentoscroll);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <div className="back-to-top-button" onClick={gotoBtn}>
          <FaChevronUp />
        </div>
      )}
    </div>
  );
};

export default GoToTop;

document.addEventListener('DOMContentLoaded', function () {
  const scrollToTopButton = document.querySelector('.back-to-top-button');

  if (scrollToTopButton) {
    document.addEventListener('scroll', function () {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // Show button when near the bottom of the page
      if (scrollPosition >= pageHeight / 2) {
        scrollToTopButton.classList.add('show');
      } else {
        scrollToTopButton.classList.remove('show');
      }
    });

    scrollToTopButton.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  } else {
    console.error('Back-to-top button not found in the DOM');
  }
});
