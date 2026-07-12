import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 15000,
});

export const citizenShield = (message) => client.post("/citizen-shield", { message });

export const generateDNA = (payload) => client.post("/generate-dna", payload);

export const fraudNetwork = (payload) => client.post("/fraud-network", payload);

export const copilot = (query) => client.post("/copilot", { query });

export const getCrimeHotspots = () => client.get("/crime-hotspots");

export const getDashboardSummary = () => client.get("/dashboard-summary");

export const generateEvidence = (caseId) =>
  client.post("/generate-evidence", { case_id: caseId });

export default client;