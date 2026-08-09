import { useEffect, useState } from "react";
import { getHeatmapUrl } from "../api/inspectionApi";

const API_BASE_URL = "http://127.0.0.1:8000";

const SEVERITY_COLORS = {
  none: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  minor: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  moderate: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400",
  critical: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
};

async function fetchAllInspections() {
  const response = await fetch(`${API_BASE_URL}/inspections`);
  if (!response.ok) throw new Error(`Failed to load inspection history: ${response.status}`);
  return response.json();
}

export default function History() {
  const [inspections, setInspections] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllInspections().then(setInspections).catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-sm text-red-600 dark:text-red-400 p-8">Couldn't load history. {error}</p>;
  }
  if (!inspections) {
    return <p className="text-sm text-neutral-400 p-8">Loading history…</p>;
  }
  if (inspections.length === 0) {
    return (
      <div className="p-8">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No inspections yet — run one from the Inspect page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1
  className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 tracking-tight"
  style={{ fontFamily: "var(--font-title)" }}
>
  History. <span className="text-neutral-400 dark:text-neutral-500 font-normal">({inspections.length})</span>
</h1>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-400 dark:text-neutral-500 text-[11px] tracking-wide uppercase">
            <tr>
              <th className="p-3 font-medium">Heatmap</th>
              <th className="p-3 font-medium">Id</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Score</th>
              <th className="p-3 font-medium">Severity</th>
              <th className="p-3 font-medium">Timestamp</th>
              <th className="p-3 font-medium">Report</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((insp) => (
              <tr key={insp.id} className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                <td className="p-3">
                  <img
                    src={getHeatmapUrl(insp.heatmap_url)}
                    alt=""
                    className="w-10 h-10 object-cover rounded-md border border-neutral-200 dark:border-neutral-800"
                  />
                </td>
                <td className="p-3 text-neutral-500 dark:text-neutral-400 tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>
                  #{insp.id}
                </td>
                <td className="p-3 text-neutral-700 dark:text-neutral-300">{insp.product_category}</td>
                <td className="p-3 text-neutral-700 dark:text-neutral-300 tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>
                  {insp.anomaly_score.toFixed(2)}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${SEVERITY_COLORS[insp.severity] || "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}>
                    {insp.severity}
                  </span>
                </td>
                <td className="p-3 text-neutral-400 dark:text-neutral-500 text-xs">
                  {new Date(insp.timestamp).toLocaleString()}
                </td>
                <td className="p-3">
                  <a
                    href={`${API_BASE_URL}/inspections/${insp.id}/report`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 dark:text-amber-400 hover:underline text-xs"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}