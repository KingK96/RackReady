import { createBrowserRouter } from "react-router-dom";
import { PlateRackScreen } from "./screens/PlateRackScreen";
import { LoadScreen } from "./screens/LoadScreen";
import { TransitionScreen } from "./screens/TransitionScreen";

export const router = createBrowserRouter([
  { path: "/", element: <LoadScreen /> },
  { path: "/load", element: <LoadScreen /> },
  { path: "/transition", element: <TransitionScreen /> },
  { path: "/rack", element: <PlateRackScreen /> },
]);