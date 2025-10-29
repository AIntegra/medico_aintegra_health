import Toolbar from "./Toolbar";
import ReportEditor from "./ReportEditor";
import ChatAssistant from "./ChatAssistant";

export default function MedicoDashboard({ onLogout }) {
  return (
    <div className="min-h-screen">
      <Toolbar title="AIntegra Health · Asistente Clínico IA" onLogout={onLogout} type="medico" />
      <main className="ai-container py-10 grid lg:grid-cols-3 gap-8">
        <ReportEditor mode="medico" />
        <ChatAssistant mode="medico" />
      </main>
    </div>
  );
}
