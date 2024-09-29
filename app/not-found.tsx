// pages/404.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';

const Custom404 = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleBackHomeClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = '/';
    }, 3000); // Redirect after 3 seconds
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-lg text-gray-600">Oops! Page not found.</p>
        <span 
          onClick={handleBackHomeClick} 
          className={`mt-6 inline-flex items-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} className="mr-2 text-white font-bold" />
              Processing...
            </>
          ) : (
            'Go back home'
          )}
        </span>
      </div>
    </div>
  );
};

export default Custom404;