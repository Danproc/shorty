"use client";

export default function KPICard({ title, value, change, icon, loading = false }) {
  return (
    <div className="card bg-base-100 hover:shadow-sm transition-all duration-200 rounded-lg border border-base-300 hover:border-primary/30">
      <div className="card-body p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-base-content/60 font-medium uppercase tracking-wide">{title}</p>
            {loading ? (
              <div className="skeleton h-8 w-24 mt-2 rounded-lg"></div>
            ) : (
              <p className="text-3xl font-bold mt-1.5 text-base-content">{value}</p>
            )}
            {change && !loading && (
              <p className={`text-xs mt-2 font-medium ${change > 0 ? 'text-success' : 'text-error'}`}>
                {change > 0 ? '↗ +' : '↘ '}{change}% from last week
              </p>
            )}
          </div>
          {icon && (
            <div className="text-3xl opacity-40 text-primary">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
