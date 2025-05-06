import "./index.css";
import "@mantine/core/styles.css";
import { createRoot } from "react-dom/client";

import { createContext } from "react";

import { auth, firestore } from "./firebase.js";
import firebase from "firebase/compat/app";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";

export const Context = createContext(null);

createRoot(document.getElementById("root")).render(
  <Context.Provider
    value={{
      firebase,
      auth,
      firestore,
    }}
  >
    <MantineProvider>
      <App />
    </MantineProvider>
  </Context.Provider>
);
