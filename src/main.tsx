import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NegotiationPage from "./pages/NegotiationPage";
import "./index.css";
import FinalPage from "./pages/FinalPage";
import PastDeals from "./pages/PastDeals"; 


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/negotiation" element={<NegotiationPage />} />
        <Route path="/final" element={<FinalPage />} />
        <Route path="/past-deals/:roomCode" element={<PastDeals />} /> 

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);