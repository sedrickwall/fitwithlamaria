import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initTestMode } from "@/lib/testMode";

// Initialize test mode BEFORE rendering the app
initTestMode();

createRoot(document.getElementById("root")!).render(<App />);
