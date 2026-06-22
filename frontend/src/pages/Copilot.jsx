import { useState } from "react";

import API from "../services/api";

function Copilot() {

  const [query, setQuery] =
    useState("");

  const [result, setResult] =
    useState(null);

  const askCopilot =
    async () => {

      const response =
        await API.post(
          "/copilot",
          {
            query,
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
        AI Investigator Copilot
      </h2>

      <input
        value={query}
        onChange={(e) =>
          setQuery(
            e.target.value
          )
        }
      />

      <button
        onClick={
          askCopilot
        }
      >
        Search
      </button>

      <pre>
        {
          JSON.stringify(
            result,
            null,
            2
          )
        }
      </pre>

    </div>
  );
}

export default Copilot;