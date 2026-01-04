import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./components/pages/Landingsection/LoginPage.jsx";
import SignupPage from "./components/pages/Landingsection/SignupPage.jsx";
import PageNotFoundPage from "./components/pages/PageNotFoundPage.jsx";
import HomePage from "./components/pages/Landingsection/HomePage.tsx";
import TotpPage from "./components/pages/Landingsection/TotpPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/totp" element={<TotpPage />} />
        <Route path="*" element={<PageNotFoundPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
