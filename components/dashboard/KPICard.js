"use client";

export default function KPICard({ title, value, change, icon, loading = false }) {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-base-300 hover:border-primary/30">
      <div className="card-body p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-base-content/70 font-semibold uppercase tracking-wide">{title}</p>
            {loading ? (
              <div className="skeleton h-10 w-28 mt-3 rounded-lg"></div>
            ) : (
              <p className="text-4xl font-extrabold mt-2 text-base-content bg-gradient-to-br from-base-content to-base-content/80 bg-clip-text">{value}</p>
            )}
            {change && !loading && (
              <p className={`text-xs mt-3 font-semibold ${change > 0 ? 'text-success' : 'text-error'}`}>
                {change > 0 ? '↗ +' : '↘ '}{change}% from last week
              </p>
            )}
          </div>
          {icon && (
            <div className="text-4xl opacity-50 text-primary">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
