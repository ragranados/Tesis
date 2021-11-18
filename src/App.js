import './App.css';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Map from './components/Map/map';
import Navbar from './components/Navbar/Navbar'
import Products from './pages/Products'
import React from 'react';
import Reports from './pages/Reports'
import esriConfig from "@arcgis/core/config.js";
import {Notification} from "rsuite";

//config

esriConfig.assetsPath = "./assets";
esriConfig.apiKey = process.env.REACT_APP_ARCGIS_API_KEY;

function App() {

    //const use

    return (
        <>
            <Router>
                <Navbar/>

                <Notification style={{position:"fixed", zIndex:100}} header={"Advertencia"} type={"warning"}>
                    <text>hola</text>
                </Notification>

                <Routes>
                    <Route path='/' exact element={<Map/>}/>
                    <Route path='/reports' exact element={<Reports/>}/>
                    <Route path='/products' exact element={<Products/>}/>
                </Routes>
            </Router>

        </>
    );
}

export default App;
