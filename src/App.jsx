import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./Common Component/Sidebar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Sidebar />}>
          <Route path="/home" element={<Home />} />
          <Route path="/messages" element={<h1>From messages</h1>} />
          <Route path="/notifications" element={<h1>from notification</h1>} />
          <Route path="/settings" element={<h1>from settings</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
