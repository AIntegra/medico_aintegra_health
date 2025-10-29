import { LogOut, Stethoscope, HeartPulse } from "lucide-react";

export default function Toolbar({ title, onLogout, type = "medico" }) {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-sky-100">
      <div className="ai-container py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {type === "medico" ? (
            <Stethoscope className="text-sky-600" size={26} />
          ) : (
            <HeartPulse className="text-emerald-600" size={26} />
          )}
          <h1 className="ai-title">{title}</h1>
        </div>
        <button onClick={onLogout} className="ai-btn ai-btn-primary">
          <LogOut size={16} /> Salir
        </button>
      </div>
    </header>
  );
}
