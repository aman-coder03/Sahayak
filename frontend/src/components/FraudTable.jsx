function FraudTable({ cases }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        color: "white",
      }}
    >
      <h2>Recent Fraud Cases</h2>

      <table width="100%">
        <thead>
          <tr>
            <th>DNA ID</th>
            <th>Risk</th>
            <th>Fraud Type</th>
          </tr>
        </thead>

        <tbody>
          {cases.map((item, index) => (
            <tr key={index}>
              <td>{item.dna_id}</td>
              <td>{item.risk}</td>
              <td>{item.fraud_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FraudTable;