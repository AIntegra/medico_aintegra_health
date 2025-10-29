import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Loader2,
  CheckCircle2,
  Download,
  AlertTriangle,
  CloudUpload,
} from "lucide-react";
import jsPDF from "jspdf";
import { supabase } from "../services/supabaseClient";
import logo from "../assets/aintegra_health.png";
export default function ReportEditor() {
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    sexo: "",
    historia: "",
    notas: "",
  });

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveMsg, setSaveMsg] = useState("");

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, name, email")
        .order("name", { ascending: true });

      if (data) setPatients(data);
    };
    loadPatients();
  }, []);

  useEffect(() => {
    const savedReport = localStorage.getItem("report-data");
    const savedForm = localStorage.getItem("report-form");
    const savedPatient = localStorage.getItem("report-patient-id");

    if (savedReport) setReport(JSON.parse(savedReport));
    if (savedForm) setForm(JSON.parse(savedForm));
    if (savedPatient) setSelectedPatientId(savedPatient);
  }, []);

  useEffect(() => {
    if (report) localStorage.setItem("report-data", JSON.stringify(report));
    localStorage.setItem("report-form", JSON.stringify(form));
    if (selectedPatientId)
      localStorage.setItem("report-patient-id", selectedPatientId);
  }, [report, form, selectedPatientId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const generateReport = () => {
    if (!form.notas.trim()) {
      setError("Por favor introduce el texto clínico o las notas del paciente.");
      return;
    }

    setError(null);
    setLoading(true);

    const resumen = form.notas.trim();
    const paciente = form.nombre || "Paciente sin identificar";

    const reportData = {
      encabezado: "AIntegra Health — Informe Clínico",
      paciente,
      edad: form.edad,
      sexo: form.sexo,
      historia: form.historia,
      resumen,
      diagnostico:
        "Cuadro compatible con un proceso infeccioso leve del tracto respiratorio superior.",
      evolucion: "Evolución favorable sin signos de alarma.",
      tratamiento:
        "Tratamiento sintomático con paracetamol o ibuprofeno. Hidratación y reposo.",
      recomendaciones: [
        "Reevaluación en 48–72 horas.",
        "Evitar automedicación antibiótica.",
        "Acudir a urgencias ante dificultad respiratoria.",
      ],
      fecha: new Date().toLocaleString("es-ES"),
    };

    setTimeout(() => {
      setReport(reportData);
      setLoading(false);
    }, 500);
  };

  // ✅ PDF profesional
const getPdfBlob = () => {
  if (!report) return null;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  /** ✅ LOGO MÁS GRANDE Y BIEN POSICIONADO */
  try {
    const img = new Image();
    img.src = logo;

    const imgWidth = 50;
    const imgHeight = 50;
    const imgX = pageWidth - imgWidth - 15;
    const imgY = 10;

    doc.addImage(img, "PNG", imgX, imgY, imgWidth, imgHeight);
  } catch {}

  /** ✅ TÍTULO */
  let y = 42;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INFORME CLÍNICO", margin, y);
  y += 20;

  /** ✅ LÍNEA SEPARADORA */
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  /** ✅ FECHA */
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha de emisión: ${report.fecha}`, margin, y);
  y += 12;

  /** ✅ DATOS DEL PACIENTE */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("DATOS DEL PACIENTE", margin, y);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  const datosPaciente = [
    `Nombre: ${report.paciente}`,
    `Edad: ${report.edad || "—"}`,
    `Sexo: ${report.sexo || "—"}`,
    `Historia clínica: ${report.historia || "—"}`,
  ];

  datosPaciente.forEach(line => {
    doc.text(line, margin, y);
    y += 8;
  });

  y += 8;
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  /** ✅ SECCIONES */
  const writeSection = (title, content) => {
    if (!content) return;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${title}:`, margin, y);
    y += 9;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(content, pageWidth - margin * 2);
    lines.forEach(line => {
      if (y > 260) {
        doc.addPage();
        y = 25;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    y += 10;
  };

  writeSection("Resumen clínico", report.resumen);

  /** ✅ FIRMA DEL MÉDICO */
  y += 20; // separación visual grande
  doc.setFont("helvetica", "bold");
  doc.text("Firma del médico:", margin, y);
  y += 15;

  // Línea para firmar
  doc.line(margin, y, margin + 80, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Dr./Dra. ____________________________", margin, y);
  y += 6;
  doc.text("Colegiado Nº: ______________________", margin, y);

  /** ✅ FOOTER PRO */
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "Documento generado automáticamente con AIntegra Health — Plataformas médicas inteligentes",
    pageWidth / 2,
    287,
    { align: "center" }
  );

  /** ✅ Nombre del archivo limpio */
  const cleanName = report.paciente
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_]/g, "_");

  const filename = `informe_${cleanName}_${Date.now()}.pdf`;
  const blob = doc.output("blob");

  return { blob, filename };
};





  const exportPDF = () => {
    const r = getPdfBlob();
    if (!r) return;
    const { blob, filename } = r;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const saveToSupabase = async () => {
  if (!report) return;
  if (!selectedPatientId) {
    setError("Selecciona un paciente antes de guardar.");
    return;
  }

  setSaving(true);
  setError(null);
  setSaveMsg("");

  try {
    const r = getPdfBlob();
    const { blob, filename } = r;

    // ✅ Subir el PDF al bucket "reports"
    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(`pdfs/${filename}`, blob, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // ✅ Obtener URL pública
    const { data: publicData } = supabase.storage
      .from("reports")
      .getPublicUrl(`pdfs/${filename}`);

    // ✅ Guardar referencia en base de datos usando el método que sabemos que funciona
    const { error: dbError } = await supabase.from("reports").insert({
      pdf_url: publicData.publicUrl,
      user_id: selectedPatientId,
    });

    if (dbError) throw dbError;

    setSaveMsg("✅ Informe guardado correctamente para el paciente.");
  } catch (e) {
    setError("Error al guardar en Supabase.");
  } finally {
    setSaving(false);
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col overflow-y-auto px-3 py-4 md:px-6"
    >
      <div className="bg-white/90 shadow-xl border border-sky-100 rounded-3xl p-4 md:p-8 flex flex-col gap-6 h-full">

        <div className="flex items-center gap-2 border-b border-sky-100 pb-2">
          <FileText className="text-sky-600" size={22} />
          <h2 className="text-lg md:text-xl font-semibold text-sky-700">
            Generador de Informe Clínico — AIntegra Health
          </h2>
        </div>

        <div className="flex flex-col">
          <label className="font-medium text-gray-700 text-sm md:text-base">
            Guardar informe para el paciente:
          </label>

          <select
            value={selectedPatientId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedPatientId(id);

              const selected = patients.find((p) => p.id === id);
              if (selected) {
                setForm((prev) => ({
                  ...prev,
                  nombre: selected.name || "",
                }));
              }
            }}
            className="w-full mt-1 p-2 text-sm md:text-base border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400"
          >
            <option value="">-- Seleccionar paciente registrado --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || p.email}
              </option>
            ))}
          </select>
        </div>

        {/* FORMULARIO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
          <div>
            <label className="font-medium text-gray-700">Nombre del paciente</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Edad</label>
            <input
              type="number"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Sexo</label>
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400"
            >
              <option value="">Seleccionar</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700">Historia clínica</label>
            <input
              type="text"
              name="historia"
              value={form.historia}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        {/* NOTAS */}
        <div>
          <label className="font-medium text-gray-700">Texto clínico</label>
          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
            placeholder="Ejemplo: Paciente masculino de 65 años con fiebre..."
            className="w-full mt-2 h-40 p-3 border border-sky-200 rounded-xl bg-sky-50/50 focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* ACCIONES */}
        <div className="flex flex-col md:flex-row gap-3 justify-end">
          <button
            onClick={generateReport}
            disabled={loading}
            className={`px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-white w-full md:w-auto ${
              loading ? "bg-sky-400" : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            {loading ? "Generando..." : "Generar informe"}
          </button>

          <button
            onClick={exportPDF}
            disabled={!report}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 w-full md:w-auto"
          >
            <Download size={16} /> Descargar PDF
          </button>

          <button
            onClick={saveToSupabase}
            disabled={!report || saving}
            className="bg-sky-700 hover:bg-sky-800 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 w-full md:w-auto"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CloudUpload size={16} />}
            {saving ? "Guardando..." : "Guardar en Supabase"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {saveMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl">
            {saveMsg}
          </div>
        )}

        {report && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-sky-100 rounded-2xl p-6 shadow-md space-y-3 text-sm md:text-base"
          >
            <div className="flex items-center gap-2 text-sky-700 font-semibold text-lg">
              <CheckCircle2 size={18} /> Informe clínico generado correctamente
            </div>

            <p><strong>🧾 Resumen clínico:</strong> {report.resumen}</p>
            <p><strong>🩺 Diagnóstico:</strong> {report.diagnostico}</p>
            <p><strong>📈 Evolución:</strong> {report.evolucion}</p>
            <p><strong>💊 Tratamiento:</strong> {report.tratamiento}</p>

            <div>
              <strong>🧭 Recomendaciones:</strong>
              <ul className="list-disc list-inside ml-2 text-gray-700">
                {report.recomendaciones.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
