import { useContext } from "react";
import { TodoContext } from "./todoContext";

export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodos muss innerhalb von TodoProvider verwendet werden.");
  return context;
}
