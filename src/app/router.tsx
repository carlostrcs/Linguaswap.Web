import { createBrowserRouter } from "react-router-dom";
import { PublicLibrariesPage } from "../features/libraries/PublicLibrariesPage";
import { PracticeSessionPage } from "../features/practice/PracticeSessionPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { MyLibrariesPage } from "../features/libraries/MyLibrariesPage";
import { LibraryDetailPage } from "../features/libraries/LibraryDetailPage";
import { GuestOnlyRoute } from "../routes/GuestOnlyRoute";
import { PrivateRoute } from "../routes/PrivateRoute";
import { HomePage } from "../features/home/HomePage";
import { RootLayout } from "../components/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: (
            <HomePage />
        ),
      },
      { path: "/demo", element: <PublicLibrariesPage /> },
      {
        path: "/register",
        element: (
          <GuestOnlyRoute>
            <RegisterPage />
          </GuestOnlyRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <GuestOnlyRoute>
            <LoginPage />
          </GuestOnlyRoute>
        ),
      },
      { path: "/practice/:sessionId", element: <PracticeSessionPage /> },
      {
        path: "/libraries",
        element: (
          <PrivateRoute>
            <MyLibrariesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/libraries/:libraryId",
        element: (
          <PrivateRoute>
            <LibraryDetailPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);