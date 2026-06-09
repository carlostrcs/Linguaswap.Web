import { createBrowserRouter } from "react-router-dom";
import { PublicLibrariesPage } from "../features/libraries/PublicLibrariesPage";
import { PracticeSessionPage } from "../features/practice/PracticeSessionPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { MyLibrariesPage } from "../features/libraries/MyLibrariesPage";
import { LibraryDetailPage } from "../features/libraries/LibraryDetailPage";
import { GuestOnlyRoute } from "../routes/GuestOnlyRoute";
import { PrivateRoute } from "../routes/PrivateRoute";

export const router = createBrowserRouter([
  { path: "/", element: <GuestOnlyRoute><LoginPage /></GuestOnlyRoute> },
  { path: "/demo", element: <PublicLibrariesPage /> },
  { path: "/register", element: <GuestOnlyRoute><RegisterPage /></GuestOnlyRoute> },
  { path: "/login", element: <GuestOnlyRoute><LoginPage /></GuestOnlyRoute> },
  { path: "/practice/:sessionId", element: <PracticeSessionPage /> },
  { path: "/libraries", element: <PrivateRoute><MyLibrariesPage /></PrivateRoute>},
  { path: "/libraries/:libraryId", element: <LibraryDetailPage /> }
]);