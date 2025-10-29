import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ClinicalChart({ data }) {
  if (!data || !data.valores || !data.valores.length) return null;

  return (
    <div className="mt-4 p-3 bg-sky-50 border border-sky-100 rounded-2xl shadow-inner">
      <h4 className="text-sm font-semibold text-sky-700 mb-2 flex items-center justify-between">
        <span>📊 Evolución clínica</span>
        <span className="text-xs text-gray-500 italic">
          {data.parametro || "Parámetro clínico"}
        </span>
      </h4>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.valores}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3f2fd" />
            <XAxis
              dataKey="día"
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
              label={{
                value: "Día",
                position: "insideBottom",
                offset: -4,
                fontSize: 12,
              }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 12 }}
              stroke="#94a3b8"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value}`, "Valor"]}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#0284c7"
              strokeWidth={2.2}
              dot={{ r: 4, fill: "#0369a1", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#0ea5e9" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
