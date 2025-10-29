import React from "react";
import { CalendarDays, Trash2, Eye, Thermometer } from "lucide-react";

export default function KaiEventCard({ event, onDelete, onView }) {
  return (
    <div className="border border-sky-100 bg-sky-50/60 backdrop-blur-sm rounded-2xl p-3 shadow-sm mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sky-700 font-medium">
          <CalendarDays size={14} /> {event.fecha}
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full ${
            event.estado === "Mejorando"
              ? "bg-emerald-100 text-emerald-700"
              : event.estado === "Pendiente"
              ? "bg-amber-100 text-amber-700"
              : "bg-sky-100 text-sky-700"
          }`}
        >
          {event.estado || "Pendiente"}
        </span>
      </div>

      <p className="text-[13px] text-gray-700 mb-2 leading-snug">
        {event.nota || "Sin descripción"}
      </p>

      {event.temperatura && (
        <div className="flex items-center gap-1 text-[12px] text-sky-700 font-medium mb-2">
          <Thermometer size={14} /> {event.temperatura} °C
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onView(event)}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition"
        >
          <Eye size={12} /> Ver
        </button>
        <button
          onClick={() => onDelete(event)}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          <Trash2 size={12} /> Eliminar
        </button>
      </div>
    </div>
  );
}
