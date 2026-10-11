import { NavLink } from "react-router-dom";
import { apps } from "../../app/apps";
import { useTodos } from "../todo/useTodos";

export default function DashboardPage() {
  const { openCount: openTodos } = useTodos();

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">DEIN ARBEITSBEREICH</p>
          <h1>Command Center</h1>
          <p className="page-subtitle">Alle Werkzeuge an einem Ort. Wähle eine App, um loszulegen.</p>
        </div>
        <div className="date-chip"><span className="live-dot" /> Alle Apps lokal verfügbar</div>
      </div>
      <div className="summary-row">
        <div className="summary-card"><span className="summary-icon">▦</span><div><strong>8</strong><span>Apps verfügbar</span></div></div>
        <div className="summary-card"><span className="summary-icon">✓</span><div><strong>{openTodos}</strong><span>Offene Aufgaben</span></div></div>
        <div className="summary-card"><span className="summary-icon">◉</span><div><strong>Browser</strong><span>Lokale Speicherung</span></div></div>
      </div>
      <div className="section-heading"><div><h2>Deine Apps</h2><p>Direkt öffnen und produktiv werden.</p></div></div>
      <div className="app-grid">
        {apps.map((app, index) => (
          <NavLink className="app-card" to={app.path} key={app.path} style={{ animationDelay: `${index * 60}ms` }}>
            <div className="app-card-top"><span className="app-icon">{app.icon}</span><span className="status-pill"><span className="live-dot" />{app.tag}</span></div>
            <h3>{app.cardTitle}</h3>
            <p>{typeof app.description === "function" ? app.description({ openTodos }) : app.description}</p>
            <span className="app-card-link">App öffnen <span aria-hidden="true">↗</span></span>
          </NavLink>
        ))}
      </div>
    </section>
  );
}
