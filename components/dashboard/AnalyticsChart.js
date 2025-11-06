"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AnalyticsChart({ assetId, assetType, analytics, loading }) {
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Prepare data for different metrics
  const prepareChartData = () => {
    if (!analytics?.dailyScans) return [];

    // Use the actual visits and scans data from the API
    return analytics.dailyScans.map(item => ({
      date: item.date,
      visits: item.visits || 0, // Actual URL visits from asset_analytics where event_type = 'visit'
      scans: item.qr_scans || 0, // QR code scans from asset_analytics where event_type = 'scan'
    }));
  };

  const chartData = prepareChartData();

  const metricOptions = [
    { value: "all", label: "All Activity" },
    { value: "visits", label: "URL Visits" },
  ];

  // Only add QR scans option if this is a QR code asset
  if (assetType === 'qr') {
    metricOptions.push({ value: "scans", label: "QR Code Scans" });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-4 rounded-xl border-2 border-primary shadow-lg">
          <p className="font-semibold text-sm text-base-content mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-lg rounded-xl border-2 border-base-300">
        <div className="card-body p-6">
          <div className="skeleton h-8 w-64 mb-4"></div>
          <div className="skeleton h-80 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-base-300">
      <div className="card-body p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h2 className="card-title text-2xl font-bold">Analytics Overview</h2>
            <p className="text-sm text-base-content/60 mt-1">Last 30 days activity</p>
          </div>

          {/* Metric Selector */}
          <div className="flex gap-2">
            {metricOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedMetric(option.value)}
                className={`btn btn-sm rounded-lg transition-all ${
                  selectedMetric === option.value
                    ? 'btn-primary'
                    : 'btn-outline btn-ghost'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />

              {(selectedMetric === "all" || selectedMetric === "visits") && (
                <Line
                  type="monotone"
                  dataKey="visits"
                  name="URL Visits"
                  stroke="#3ECF8E"
                  strokeWidth={3}
                  dot={{ fill: '#3ECF8E', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={500}
                />
              )}

              {assetType === 'qr' && (selectedMetric === "all" || selectedMetric === "scans") && (
                <Line
                  type="monotone"
                  dataKey="scans"
                  name="QR Code Scans"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={500}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t-2 border-base-300">
          <div className="text-center">
            <p className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">Total Visits</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {chartData.reduce((sum, item) => sum + item.visits, 0)}
            </p>
          </div>
          {assetType === 'qr' && (
            <div className="text-center">
              <p className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">Total Scans</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {chartData.reduce((sum, item) => sum + item.scans, 0)}
              </p>
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">Avg per Day</p>
            <p className="text-2xl font-bold text-base-content mt-1">
              {Math.round(chartData.reduce((sum, item) => sum + item.visits + item.scans, 0) / chartData.length) || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">Peak Day</p>
            <p className="text-2xl font-bold text-base-content mt-1">
              {Math.max(...chartData.map(item => item.visits + item.scans)) || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
