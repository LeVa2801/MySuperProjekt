import { useState } from "react";
import type { FormEvent } from "react";
import { PageHeading } from "../../shared/components/PageHeading";
import { useTodos } from "./useTodos";
import type { Priority } from "./types";

/**
 * Component to render the Todo page with task management functionality.
 */
export default function TodoPage() {
  const { todos, addTodo, toggleTodo, removeTodo, clearCompleted } = useTodos();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Mittel");
  const [filter, setFilter] = useState<"Alle" | "Offen" | "Erledigt">("Alle");
  const [error, setError] = useState("");
  const visibleTodos = todos.filter((todo) => filter === "Alle" || (filter === "Offen" ? !todo.done : todo.done));
  const openCount = todos.filter((todo) => !todo.done).length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Gib deiner Aufgabe einen Namen.");
      return;
    }
    addTodo(cleanTitle, priority);
    setTitle("");
    setError("");
  }

  return (
    <section>
      <PageHeading eyebrow="PLANUNG & FOKUS" title="Todo" subtitle="Behalte den Überblick und bring deine wichtigsten Aufgaben voran."
        aside={<div className="todo-count"><strong>{openCount}</strong><span>offen</span></div>} />
      <div className="todo-layout">
        <div className="panel todo-form-panel"><span className="eyebrow">NEUE AUFGABE</span><h2>Was steht an?</h2><form className="stack-form" onSubmit={handleSubmit}><label htmlFor="todo-title">Aufgabe</label><input id="todo-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="z. B. API-Endpunkte prüfen" /><label htmlFor="todo-priority">Priorität</label><select id="todo-priority" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option>Niedrig</option><option>Mittel</option><option>Hoch</option></select>{error && <p className="field-error" role="alert">{error}</p>}<button className="primary-button" type="submit">Aufgabe hinzufügen <span>＋</span></button></form><p className="security-note">Aufgaben werden nur in diesem Browser gespeichert.</p></div>
        <div className="panel task-panel">
          <div className="output-heading"><div><span className="eyebrow">DEINE LISTE</span><h2>{todos.length} {todos.length === 1 ? "Aufgabe" : "Aufgaben"}</h2></div><button className="text-button" onClick={clearCompleted} disabled={!todos.some((todo) => todo.done)}>Erledigte löschen</button></div>
          <div className="tabs filter-tabs">{(["Alle", "Offen", "Erledigt"] as const).map((value) => <button key={value} className={filter === value ? "tab active" : "tab"} onClick={() => setFilter(value)}>{value}{value === "Offen" && <span className="filter-count">{openCount}</span>}</button>)}</div>
          <div className="task-list">
            {visibleTodos.map((todo) => <article className={todo.done ? "task-item completed" : "task-item"} key={todo.id}><button className="task-check" aria-label={todo.done ? "Als offen markieren" : "Als erledigt markieren"} onClick={() => toggleTodo(todo.id)}>{todo.done ? "✓" : ""}</button><div className="task-details"><span>{todo.title}</span><small className={`priority-${todo.priority.toLocaleLowerCase("de")}`}>{todo.priority}</small></div><button className="delete-button" aria-label={`Aufgabe ${todo.title} löschen`} onClick={() => removeTodo(todo.id)}>×</button></article>)}
            {visibleTodos.length === 0 && <div className="empty-state"><span>✓</span><strong>{filter === "Erledigt" ? "Noch nichts erledigt" : filter === "Offen" ? "Alles geschafft!" : "Deine Liste ist noch leer"}</strong><p>Füge eine Aufgabe hinzu, um hier loszulegen.</p></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
