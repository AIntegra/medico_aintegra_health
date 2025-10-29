import { useState } from "react";
import Card, { CardBody } from "./Layout/Card";
import Button from "./Layout/Button";
import { MessageSquare } from "lucide-react";

export default function ChatAssistant({ mode = "medico" }) {
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");

  const send = () => {
    if (!msg.trim()) return;
    const reply =
      mode === "medico"
        ? `He aplicado tu indicación: "${msg}".`
        : `En sencillo: ${msg}. Si tienes dudas, consulta a tu médico.`;
    setChat((c) => [...c, { who: "user", text: msg }, { who: "ai", text: reply }]);
    setMsg("");
  };

  return (
    <Card>
      <CardBody>
        <h3 className="ai-title text-xl mb-3 flex items-center gap-2">
          <MessageSquare size={18} className="text-sky-600" />
          {mode === "medico" ? "AIntegra Assistant" : "Tu Asistente"}
        </h3>

        <div className="border border-sky-100 rounded-lg p-3 h-64 overflow-y-auto text-sm mb-3 bg-sky-50/40">
          {chat.length === 0 ? (
            <p className="text-gray-400 text-center mt-16">
              {mode === "medico"
                ? "Aquí aparecerán las sugerencias clínicas…"
                : "Pregunta algo sobre tu informe…"}
            </p>
          ) : (
            chat.map((m, i) => (
              <div key={i} className={`mb-2 ${m.who === "ai" ? "text-sky-600" : "text-gray-700"}`}>
                {m.text}
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="ai-input ai-input-sky flex-1"
            placeholder={mode === "medico" ? "Pide un ajuste o resumen…" : "Escribe tu pregunta…"}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <Button onClick={send} className="px-4">
            Enviar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
