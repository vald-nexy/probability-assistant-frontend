import React, { useState } from "react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSend(value);
        setValue("");
      }}
      style={{ margin: "16px 0" }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Scrivi la tua domanda (meteo o calcio)..."
        style={{ width: "80%", padding: 8, fontSize: 16 }}
      />
      <button type="submit" style={{ padding: 8, marginLeft: 8 }}>
        Invia
      </button>
    </form>
  );
}