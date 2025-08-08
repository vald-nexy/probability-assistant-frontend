import React, { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/ni/parse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Errore nella risposta dal server: " + response.status);
      }

      const data = await response.json();
      setAnswer(data.answer || JSON.stringify(data));
    } catch (err) {
      setError("Errore: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "80px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Probability Assistant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Scrivi la tua domanda..."
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
          required
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 8 }}>
          {loading ? "Attendi..." : "Invia"}
        </button>
      </form>
      {answer && (
        <div style={{ marginTop: 24, background: "#f7f7f7", padding: 12, borderRadius: 6 }}>
          <strong>Risposta:</strong>
          <div>{answer}</div>
        </div>
      )}
      {error && (
        <div style={{ marginTop: 24, color: "red" }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
