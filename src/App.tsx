import { ThemeProvider } from "./theme/ThemeProvider";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";

export default function App() {
  return (
    <ThemeProvider>
      <div className="mainContainer">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}