import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Modal from 'react-modal';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Ingredients from './pages/Ingredients';
import './styles/Animations.css';

// Set the app element for react-modal
Modal.setAppElement('#root');

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ingredients" element={<Ingredients />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
