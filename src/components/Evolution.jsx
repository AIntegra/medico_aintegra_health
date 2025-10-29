import React, { useState, useEffect, useMemo, useContext } from "react";
import { KaiEventContext } from "../components/KaiEventContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, CalendarDays, HeartPulse, Trash2, X } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "../services/supabaseClient";

const DEMO_USER_ID = "47e19690-c2cb-4204-9c9a-1dc8016499e3";

export default function Evolution() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [openDay, setOpenDay] = useState(null);
  const { events: dayData, setEvents: setDayData } = useContext(KaiEventContext);

  const [form, setForm] = useState({
    mood: "buena",
    comment: "",
  });

  // ✅ Cargar datos
  useEffect(() => {
    const loadLogs = async () => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("user_id", DEMO_USER_ID);

      if (!error && data) {
        const byDate = {};
        data.forEach((l) => {
          const key = l.date;
          byDate[key] = {
            mood: l.mood,
            comment: l.comment,
          };
        });
        setDayData(byDate);
      }
    };

    loadLogs();
  }, []);

  // ✅ Guardar día
  const saveDay = async () => {
    if (!openDay) return;

    const key = format(openDay, "yyyy-MM-dd");
    const payload = {
      user_id: DEMO_USER_ID,
      date: key,
      mood: form.mood,
      comment: form.comment,
    };

    await supabase.from("daily_logs").delete().eq("user_id", DEMO_USER_ID).eq("date", key);
    await supabase.from("daily_logs").insert(payload);

    setDayData((prev) => ({ ...prev, [key]: payload }));
    setOpenDay(null);
  };

  // ✅ Eliminar
  const removeDay = async () => {
    if (!openDay) return;
    const key = format(openDay, "yyyy-MM-dd");

    await supabase.from("daily_logs").delete().eq("user_id", DEMO_USER_ID).eq("date", key);

    const updated = { ...dayData };
    delete updated[key];
    setDayData(updated);
    setOpenDay(null);
  };

  // ✅ Días del calendario
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    const result = [];
    let day = start;
    while (day <= end) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [currentMonth]);

  // ✅ Histograma últimos 7 días
  const last7 = useMemo(() => {
    const now = new Date();
    const counts = { buena: 0, regular: 0, mala: 0 };

    for (let i = 0; i < 7; i++) {
      const d = addDays(now, -i);
      const key = format(d, "yyyy-MM-dd");
      const estado = dayData[key]?.mood;
      if (estado && counts[estado] !== undefined) counts[estado]++;
    }
    return counts;
  }, [dayData]);

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] w-full px-4 md:px-6 py-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col h-full w-full bg-white/95 backdrop-blur-md border border-sky-100 rounded-3xl shadow-2xl overflow-y-auto p-6 md:p-8"
      >
        {/* ==== HEADER ==== */}
        <div className="flex items-center gap-2 border-b border-sky-100 pb-2 mb-4">
          <Activity className="text-sky-600" size={22} />
          <h2 className="text-lg md:text-xl font-semibold text-sky-700">
            Evolución clínica — AIntegra Health
          </h2>
        </div>

        {/* ==== CALENDARIO ==== */}
        <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
            <h3 className="text-sky-700 font-semibold flex items-center gap-2 text-md">
              <CalendarDays size={18} /> Calendario clínico
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="px-3 py-1 rounded-xl border text-sky-600 bg-sky-50 hover:bg-sky-100 transition"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="px-3 py-1 rounded-xl border text-sky-600 bg-sky-50 hover:bg-sky-100 transition"
              >
                →
              </button>
            </div>
          </div>

          {/* Histograma */}
          <div className="flex flex-wrap gap-3 text-sm mb-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
              Buena: {last7.buena}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
              Regular: {last7.regular}
            </span>
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
              Mala: {last7.mala}
            </span>
          </div>

          {/* Etiquetas semana */}
          <div className="grid grid-cols-7 text-[11px] text-gray-500 font-medium">
            {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
              <div key={d} className="text-center py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Días */}
          <div className="grid grid-cols-7 gap-1 mt-1">
            {days.map((day, index) => {
              const key = format(day, "yyyy-MM-dd");
              const ev = dayData[key];
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);

              return (
                <button
                  key={index}
                  onClick={() => {
                    setOpenDay(day);
                    setForm({
                      mood: ev?.mood || "buena",
                      comment: ev?.comment || "",
                    });
                  }}
                  className={`h-20 md:h-24 rounded-xl p-2 text-left border text-[11px] transition shadow-sm hover:shadow-md ${
                    inMonth
                      ? "bg-white border-sky-100"
                      : "bg-gray-50 border-gray-100 opacity-60"
                  } ${today ? "ring-2 ring-emerald-400" : ""}`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs ${
                        today ? "text-emerald-600 font-semibold" : "text-gray-600"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        ev?.mood === "buena"
                          ? "bg-emerald-500"
                          : ev?.mood === "regular"
                          ? "bg-amber-500"
                          : ev?.mood === "mala"
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>

                  <div className="mt-1 text-[10px] line-clamp-3 text-gray-600">
                    {ev?.comment || "—"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-400 text-xs">
          <HeartPulse className="inline-block text-sky-400 mr-1" size={14} /> Seguimiento clínico sincronizado con historial real — AIntegra Health
        </p>

        {/* ==== MODAL ==== */}
        <AnimatePresence>
          {openDay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-sky-100"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sky-700 font-semibold text-sm md:text-base">
                    {format(openDay, "EEEE d 'de' MMMM yyyy", { locale: es })}
                  </h4>
                  <button
                    onClick={() => setOpenDay(null)}
                    className="text-gray-500 hover:text-gray-700 transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Estado */}
                <label className="text-sm font-medium text-gray-700">Estado clínico:</label>
                <select
                  value={form.mood}
                  onChange={(e) => setForm({ ...form, mood: e.target.value })}
                  className="w-full mt-1 p-2 border border-sky-200 rounded-xl bg-sky-50 focus:ring-2 focus:ring-sky-400"
                >
                  <option value="buena">Buena</option>
                  <option value="regular">Regular</option>
                  <option value="mala">Mala</option>
                </select>

                {/* Nota */}
                <label className="text-sm font-medium text-gray-700 mt-3">
                  Nota clínica:
                </label>
                <textarea
                  rows={3}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Descripción breve..."
                  className="w-full mt-1 p-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 bg-sky-50"
                />

                {/* Botones */}
                <div className="mt-5 flex justify-between items-center">
                  <button
                    onClick={removeDay}
                    className="px-4 py-2 rounded-xl flex items-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpenDay(null)}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={saveDay}
                      className="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
