import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error("[SAHAYAK API]", err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);

export const getDashboardSummary = () => api.get("/dashboard-summary");
export const analyzeScam = (transcript) => api.post("/analyze-scam", { transcript });
export const citizenShield = (message) => api.post("/citizen-shield", { message });
export const generateDNA = (payload) => api.post("/generate-dna", payload);
export const fraudNetwork = (payload) => api.post("/fraud-network", payload);
export const copilot = (query) => api.post("/copilot", { query });
export const generateEvidence = (case_id) => api.post("/generate-evidence", { case_id });
export const getCrimeHotspots = () => api.get("/crime-hotspots");

export default api;
