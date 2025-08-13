import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./components/authentication/Login";

import EquipmentDetail from "./components/equipment/EquipmentDetail";
import EquipmentList from "./components/equipment/EquipmentList";
import SearchPage  from "./components/pages/SearchPage";
import TransferEquipmentPage from "./components/transfer/TransferEquipmentPage";
import TransferRequestsList from './components/transfer/TransferRequestsList';
import TransferRequestDetail from './components/transfer/TransferRequestDetail';


function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/equipment/:id/" element={<ProtectedRoute><EquipmentDetail /></ProtectedRoute>}/>
      <Route path="/equipment-list/" element={<ProtectedRoute><EquipmentList/></ProtectedRoute>}/>
      <Route path="/search/" element={<ProtectedRoute><SearchPage /></ProtectedRoute>}/>
      <Route path="/transfer-equipment/" element={<ProtectedRoute><TransferEquipmentPage /></ProtectedRoute>}/>

      <Route path="/transfer-list" element={<ProtectedRoute><TransferRequestsList /></ProtectedRoute>}/>
      <Route path="/transfer-request/:public_id" element={<ProtectedRoute><TransferRequestDetail /></ProtectedRoute>}/>

      <Route path="/login/" element={<Login />} />
    </Routes>
  );
}

export default App;
