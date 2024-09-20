import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">EatHealthy</Link>
        <div>
          <Link to="/" className="text-white mr-4 hover:text-blue-200">Home</Link>
          <Link to="/ingredients" className="text-white hover:text-blue-200">Ingredients</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
