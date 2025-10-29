import React, { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import {
  Send,
  User,
  Bot,
  Loader2,
  Clock,
  Trash2,
  Stethoscope,
  CalendarDays,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { KaiEventContext } from "../components/KaiEventContext.jsx";
import KaiEventCard from "../components/KaiEventCard.jsx";

export default function ChatKai() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("kai-memory");
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "assistant",
            type: "text",
            content:
              "👋 Hola, soy **Kai**, tu asistente clínico inteligente de **AIntegra Health**. Puedo ayudarte a analizar casos médicos, redactar informes o registrar eventos en el calendario clínico.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
  });

  // === ✅ Acceso al calendario real ===
  const { addEvent, deleteEvent, listUpcomingEvents } =
    useContext(KaiEventContext);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // === Auto-scroll ===
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === Guardar historial ===
  useEffect(() => {
    localStorage.setItem("kai-memory", JSON.stringify(messages));
  }, [messages]);

  const handleViewEvent = (event) => {
    alert(`📋 Evento del ${event.fecha}\n${event.nota}`);
  };

  const handleDeleteEventCard = (event) => {
    deleteEvent(event.fecha);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        type: "text",
        content: `🗑️ Evento del **${event.fecha}** eliminado.`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  // === ✅ PROCESAR MENSAJE ===
  const sendMessage = async () => {
    if (!input.trim()) return;

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage = {
      role: "user",
      type: "text",
      content: input,
      time: now,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const lower = input.toLowerCase();

    // Extraer fecha + temperatura
    const dateMatch = input.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    const tempMatch = input.match(/(\d{2}\.\d|\d{2})(?=\s?(°|grados|º))/i);
    const temperatura = tempMatch ? parseFloat(tempMatch[0]) : null;

    // ✅ AÑADIR EVENTO
    if (lower.includes("añadir evento") || lower.includes("agendar")) {
      if (!dateMatch) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: "⚠️ Usa el formato **DD/MM/YYYY** para la fecha.",
            time: now,
          },
        ]);
        setLoading(false);
        return;
      }

      const desc = input
        .replace(/añadir evento|agendar|para|el|en/gi, "")
        .trim();

      const [d, m, y] = dateMatch[0].split("/");
      const key = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;

      const newEvent = {
        fecha: dateMatch[0],
        nota: desc || "Evento clínico",
        temperatura: temperatura || null,
      };

      addEvent(key, newEvent);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "event-card",
          event: newEvent,
          time: now,
        },
      ]);

      setLoading(false);
      return;
    }

    // ✅ LISTAR EVENTOS
    if (lower.includes("ver eventos") || lower.includes("listar eventos")) {
      const upcoming = listUpcomingEvents();

      if (upcoming.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: "📭 No hay eventos registrados.",
            time: now,
          },
        ]);
      } else {
        const cards = upcoming.map((event) => ({
          role: "assistant",
          type: "event-card",
          event,
          time: now,
        }));
        setMessages((prev) => [...prev, ...cards]);
      }

      setLoading(false);
      return;
    }

    // ✅ ELIMINAR EVENTO
    if (lower.includes("eliminar evento")) {
      if (!dateMatch) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "text",
            content: "⚠️ Especifica fecha en formato **DD/MM/YYYY**.",
            time: now,
          },
        ]);
        setLoading(false);
        return;
      }

      const [d, m, y] = dateMatch[0].split("/");
      const key = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;

      deleteEvent(key);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: `🗑️ Evento del **${dateMatch[0]}** eliminado.`,
          time: now,
        },
      ]);

      setLoading(false);
      return;
    }

    // ✅ Procesar con FastAPI
    try {
      const validMessages = updatedMessages
        .filter((m) => m.type === "text")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("http://127.0.0.1:8000/v1/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: "kai-session-001",
          messages: validMessages,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content: data.prompt || "⚠️ Sin respuesta válida del backend.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "text",
          content:
            "⚠️ Error al contactar con el servidor FastAPI. Revisa conexión.",
          time: now,
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (!window.confirm("¿Seguro que deseas reiniciar la conversación?")) return;

    const reset = [
      {
        role: "assistant",
        type: "text",
        content: "👋 Conversación reiniciada. ¿En qué puedo ayudarte?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
    setMessages(reset);
    localStorage.setItem("kai-memory", JSON.stringify(reset));
  };

  // === ✅ UI COMPLETA ===
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-[calc(100vh-5rem)] w-full max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-sky-100 rounded-3xl shadow-2xl overflow-hidden"
    >
      {/* HEADER */}
      <div className="px-4 md:px-6 py-3 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-emerald-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-full">
            <Stethoscope size={20} className="text-sky-600" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-sky-700">
              Kai — Asistente Clínico
            </h2>
            <p className="text-xs text-gray-500 hidden sm:block">
              Plataforma hospitalaria de <strong>AIntegra Health</strong>
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-red-500 hover:text-red-600"
          title="Limpiar chat"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-2 sm:gap-3 max-w-[90%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot size={22} className="text-sky-600 mt-1 flex-shrink-0" />
                ) : (
                  <User size={22} className="text-gray-500 mt-1 flex-shrink-0" />
                )}

                <div
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-md break-words ${
                    msg.role === "user"
                      ? "bg-sky-600 text-white"
                      : "bg-white border border-sky-100 text-gray-800"
                  }`}
                >
                  {msg.type === "event-card" ? (
                    <KaiEventCard
                      event={msg.event}
                      onDelete={handleDeleteEventCard}
                      onView={handleViewEvent}
                    />
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {msg.content}
                    </ReactMarkdown>
                  )}

                  <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={10} /> {msg.time}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <p className="text-sm text-gray-400 text-center">Kai está pensando…</p>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 md:p-4 border-t border-sky-100 bg-white">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ejemplo: añadir evento 29/10/2025 dolor de cabeza..."
            className="flex-1 resize-none rounded-xl border border-sky-200 p-3 text-sm focus:ring-2 focus:ring-sky-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-700 text-white px-5 md:px-6 rounded-xl flex items-center justify-center shadow-sm"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-[10px] md:text-[11px] text-gray-400 text-center py-2 border-t border-sky-50 bg-gradient-to-r from-white via-sky-50 to-white">
        <CalendarDays size={12} className="inline mr-1 text-sky-500" />
        Integrado con el calendario clínico de <strong>AIntegra Health</strong>.
      </div>
    </motion.div>
  );
}
