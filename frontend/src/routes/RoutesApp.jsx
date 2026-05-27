import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import Home from "../screens/Home/Home";
import CriarConta from "../screens/CriarConta/CriarConta";
import Login from "../screens/Login/Login";
import Main from "../screens/Main/Main";
import Favorites from "../screens/Favorites/Favorites";
import { AuthProvider } from "../context/AuthContext";
import Info from "../screens/Info/Info";
import Checkout from "../screens/Checkout/Checkout";

const RoutesApp = () => {
   return(
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Navigate to="/login" replace />}   path="/" exact />
                    <Route element={<Home />}   path="/home" />
                    <Route element={<Login />}  path="/login" />
                    <Route element={<Favorites /> }  path="/favorites" />
                    <Route element={<CriarConta />}   path="/criar-conta" />
                    <Route element={<Info />}   path="/info/:id" />
                    <Route element={<Checkout />} path="/checkout" />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
   )
}

export default RoutesApp;