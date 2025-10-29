import { Stethoscope, Shield, User } from "lucide-react";
import Card from "./Layout/Card";
import Button from "./Layout/Button";

export default function RoleSelector({ onSelect }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card>
        <div className="flex justify-center mb-6">
          <Stethoscope size={48} className="text-sky-600" />
        </div>
        <h1 className="text-2xl font-semibold text-sky-800 mb-3">
          Bienvenido a AIntegra Health
        </h1>
        <p className="text-gray-500 mb-8">
          Selecciona tu tipo de acceso para continuar:
        </p>
        <div className="grid gap-4">
          <Button onClick={() => onSelect("medico")}>
            <Shield size={18} /> Entrar como Médico
          </Button>
          <Button onClick={() => onSelect("paciente")} variant="success">
            <User size={18} /> Entrar como Paciente
          </Button>
        </div>
      </Card>
    </div>
  );
}
