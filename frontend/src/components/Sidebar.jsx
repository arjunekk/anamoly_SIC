import { NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

function AnomalyMark() {
  const dots = [
    [0, 0], [1, 0], [2, 0],
    [0, 1], [1, 1], [2, 1],
    [0, 2], [1, 2], [2, 2],
  ];
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      {dots.map(([x, y], i) => {
        const isAnomaly = i === 4;
        return (
          <circle
            key={i}
            cx={x * 5 + 2}
            cy={y * 5 + 2}
            r={isAnomaly ? 2.6 : 2}
            className={isAnomaly ? "fill-amber-600 dark:fill-amber-400" : "fill-neutral-400 dark:fill-neutral-600"}
          />
        );
      })}
    </svg>
  );
}

const navItems = [
  { to: "/", label: "Inspect", icon: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" },
  { to: "/dashboard", label: "Dashboard", icon: "M3 3v18h18M7 16l4-6 4 3 4-8" },
  { to: "/history", label: "History", icon: "M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="w-48 shrink-0 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col p-4 gap-1">
      <div className="flex items-center gap-2 mb-6 px-2">
        <AnomalyMark />
        <span
          className="text-sm font-medium text-neutral-900 dark:text-neutral-50 tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          anomaly
        </span>
      </div>

      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `flex items-center gap-2 px-2.5 py-2 rounded-md text-sm transition-colors ${
              isActive
                ? "bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-medium"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`
          }
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item.label}
        </NavLink>
      ))}

      <div className="flex-1" />

      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-2.5 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
        {isDark ? "Light mode" : "Dark mode"}
      </button>
    </div>
  );
}