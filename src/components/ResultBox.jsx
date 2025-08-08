import React from "react";

export default function ResultBox({ messages }) {
  return (
    <div
      style={{
        margin: "16px 0",
        background: "#f7f7f7",
        borderRadius: 8,
        padding: 16,
        minHeight: 120,
      }}
    >
      {messages.length === 0 && (
        <div>
          Qui compariranno le risposte!
          <ul style={{ marginTop: 16, color: "#888" }}>
            <li>Chiedi: <i>Quante possibilità di pioggia a Napoli domani?</i></li>
            <li>Chiedi: <i>Che probabilità ha la Juventus di vincere contro il Milan?</i></li>
            <li>Oppure usa i moduli per il calcolo classico.</li>
          </ul>
        </div>
      )}
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            margin: "12px 0",
            textAlign: msg.type === "user" ? "right" : "left",
            color: msg.type === "user" ? "#333" : "#0B6E4F",
            fontWeight: msg.type === "user" ? "bold" : "normal",
          }}
        >
          {msg.type === "user" ? <span>Tu: </span> : <span>Assistant: </span>}
          {typeof msg.text === "string" ? (
            msg.text
          ) : (
            msg.text /* jsx per risposte dettagliate */
          )}
        </div>
      ))}
    </div>
  );
}