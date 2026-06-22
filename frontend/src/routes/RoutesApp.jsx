import React from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import CriarConta from "../screens/CriarConta/CriarConta";
import Login from "../screens/Login/Login";
import Main from "../screens/Main/Main";
import Favorites from "../screens/Favorites/Favorites";
import { AuthProvider } from "../context/AuthContext";
import Info from "../screens/Info/Info";
import Checkout from "../screens/Checkout/Checkout";
import Chat from "../screens/Chat/Chat";
import Audit from "../screens/Audit/Audit";

const RoutesApp = () => {
   return(
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Navigate to="/login" replace />}   path="/" exact />
                    <Route element={<Main />}   path="/main" />
                    <Route element={<Login />}  path="/login" />
                    <Route element={<Favorites /> }  path="/favorites" />
                    <Route element={<CriarConta />}   path="/criar-conta" />
                    <Route element={<Info />}   path="/info/:id" />
                    <Route element={<Chat />} path="/chat/:produtoId" />
                    <Route element={<Checkout />} path="/checkout" />
                    <Route element={<Audit />} path="/auditoria" />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
   )
}

export default RoutesApp;