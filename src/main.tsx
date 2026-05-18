import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { appSetting } from "./constants/app-setting/config.const.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

document.getElementById("icon-page")?.setAttribute("href", appSetting.favicon);
