import { NavLink, useNavigate } from "react-router-dom";
import { navigationItems } from "../apps";

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="shell-sidebar">
        <button className="sidebar-brand" onClick={() => navigate("/")}><span className="brand-mark">M<span>.</span></span><span>MY<span className="brand-accent">DASHBOARD</span></span></button>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Hauptnavigation">
          {navigationItems.map(({ path, navLabel, end, Badge }) => <NavLink end={end} to={path} key={path} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}><span className="nav-indicator" />{navLabel}{Badge && <Badge />}</NavLink>)}
        </nav>
        <div className="sidebar-bottom"><span className="live-dot" /><div><strong>LOCAL MODE</strong><small>Daten bleiben auf deinem Gerät</small></div></div>
    </aside>
  );
}
