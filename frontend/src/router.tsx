import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home/Home';
import { Layout } from './pages/Layout/Layout';
import { NotFound } from './pages/NotFound/NotFound';
import { Chat } from './pages/Chat/Chat';

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
        path: 'chat/:id',
        element: <Chat />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
