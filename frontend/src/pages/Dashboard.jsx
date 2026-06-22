import { useEffect, useState } from "react";

import API from "../services/api";

import StatsCard from "../components/StatsCard";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {

  const [summary, setSummary] = useState(null);

  useEffect(() => {

    API.get("/dashboard-summary")
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  const chartData = [
    { day: "Mon", cases: 5 },
    { day: "Tue", cases: 8 },
    { day: "Wed", cases: 12 },
    { day: "Thu", cases: 7 },
    { day: "Fri", cases: 15 },
    { day: "Sat", cases: 11 },
    { day: "Sun", cases: 18 },
  ];

  if (!summary) {

    return (
      <div
        style={{
          background: "#0f172a",
          color: "white",
          minHeight: "100vh",
          padding: "30px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (

    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        padding: "30px",
        color: "white",
      }}
    >

      <h1>
        🛡 SAHAYAK Command Center
      </h1>

      <p>
        AI-Powered Digital Public Safety Intelligence Platform
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >

        <StatsCard
          title="Total Cases"
          value={summary.total_cases}
          color="#3b82f6"
        />

        <StatsCard
          title="High Risk Cases"
          value={summary.high_risk_cases}
          color="#ef4444"
        />

        <StatsCard
          title="Threat Level"
          value={summary.threat_level}
          color="#f59e0b"
        />

      </div>

      <div
        style={{
          marginTop: "40px",
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
        }}
      >

        <h2>
          📈 Fraud Activity Trend
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart
            data={chartData}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="cases"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
          }}
        >

          <h2>
            🚨 Threat Status
          </h2>

          <h3>
            {summary.threat_level}
          </h3>

          <p>
            Monitoring active fraud
            clusters across India.
          </p>

        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "12px",
          }}
        >

          <h2>
            🤖 AI Systems
          </h2>

          <p>
            Fraud DNA Engine
            ✓ Active
          </p>

          <p>
            Citizen Shield
            ✓ Active
          </p>

          <p>
            Investigator Copilot
            ✓ Active
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;