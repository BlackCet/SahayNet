import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { TaskManagement } from "./pages/TaskManagement";
import { SubmitNeed } from "./pages/SubmitNeed";
import { VolunteerMatching } from "./pages/VolunteerMatching";
import { BountyBoard } from "./pages/BountyBoard";
import { KarmaLedger } from "./pages/KarmaLedger";
import { Transparency } from "./pages/Transparency";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tasks", Component: TaskManagement },
      { path: "submit", Component: SubmitNeed },
      { path: "volunteers", Component: VolunteerMatching },
      { path: "bounty", Component: BountyBoard },
      { path: "karma", Component: KarmaLedger },
      { path: "transparency", Component: Transparency },
      { path: "profile", Component: Profile },
    ],
  },
]);
