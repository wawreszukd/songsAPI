import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./state/store.ts";
import "./index.css";
import App from "./App.tsx";
import { Provider as ReduxProvider } from "react-redux";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </StrictMode>
);
