import { THEMES,type Theme, useTheme } from "./theme/theme";
import { ThemeProvider } from "./theme/ThemeProvider";
import { PublicLibrariesPage } from "./features/libraries/PublicLibrariesPage";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";


function TopBar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="spread" style={{ marginBottom: 16 }}>
      <h2 style={{ margin: 0 }}>LinguaSwap</h2>

      <div className="row">
        <span style={{ color: "var(--muted-text)" }}>Tema</span>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="button"
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function AppInner() {
  return (
    <div className="container">
      <TopBar />
      <PublicLibrariesPage />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}