import React from "react";
import Routes from "./Routes";
import { ThemeProvider } from "./components/ui/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="attendease-ui-theme">
      <Routes />
    </ThemeProvider>
  );
}

export default App;