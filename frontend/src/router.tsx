import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home/Home';
import { Layout } from './pages/Layout/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
    ],
  },
]);
