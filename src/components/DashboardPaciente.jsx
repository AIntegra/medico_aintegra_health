import Toolbar from "./Toolbar";
import ReportEditor from "./ReportEditor";
import ChatAssistant from "./ChatAssistant";

export default function DashboardPaciente({ name, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-white text-gray-800 font-[Inter]">
      <Toolbar title="AIntegra Health · Asistente Personal" onLogout={onLogout} color="emerald" />
      <main className="max-w-7xl mx-auto py-10 px-6 grid lg:grid-cols-3 gap-8">
        <ReportEditor role="paciente" name={name} />
        <ChatAssistant role="paciente" name={name} />
      </main>
    </div>
  );
}
