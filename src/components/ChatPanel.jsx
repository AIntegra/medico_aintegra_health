import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hola doctor 👋, ¿desea generar un resumen o analizar signos clínicos?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { from: "user", text: input };
    setMessages([...messages, newMsg, { from: "ai", text: "Recibido. Procesando informe..." }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-xl text-sm ${
              msg.from === "ai"
                ? "bg-sky-50 text-sky-800 self-start"
                : "bg-emerald-50 text-emerald-700 self-end"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe algo..."
          className="flex-1 border border-sky-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-400/40"
        />
        <button
          onClick={sendMessage}
          className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl p-2 transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
