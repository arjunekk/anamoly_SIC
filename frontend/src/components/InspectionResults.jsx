import { getHeatmapUrl } from "../api/inspectionApi";

const SEVERITY_CONFIG = {
  none: { color: "bg-green-600 dark:bg-green-400", text: "text-green-700 dark:text-green-400" },
  minor: { color: "bg-amber-500 dark:bg-amber-400", text: "text-amber-700 dark:text-amber-400" },
  moderate: { color: "bg-orange-500 dark:bg-orange-400", text: "text-orange-700 dark:text-orange-400" },
  critical: { color: "bg-red-600 dark:bg-red-400", text: "text-red-700 dark:text-red-400" },
};

const RECOMMENDATION_ICONS = {
  reject: "M18 6L6 18M6 6l12 12",
  inspect: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  schedule: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  log: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  default: "M9 12l2 2 4-4",
};

function iconFor(recommendation) {
  const lower = recommendation.toLowerCase();
  if (lower.includes("reject")) return RECOMMENDATION_ICONS.reject;
  if (lower.includes("inspect") || lower.includes("recalibrate")) return RECOMMENDATION_ICONS.inspect;
  if (lower.includes("schedule")) return RECOMMENDATION_ICONS.schedule;
  if (lower.includes("log") || lower.includes("flag")) return RECOMMENDATION_ICONS.log;
  return RECOMMENDATION_ICONS.default;
}

export default function InspectionResults({ result }) {
  if (!result) return null;

  const severity = SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.none;

  return (
    <div className="mt-8 w-full max-w-3xl flex gap-5">
      <div className="flex-[1.5] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3">
        <p className="text-[11px] tracking-wide uppercase text-neutral-400 dark:text-neutral-500 mb-2 px-1">
          Heatmap
        </p>
        <img
          src={getHeatmapUrl(result.heatmap_url)}
          alt="Anomaly heatmap"
          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800"
        />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <p className="text-[11px] tracking-wide uppercase text-neutral-400 dark:text-neutral-500 mb-1">
            Anomaly score
          </p>
          <p
            className="text-4xl font-medium tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {result.anomaly_score.toFixed(2)}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className={`w-2 h-2 rounded-sm ${severity.color}`} />
            <span className={`text-xs tracking-wide uppercase font-medium ${severity.text}`}>
              {result.severity}
            </span>
          </div>
        </div>

        <a
          href={`http://127.0.0.1:8000/inspections/${result.id}/report`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          Download report
        </a>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <p className="text-[11px] tracking-wide uppercase text-neutral-400 dark:text-neutral-500 mb-3">
            Recommended actions
          </p>
          <div className="flex flex-col gap-2.5">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-neutral-400 dark:text-neutral-500">
                  <path d={iconFor(rec)} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {rec}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}