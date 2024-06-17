import React from 'react';

const CustomPrevArrow = ({ className, style, onClick }) => (
    <div
      className={className}
      style={{ ...style, display: 'none' }}
      onClick={onClick}
    />
  );
  
  const CustomNextArrow = ({ className, style, onClick }) => (
    <div
      className={className}
      style={{ ...style, display: 'none' }}
      onClick={onClick}
    />
  );
  
  export { CustomPrevArrow, CustomNextArrow };