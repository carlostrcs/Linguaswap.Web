import { createBrowserRouter } from "react-router-dom";
import { PublicLibrariesPage } from "../features/libraries/PublicLibrariesPage";
import { PracticeSessionPage } from "../features/practice/PracticeSessionPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { MyLibrariesPage } from "../features/libraries/MyLibrariesPage";
import { LibraryDetailPage } from "../features/libraries/LibraryDetailPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/demo", element: <PublicLibrariesPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/practice/:sessionId", element: <PracticeSessionPage /> },
  { path: "/libraries", element: <MyLibrariesPage />},
  { path: "/libraries/:libraryId", element: <LibraryDetailPage /> }
]);