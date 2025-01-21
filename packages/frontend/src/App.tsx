import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './components/layouts/RootLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { Home, Features, Pricing, Login, Signup } from './pages';
import { docsRoutes } from './routes/docs.routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'features',
        element: <Features />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      ...docsRoutes,
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;