import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { Assessment } from "./pages/Assessment";
import { Evaluation } from "./pages/Evaluation";

import { Attempts } from "./pages/Attempts";
import { Analytics } from "./pages/Analytics";
import { Profile } from "./pages/Profile";
import { RootLayout } from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/app",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "assessment",
        Component: Assessment,
      },
      {
        path: "evaluation",
        Component: Evaluation,
      },
      {
        path: "attempts",
        Component: Attempts,
      },
      {
        path: "analytics",
        Component: Analytics,
      },

      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "*",
        element: <Navigate to="/app" replace />
      }
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
