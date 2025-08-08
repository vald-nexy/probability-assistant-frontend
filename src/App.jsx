import React, { useState } from "react";
import ChatInput from "./components/ChatInput";
import ProbabilityForm from "./components/ProbabilityForm";
import ResultBox from "./components/ResultBox";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState(null);

  // Gestisce invio frase dalla chat
  const handleChat = async (message) => {
    setMessages((prev) => [...prev, { type: "user", text: message }]);
    // 1. Chiamata backend per NLP
    const parseResp = await fetch("/api/nlp/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message }),
    }).then((r) => r.json());

    if (parseResp.intent === "weather" && parseResp.city) {
      // 2. Chiamata backend per dati meteo
      const weatherResp = await fetch(
        `/api/data/weather?city=${encodeURIComponent(parseResp.city)}&date=${parseResp.date}`
      ).then((r) => r.json());
      if (weatherResp.probability != null) {
        const msg = (
          <div>
            <b>
              Probabilità di pioggia a {weatherResp.city} il {weatherResp.date}: {weatherResp.probability}%.
            </b>
            <br />
            <pre style={{ background: "#e6f7ff", padding: "8px", borderRadius: "4px" }}>
              {weatherResp.analysis}
            </pre>
            <span style={{ fontSize: "0.9em", color: "#666" }}>
              Fonte: {weatherResp.provider}
            </span>
          </div>
        );
        setMessages((prev) => [...prev, { type: "assistant", text: msg }]);
        setResult(msg);
        return;
      }
    }

    if (parseResp.intent === "sports" && parseResp.teams?.length === 2) {
      // 2. Chiamata backend per dati sportivi
      const sportsResp = await fetch(
        `/api/data/sports?home=${encodeURIComponent(parseResp.teams[0])}&away=${encodeURIComponent(parseResp.teams[1])}${parseResp.date ? "&date=" + parseResp.date : ""}`
      ).then((r) => r.json());
      if (sportsResp.probability) {
        const prob = sportsResp.probability;
        const msg = (
          <div>
            <b>
              {parseResp.teams[0]} - {parseResp.teams[1]}
              <br />
              Probabilità: {parseResp.teams[0]} {prob.homeWin}% | Pareggio {prob.draw}% | {parseResp.teams[1]} {prob.awayWin}%
            </b>
            <br />
            <pre style={{ background: "#fffbe6", padding: "8px", borderRadius: "4px" }}>
              {sportsResp.analysis}
            </pre>
            <span style={{ fontSize: "0.9em", color: "#666" }}>
              Fonte: TheSportsDB + Open-Meteo
            </span>
          </div>
        );
        setMessages((prev) => [...prev, { type: "assistant", text: msg }]);
        setResult(msg);
        return;
      }
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        text:
          "Non ho trovato la risposta, prova a riformulare la domanda! (Puoi chiedere: 'Quante possibilità di pioggia domani a Roma?' oppure 'Che probabilità ha il Milan di vincere contro l'Inter?')",
      },
    ]);
    setResult(null);
  };

  // Gestisce invio modulo classico
  const handleClassic = (msg, computed) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: msg },
      { type: "assistant", text: computed.detail },
    ]);
    setResult(computed.detail);
  };

  return (
    <div style={{ maxWidth: 680, margin: "auto", padding: 24 }}>
      <h1>Probability Assistant</h1>
      <p>
        Chiedi probabilità reali o classiche! <br />
        <i style={{ color: "#0b6e4f" }}>
          Es: "Quante possibilità di pioggia a Napoli domani?"<br />
          Es: "Che probabilità ha la Juventus di vincere contro il Milan?"
        </i>
      </p>
      <ChatInput onSend={handleChat} />
      <ProbabilityForm onCompute={handleClassic} />
      <ResultBox messages={messages} />
    </div>
  );
}