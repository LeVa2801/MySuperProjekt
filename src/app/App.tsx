import { BrowserRouter } from "react-router-dom";
import { SettingsProvider } from "../features/settings/SettingsProvider";
import { TodoProvider } from "../features/todo/TodoProvider";
import { AppShell } from "./layout/AppShell";

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <TodoProvider>
          <AppShell />
        </TodoProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
