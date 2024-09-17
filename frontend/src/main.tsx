import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/tiptap/styles.css";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/dates/styles.css";
import create from "zustand";

import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

interface SearchState {
  searchString: string;
  setSearchString: (searchString: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
}));


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MantineProvider>
          <App />
          <ToastContainer />
        </MantineProvider>
      </BrowserRouter>
    </QueryClientProvider>
    {/* </Provider> */}
  </StrictMode>
);
