import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const HomeSliderSkeleton = () => {
  const skeletonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#f0f0f0'
  };

  return (
    <section className="homeSlider">
      <div className="container-fluid position-relative">
        <div style={skeletonStyle}>
          <Skeleton variant="rectangular" width="100%" height={600} />
        </div>
      </div>
    </section>
  );
};

export default HomeSliderSkeleton;
