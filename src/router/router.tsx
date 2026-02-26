import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom'; 

// PAGES
const ReceiptPage = lazy(() => import('../app/Receipts/pages/ReceiptPage'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ReceiptPage />
    ),
    errorElement: <ErrorPage />,
  },
]);
