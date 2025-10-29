//const API_URL = "http://127.0.0.1:8000/v1";
const API_URL = "https://cushionless-cruz-supermental.ngrok-free.dev";

export async function generateSummary(notes, mode = "discharge", language = "es") {
  const res = await fetch(`${API_URL}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      notes,
      mode,
      language,
      redact_phi: true,
    }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function exportPDF(title, content_markdown, patient_name) {
  const res = await fetch(`${API_URL}/export/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content_markdown, patient_name }),
  });
  const data = await res.json();
  const link = document.createElement("a");
  link.href = `data:application/pdf;base64,${data.bytes_b64}`;
  link.download = data.filename;
  link.click();
}
