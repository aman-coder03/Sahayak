import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";

import Dashboard from "./pages/Dashboard";
import CitizenShield from "./pages/CitizenShield";
import Copilot from "./pages/Copilot";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="shield" element={<CitizenShield />} />
        <Route path="copilot" element={<Copilot />} />
      </Route>
    </Routes>
  );
}