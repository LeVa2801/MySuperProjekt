import { useLocation } from "react-router-dom";
import { navigationItems } from "../apps";

export function Header() {
  const { pathname } = useLocation();
  const currentTitle = navigationItems.find((item) => item.path === pathname)?.navLabel ?? "Command Center";

  return (
    <header className="shell-header"><div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-separator">/</span><strong>{currentTitle}</strong></div><div className="header-right"><span className="header-date">{new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "short" }).format(new Date())}</span><div className="user-avatar" aria-label="Lokales Profil">M</div></div></header>
  );
}
