import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EconLab from "./pages/EconLab";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EconLab
      courseTitle="ECO 211 ECONLAB"
      courseSubtitle="Chapter 2 — Choice In A World Of Scarcity"
      hubUrl="https://www.perplexity.ai/computer/a/eco211-hub-h76o7OX6SpisjlWADnIRGg"
    />
  </StrictMode>
);
