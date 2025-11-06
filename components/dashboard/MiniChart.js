"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function MiniChart({ data, color = "#3ECF8E" }) {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
