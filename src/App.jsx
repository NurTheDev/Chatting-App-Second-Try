// App.jsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./Common Component/Sidebar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ChatPage from "./Pages/ChatPage.jsx";
import ConfirmEmail from "./Pages/ConfirmEmail.jsx";
import Settings from "./Pages/Settings.jsx";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route element={<Sidebar />}>
            <Route path="/" element={<Home />} />
            <Route path="/messages" element={<ChatPage />} />
            <Route path="/notifications" element={<h1>from notification</h1>} />
            <Route path="/settings" element={<h1><Settings /></h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
};

export default App;
