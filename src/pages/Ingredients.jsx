import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import '../styles/Animations.css';

const CustomBackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="group flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
  >
    <ArrowLeftIcon className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
    <span className="font-medium">Back to Home</span>
  </button>
);

const Ingredients = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ingredients = location.state?.ingredients?.ingredients || [];

  console.log('Ingredients data:', ingredients);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex-grow relative min-h-screen">
      <div className="animated-background"></div>
      <div className="relative z-10 py-8">
        <div className="max-w-4xl mx-auto bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-emerald-700">Ingredient Analysis</h1>
          {ingredients.length > 0 ? (
            <ul className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h2 className="text-xl font-semibold mb-2">{ingredient.ingredient}</h2>
                  <p className="mb-2 text-gray-600">{ingredient.ingredientDescription}</p>
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ingredient.threat ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {ingredient.threat ? 'Potentially Harmful' : 'Generally Safe'}
                    </span>
                    <span className="font-bold text-blue-600">
                      Rating: {ingredient.rating}/10
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No ingredients data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ingredients;
