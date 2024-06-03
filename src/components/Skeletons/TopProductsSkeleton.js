import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import '../../pages/Home/TopProducts/style.css';

const TopProductsSkeleton = () => {
  return (
    <div className="topSelling_box">
      <Skeleton
        variant="text"
        width="40%"
        height={40}
        style={{ marginBottom: '1rem' }}
      />

      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="items d-flex align-items-center"
          style={{ marginBottom: '1rem' }}
        >
          <div className="img" style={{ width: '150px', height: '150px' }}>
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </div>

          <div className="info px-3" style={{ flex: 1 }}>
            <Skeleton
              variant="text"
              width="80%"
              height={30}
              style={{ marginBottom: '0.5rem' }}
            />
            <Skeleton
              variant="text"
              width="40%"
              height={20}
              style={{ marginBottom: '0.5rem' }}
            />
            <Skeleton variant="rectangular" width="60%" height={30} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopProductsSkeleton;
