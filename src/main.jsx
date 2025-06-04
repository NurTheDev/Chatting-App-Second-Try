// main.jsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Database from "./Database/firebase.config.js";
import { store, persistor } from "./Fetures/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ToastContainer />
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </StrictMode>
);
