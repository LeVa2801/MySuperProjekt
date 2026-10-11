import { createContext } from "react";
import type { Priority, TodoItem } from "./types";

export type TodoContextValue = {
  todos: TodoItem[];
  openCount: number;
  addTodo: (title: string, priority: Priority) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  clearCompleted: () => void;
};

export const TodoContext = createContext<TodoContextValue | null>(null);
