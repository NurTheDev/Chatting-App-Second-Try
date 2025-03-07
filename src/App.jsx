/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Database from "./Database/firebase.config.js";
import Home from "./Pages/Home";
import Sidebar from "./Common Component/Sidebar";
const App = () => {
  // const router = createBrowserRouter([
  //   { path: "/", element: <Register /> },
  //   { path: "/login", element: <Login /> },
  //   { path: "/home", element: <Home /> },
  //   {path: "/sidebar", element: <Sidebar />}
  // ]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      
    </BrowserRouter>
  );
};

export default App;
