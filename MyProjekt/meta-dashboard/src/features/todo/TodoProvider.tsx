import { useMemo } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import { TodoContext } from "./todoContext";
import type { TodoContextValue } from "./todoContext";
import type { TodoItem } from "./types";

const initialTodos: TodoItem[] = [
  { id: "welcome-1", title: "Dashboard kennenlernen", done: false, priority: "Niedrig" },
];

/**
 * Provider component to manage and provide the Todo context to its children.
 */
export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>("dashboard-todos", initialTodos);

  const value = useMemo<TodoContextValue>(() => ({
    todos,
    openCount: todos.filter((todo) => !todo.done).length,
    addTodo: (title, priority) => setTodos((previous) => [{ id: crypto.randomUUID(), title, done: false, priority }, ...previous]),
    toggleTodo: (id) => setTodos((previous) => previous.map((item) => item.id === id ? { ...item, done: !item.done } : item)),
    removeTodo: (id) => setTodos((previous) => previous.filter((item) => item.id !== id)),
    clearCompleted: () => setTodos((previous) => previous.filter((todo) => !todo.done)),
  }), [todos, setTodos]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
