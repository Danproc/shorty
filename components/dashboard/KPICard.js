"use client";

export default function KPICard({ title, value, change, icon, loading = false }) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow rounded-xl">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-base-content/80 font-medium">{title}</p>
            {loading ? (
              <div className="skeleton h-8 w-24 mt-2 rounded-lg"></div>
            ) : (
              <p className="text-3xl font-bold mt-1 text-base-content">{value}</p>
            )}
            {change && !loading && (
              <p className={`text-sm mt-2 font-medium ${change > 0 ? 'text-success' : 'text-error'}`}>
                {change > 0 ? '+' : ''}{change}% from last week
              </p>
            )}
          </div>
          {icon && (
            <div className="text-3xl opacity-60 text-base-content">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
