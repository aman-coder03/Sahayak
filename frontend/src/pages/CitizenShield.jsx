import { useState } from "react";

import API from "../services/api";

function CitizenShield() {

  const [message, setMessage] =
    useState("");

  const [result, setResult] =
    useState(null);

  const analyze = async () => {

    const response =
      await API.post(
        "/citizen-shield",
        {
          message,
        }
      );

    setResult(
      response.data
    );
  };

  return (

    <div
      style={{
        padding: "30px",
      }}
    >

      <h2>
        Citizen Fraud Shield
      </h2>

      <textarea
        rows="6"
        cols="70"
        value={message}
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
      />

      <br />

      <button
        onClick={analyze}
      >
        Analyze
      </button>

      {result && (

        <div>

          <h3>
            Risk Score:
            {result.risk_score}
          </h3>

          <h3>
            Verdict:
            {result.verdict}
          </h3>

        </div>

      )}

    </div>
  );
}

export default CitizenShield;