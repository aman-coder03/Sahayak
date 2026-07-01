import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import CitizenShield from "./pages/CitizenShield";
import FraudDNALab from "./pages/FraudDNALab";
import InvestigatorCopilot from "./pages/InvestigatorCopilot";
import CrimeIntelligence from "./pages/CrimeIntelligence";
import EvidenceCenter from "./pages/EvidenceCenter";
import FraudNetwork from "./pages/FraudNetwork";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/shield" element={<CitizenShield />} />
        <Route path="/dna" element={<FraudDNALab />} />
        <Route path="/copilot" element={<InvestigatorCopilot />} />
        <Route path="/intelligence" element={<CrimeIntelligence />} />
        <Route path="/evidence" element={<EvidenceCenter />} />
        <Route path="/network" element={<FraudNetwork />} />
      </Route>
    </Routes>
  );
}