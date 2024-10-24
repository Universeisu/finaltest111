// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Adjust the import based on your file structure

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet /> {/* This will render the matched child route */}
      
    </div>
  );
};

export default Layout;
