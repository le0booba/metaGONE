import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 230 75"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    aria-label="metaGONE logo"
  >
    <style>
      {`.logo-text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; font-size: 50px; fill: currentColor; }`}
    </style>
    
    {/* Top decoration */}
    <path 
      d="M110 25 C110 25 110 3 110 3 L130 3 L130 15 C130 15 125 25 115 25 Z"
      fill="currentColor"
      transform="translate(25)"
    />

    {/* Text */}
    <text x="-2" y="62" className="logo-text">
      <tspan fontWeight="400">meta</tspan><tspan fontWeight="600">G</tspan><tspan fontWeight="400">one</tspan>
    </text>

    {/* Bottom decoration */}
    <path 
      d="M 5 73 H 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);