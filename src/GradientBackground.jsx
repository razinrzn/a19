import React from 'react';
import './GradientBackground.css';

const FLOATING_ELEMENT_COUNT = 15;

const GradientBackground = ({ parallax }) => {
  const { x, y } = parallax;
  // Use x,y for transform to create a parallax effect on background gradient
  const transformStyle = {
    transform: `translate3d(${x * 5}px, ${y * 5}px, 0)`,
    transition: 'transform 0.2s ease-out',
  };

  // Create floating elements array
  const floatingElements = Array.from({ length: FLOATING_ELEMENT_COUNT }, (_, i) => i);

  return (
    <div className="gradient-background" style={transformStyle} aria-hidden="true">
      {floatingElements.map(i => (
        <div key={i} className={`floating-element floating-element-${i}`} />
      ))}
    </div>
  );
};

export default GradientBackground;
