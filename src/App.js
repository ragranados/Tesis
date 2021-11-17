import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Map from './components/Map/map';
import Navbar from './components/Navbar/Navbar'
import Products from './pages/Products'
import React from 'react';
import Reports from './pages/Reports'
import esriConfig from "@arcgis/core/config.js";

//config

esriConfig.assetsPath = "./assets";
esriConfig.apiKey = process.env.REACT_APP_ARCGIS_API_KEY;

function App() {
  return (
      <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<Map/>} />
          <Route path='/reports' exact element={<Reports/>} />
          <Route path='/products' exact element={<Products/>} />
        </Routes>
      </Router>
        
      </>
  );
}

export default App;
