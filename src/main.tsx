import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize dark mode from localStorage before render to prevent flash
const savedTheme = localStorage.getItem("fanpulse_theme");
if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
