import { useEffect, useState } from "react";
import { fetchDashboard } from "../api/dashboardApi";
import { getHeatmapUrl } from "../api/inspectionApi";

const SEVERITY_COLORS = {
  none: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  minor: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  moderate: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400",
  critical: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
      <p className="text-[11px] tracking-wide uppercase text-neutral-400 dark:text-neutral-500 mb-1">
        {label}
      </p>
      <p
        className="text-2xl font-medium tabular-nums text-neutral-900 dark:text-neutral-50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard().then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400 p-8">Couldn't load the dashboard. {error}</p>;
  }
  if (!data) {
    return <p className="text-sm text-neutral-400 p-8">Loading dashboard…</p>;
  }

  const { stats, recent_inspections, score_trend } = data;

  return (
    <div className="p-8">
      <h1
  className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 tracking-tight"
  style={{ fontFamily: "var(--font-title)" }}
>
  Dashboard.
</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total inspections" value={stats.total_inspections} />
        <StatCard label="Defect rate" value={`${stats.defect_rate}%`} />
        <StatCard label="Avg anomaly score" value={stats.average_anomaly_score} />
        <StatCard label="Categories tracked" value={Object.keys(stats.category_stats).length} />
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6">
        <p className="text-[11px] tracking-wide uppercase text-neutral-400 dark:text-neutral-500 mb-3">
          Severity distribution
        </p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(stats.severity_distribution).map(([severity, count]) => (
            <span
              key={severity}
              className={`px-2.5 py-1 rounded-md text-xs font-medium ${SEVERITY_COLORS[severity] || "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}
            >
              {severity} · {count}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6">
        <p className="text-[11px] tracking-wide uppercase text-neutral-400 dark:text-neutral-500 mb-3">
          Recent score trend
        </p>
        <div className="flex items-end gap-1 h-24">
          {score_trend.map((point, i) => (
            <div
              key={i}
              title={point.anomaly_score.toFixed(1)}
              className="bg-amber-400 dark:bg-amber-500 rounded-t w-3"
              style={{ height: `${Math.min(point.anomaly_score, 100)}%` }}
            />
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
        <p className="text-[11px] tracking-wide uppercase text-neutral-400 dark:text-neutral-500 mb-3">
          Recent inspections
        </p>
        <div className="flex flex-col gap-3">
          {recent_inspections.map((insp) => (
            <div key={insp.id} className="flex items-center gap-3 border-t border-neutral-100 dark:border-neutral-800 pt-3 first:border-none first:pt-0">
              <img
                src={getHeatmapUrl(insp.heatmap_url)}
                alt=""
                className="w-12 h-12 object-cover rounded-md border border-neutral-200 dark:border-neutral-800"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>
                  {insp.anomaly_score.toFixed(2)} <span className="text-neutral-400 dark:text-neutral-500 font-sans">· {insp.severity}</span>
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  {new Date(insp.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}