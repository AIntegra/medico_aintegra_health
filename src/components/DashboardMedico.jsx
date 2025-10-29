import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  MessageSquareHeart,
  Activity,
  FileText,
  Menu,
  X,
  HeartPulse,
} from "lucide-react";

import ChatKai from "./ChatKai";
import ReportEditor from "./ReportEditor";
import ReportHistory from "./ReportHistory";
import Evolution from "./Evolution";

export default function DashboardMedico() {
  const [activeTab, setActiveTab] = useState("chat");
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: "chat", label: "Asistente Clínico", icon: <MessageSquareHeart size={18} /> },
    { id: "report", label: "Generador de Informe", icon: <ClipboardList size={18} /> },
    { id: "history", label: "Historial de Informes", icon: <FileText size={18} /> },
    { id: "evolution", label: "Evolución", icon: <Activity size={18} /> },
  ];

  const renderSidebar = (isMobile = false) => (
    <motion.aside
      initial={{ x: isMobile ? -300 : 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-6 flex flex-col justify-between
      ${isMobile ? "w-64 h-full" : "md:w-72 w-full"} border border-sky-100`}
    >
      <div>
        <div className="flex items-center gap-2 mb-5">
          <HeartPulse className="text-sky-600" size={20} />
          <h2 className="text-xl font-bold text-sky-700 leading-tight">
            Panel Clínica
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-6 leading-snug">
          IA hospitalaria de <strong>AIntegra Health</strong>
        </p>

        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition font-medium ${
                activeTab === tab.id
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <footer className="mt-8 text-xs text-gray-400 leading-tight">
        © 2025 AIntegra Health.  
        <br />
        Desarrollado por AIntegra Limited.
      </footer>
    </motion.aside>
  );

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden">
      {/* === Botón Hamburguesa (solo móvil) === */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md border border-sky-100 shadow-md p-2 rounded-xl"
      >
        <Menu className="text-sky-600" size={22} />
      </button>

      {/* === Sidebar visible solo en escritorio === */}
      <div className="hidden md:flex">{renderSidebar(false)}</div>

      {/* === Sidebar deslizable en móvil === */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderSidebar(true)}

            {/* Fondo clicable para cerrar */}
            <div
              className="flex-1"
              onClick={() => setMenuOpen(false)}
            ></div>

            {/* Botón cerrar */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-white bg-black/30 p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Contenido principal === */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex items-center justify-center"
      >
        {activeTab === "chat" && <ChatKai />}
        {activeTab === "report" && <ReportEditor />}
        {activeTab === "history" && <ReportHistory />}
        {activeTab === "evolution" && <Evolution />}
      </motion.main>
    </div>
  );
}
