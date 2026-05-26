import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App as AntdApp } from "antd";
import "./index.css";
import { App } from "./App.tsx";
import { appSetting } from "./constants/app-setting/config.const.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AntdApp>
      <App />
    </AntdApp>
  </StrictMode>,
);

document.getElementById("icon-page")?.setAttribute("href", appSetting.favicon);
