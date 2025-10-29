import Toolbar from "./Toolbar";
import ReportEditor from "./ReportEditor";
import ChatAssistant from "./ChatAssistant";

export default function PacienteView({ name = "", onLogout }) {
  return (
    <div className="min-h-screen">
      <Toolbar title="AIntegra Health · Asistente Personal" onLogout={onLogout} type="paciente" />
      <main className="ai-container py-10 grid lg:grid-cols-3 gap-8">
        <ReportEditor mode="paciente" />
        <ChatAssistant mode="paciente" />
      </main>
    </div>
  );
}
