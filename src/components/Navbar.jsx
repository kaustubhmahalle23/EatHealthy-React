import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-emerald-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">EatHealthy</Link>
        {/* Navigation links removed */}
      </div>
    </nav>
  );
};

export default Navbar;
