import React from 'react';

const Button = ({ children }) => {
  return (
    <button className="
      bg-blue-500 
      hover:bg-blue-700 
      text-white 
      font-bold 
      py-2 px-4 
      rounded 
      transition-colors
      duration-200
      shadow-md
      hover:shadow-lg
    ">
      {children}
    </button>
  );
};
  
  export default Button;