import { createBrowserRouter } from "react-router-dom";
import { PlateRackScreen } from "./screens/PlateRackScreen";
import { LoadScreen } from "./screens/LoadScreen";
import { TransitionScreen } from "./screens/TransitionScreen";

export const router = createBrowserRouter([
  { path: "/", Component: LoadScreen },
  { path: "/load", Component: LoadScreen },
  { path: "/transition", Component: TransitionScreen },
  { path: "/rack", Component: PlateRackScreen },
]);