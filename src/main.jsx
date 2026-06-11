import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./App.css";

// No StrictMode: its dev-only double-invocation of effects re-initialises
// Lenis + ScrollTrigger pins twice, which desyncs pin positions and causes
// a scroll jump. Prod is unaffected either way.
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
