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

export default function GraficaEvolucion({ graficas }) {
  if (!graficas || !graficas.valores || graficas.valores.length === 0)
    return null;

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <h4 className="text-sky-800 font-semibold mb-3">
        {graficas.parametro || "Evolución del paciente"}
      </h4>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={graficas.valores}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="día" tick={{ fontSize: 12 }} />
            <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #bae6fd",
                borderRadius: "10px",
              }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
