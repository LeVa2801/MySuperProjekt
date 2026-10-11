import { useTodos } from "./useTodos";

export function TodoNavBadge() {
  const { openCount } = useTodos();
  return openCount > 0 ? <span className="nav-count">{openCount}</span> : null;
}
