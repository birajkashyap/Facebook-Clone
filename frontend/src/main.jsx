import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css"; // Make sure this points to your CSS file with Tailwind imports

createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
