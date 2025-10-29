import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { Loader2, FileText, Search, Trash2 } from "lucide-react";
export default function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filterId, setFilterId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: reportsData } = await supabase
      .from("reports")
      .select("id, pdf_url, created_at, user_id")
      .order("created_at", { ascending: false });

    setReports(reportsData || []);

    const { data: usersData } = await supabase
      .from("users")
      .select("id, name, email")
      .order("name", { ascending: true });

    setPatients(usersData || []);
    setLoading(false);
  }

  const getPatientName = (userId) => {
    const p = patients.find((u) => u.id === userId);
    return p ? (p.name || p.email) : "Paciente desconocido";
  };

  // ✅ ELIMINAR INFORME
  const deleteReport = async (id, pdfUrl) => {
    if (!window.confirm("¿Seguro que deseas eliminar este informe?")) return;

    setDeletingId(id);

    try {
      // Quitar dominio para obtener la ruta del archivo
      const filePath = pdfUrl.split("/storage/v1/object/public/reports/")[1];

      // ✅ 1. Eliminar del bucket
      await supabase.storage
        .from("reports")
        .remove([filePath]);

      // ✅ 2. Eliminar fila en la BD
      await supabase
        .from("reports")
        .delete()
        .eq("id", id);

      // ✅ 3. Actualizar UI sin refrescar
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert("⚠️ Error eliminando el informe");
    }

    setDeletingId(null);
  };

  let filtered = filterId ? reports.filter((r) => r.user_id === filterId) : reports;
  filtered = filtered.filter((r) =>
    getPatientName(r.user_id).toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-sky-100 p-8 overflow-y-auto">
      <h2 className="text-xl font-semibold text-sky-700 flex items-center gap-2 mb-4">
        <FileText size={20} className="text-sky-600" />
        Historial de Informes
      </h2>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Filtrar por paciente:</label>
          <select
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            className="w-full mt-1 p-2 rounded-xl border border-sky-200 bg-sky-50/40 focus:ring-2 focus:ring-sky-400 transition"
          >
            <option value="">Todos los pacientes</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || p.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Buscar paciente:</label>
          <div className="flex items-center mt-1 border border-sky-200 bg-sky-50/40 rounded-xl px-3">
            <Search size={18} className="text-sky-600" />
            <input
              type="text"
              className="w-full p-2 bg-transparent focus:outline-none"
              placeholder="Escribe un nombre..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* SIN DATOS */}
      {!loading && filtered.length === 0 && (
        <p className="text-gray-600 mt-4 text-center">No hay informes para mostrar.</p>
      )}

      {/* LISTADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="p-4 border border-sky-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:bg-sky-50/50 transition flex flex-col justify-between"
          >
            <div>
              <p className="font-semibold text-sky-700">{getPatientName(r.user_id)}</p>
              <p className="text-xs text-gray-500">
                Guardado el {new Date(r.created_at).toLocaleString("es-ES", { hour12: false })}
              </p>
            </div>

            <div className="mt-3 flex gap-2">
              <a
                href={r.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="bg-sky-600 hover:bg-sky-700 text-white w-full text-center px-3 py-2 rounded-xl text-sm shadow-md transition"
              >
                Ver PDF
              </a>

              <button
                onClick={() => deleteReport(r.id, r.pdf_url)}
                disabled={deletingId === r.id}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-sm shadow-md disabled:opacity-50"
              >
                {deletingId === r.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
