"use client";

export default function KPICard({ title, value, change, icon, loading = false }) {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-2 border-primary/20 hover:border-primary/40">
      <div className="card-body p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-base-content/70 font-semibold uppercase tracking-wide">{title}</p>
            {loading ? (
              <div className="skeleton h-10 w-32 mt-2 rounded-lg"></div>
            ) : (
              <p className="text-4xl font-extrabold mt-2 text-primary">{value}</p>
            )}
            {change && !loading && (
              <p className={`text-xs mt-2 font-semibold ${change > 0 ? 'text-success' : 'text-error'}`}>
                {change > 0 ? '↗ +' : '↘ '}{change}% from last week
              </p>
            )}
          </div>
          {icon && (
            <div className="text-4xl text-primary opacity-60">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
