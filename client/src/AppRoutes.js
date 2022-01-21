import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="user/login" element={<h1>User Login</h1>} />
      <Route path="user/register" element={<h1>User Register</h1>} />
      <Route path="admin/login" element={<h1>Admin Login</h1>} />
      <Route path="admin/register" element={<h1>Admin Register</h1>} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
