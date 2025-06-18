import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home/Home';
import { Layout } from './pages/Layout/Layout';
import { NotFound } from './pages/NotFound/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
