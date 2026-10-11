import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="panel not-found"><span className="eyebrow">404</span><h1>Hier ist nichts.</h1><p>Diese Seite gibt es in deinem Dashboard nicht.</p><button className="primary-button" onClick={() => navigate("/")}>Zur Übersicht</button></div>
  );
}
