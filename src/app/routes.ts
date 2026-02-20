import { createBrowserRouter } from 'react-router';
import { PlateRackScreen } from './screens/PlateRackScreen';
import { LoadScreen } from './screens/LoadScreen';
import { TransitionScreen } from './screens/TransitionScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PlateRackScreen,
  },
  {
    path: '/load',
    Component: LoadScreen,
  },
  {
    path: '/transition',
    Component: TransitionScreen,
  },
]);
