import { Stethoscope } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-d-blue-700 grid place-items-center shadow-soft">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-d-blue-900 font-semibold leading-tight">Dedalus Clinical</h1>
            <p className="text-[11px] text-slate-500 -mt-0.5">Hospital Information Assistant</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="text-slate-600 hover:text-d-blue-700" href="#">Panel</a>
          <a className="text-slate-600 hover:text-d-blue-700" href="#">Informes</a>
          <a className="text-slate-600 hover:text-d-blue-700" href="#">Pacientes</a>
        </nav>
      </div>
    </header>
  );
}
