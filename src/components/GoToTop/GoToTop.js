import React, { useEffect, useState } from 'react';
import { FaArrowUpLong } from 'react-icons/fa6';
import './GoToTop.css';

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const gotoBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const listentoscroll = () => {
    let heighttohidden = 250;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll >= heighttohidden) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', listentoscroll);
  }, []);

  return (
    <div>
      {isVisible && (
        <div className="back-to-top-button" onClick={gotoBtn}>
          <FaArrowUpLong />
        </div>
      )}
    </div>
  );
};

export default GoToTop;
