import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./components/authentication/Login";
import EquipmentHistory from "./components/equipment/EquipmentHistory";


function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/equipment/:id" element={<ProtectedRoute><EquipmentHistory /></ProtectedRoute>}/>

      <Route path="/login/" element={<Login />} />
    </Routes>
  );
}

export default App;
