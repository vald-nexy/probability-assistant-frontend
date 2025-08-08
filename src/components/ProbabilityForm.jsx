import React, { useState } from "react";
import axios from "axios";

export default function ProbabilityForm({ onCompute }) {
  const [type, setType] = useState("simple");
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const resp = await axios.post(`/api/probability/${type}`, {
        ...inputs,
        favorable: Number(inputs.favorable),
        total: Number(inputs.total),
        pA: Number(inputs.pA),
        pB: Number(inputs.pB),
      });
      let msg = "";
      if (type === "simple") {
        msg = `Calcolo: ${inputs.favorable}/${inputs.total}`;
      } else if (type === "and") {
        msg = `Calcolo AND: ${inputs.pA} * ${inputs.pB}`;
      } else if (type === "or") {
        msg = `Calcolo OR: ${inputs.pA} + ${inputs.pB} - (${inputs.pA} * ${inputs.pB})`;
      } else if (type === "complement") {
        msg = `Calcolo complementare: 1 - ${inputs.pA}`;
      }
      onCompute(msg, resp.data);
    } catch (err) {
      setError("Dati non validi");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "24px 0" }}>
      <select value={type} onChange={e => setType(e.target.value)} style={{ padding: 8 }}>
        <option value="simple">Classica: casi favorevoli / totali</option>
        <option value="and">AND (P(A) ∩ P(B))</option>
        <option value="or">OR (P(A) ∪ P(B))</option>
        <option value="complement">Complementare (1 - P(A))</option>
      </select>
      {type === "simple" && (
        <>
          <input
            name="favorable"
            type="number"
            min="0"
            placeholder="Casi favorevoli"
            onChange={handleChange}
            style={{ margin: 8 }}
          />
          <input
            name="total"
            type="number"
            min="1"
            placeholder="Casi totali"
            onChange={handleChange}
            style={{ margin: 8 }}
          />
        </>
      )}
      {(type === "and" || type === "or") && (
        <>
          <input
            name="pA"
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="P(A)"
            onChange={handleChange}
            style={{ margin: 8 }}
          />
          <input
            name="pB"
            type="number"
            min="0"
            max="1"
            step="0.01"
            placeholder="P(B)"
            onChange={handleChange}
            style={{ margin: 8 }}
          />
        </>
      )}
      {type === "complement" && (
        <input
          name="pA"
          type="number"
          min="0"
          max="1"
          step="0.01"
          placeholder="P(A)"
          onChange={handleChange}
          style={{ margin: 8 }}
        />
      )}
      <button type="submit" style={{ padding: 8 }}>Calcola</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}