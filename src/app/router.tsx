import { createBrowserRouter } from "react-router-dom";
import { PublicLibrariesPage } from "../features/libraries/PublicLibrariesPage";
import { PracticeSessionPage } from "../features/practice/PracticeSessionPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/libraries", element: <PublicLibrariesPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/practice/:sessionId", element: <PracticeSessionPage /> },
]);