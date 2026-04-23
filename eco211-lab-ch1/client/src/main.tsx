import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EconLab from "./pages/EconLab";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EconLab
      courseTitle="ECO 211 ECONLAB"
      courseSubtitle="Chapter 1 — Introduction to Economics"
      hubUrl="https://www.perplexity.ai/computer/a/eco-211-econlab-course-hub-h76o7OX6SpisjlWADnIRGg"
    />
  </StrictMode>
);
