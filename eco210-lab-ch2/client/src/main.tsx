import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EconLab from "./pages/EconLab";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EconLab
      courseTitle="ECO 210 ECONLAB"
      courseSubtitle="Chapter 2 — Choice In A World Of Scarcity"
      hubUrl="https://www.perplexity.ai/computer/a/eco-210-econlab-course-hub-JgrfOPjHQ5iSYovw19FfIg"
    />
  </StrictMode>
);
