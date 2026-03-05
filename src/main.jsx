import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Mock do window.storage (substitui a API do Claude artifacts)
// Usa localStorage como backend
window.storage = {
  async get(key) {
    const val = localStorage.getItem(key);
    return val ? { key, value: val, shared: false } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true, shared: false };
  },
  async list(prefix = "") {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(prefix)) keys.push(k);
    }
    return { keys, prefix, shared: false };
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
