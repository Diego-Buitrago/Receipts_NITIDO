import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom'; 
import { PublicRoute } from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import Layout from '../components/Layout';

// PAGES
const Login = lazy(() => import('../pages/Login'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));
const ReceiptPage = lazy(() => import('../app/Receipts/pages/ReceiptPage'));
const UserPage = lazy(() => import('../app/users/pages/UserPage'));
const CustomerPage = lazy(() => import('../app/customers/pages/CustomerPage'));
const ProductsPage = lazy(() => import('../app/products/pages/ProductsPage'));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute >
        <Login />
      </PublicRoute>        
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/app",
    element: (
      <PrivateRoute >
        <Layout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [      
      {
        path: "receipts",
        element: <ReceiptPage />
      },
      {
        path: "users",
        element: <UserPage />
      },
      {
        path: "customers",
        element: <CustomerPage />
      },
      {
        path: "products",
        element: <ProductsPage />
      },
    ]
  },
]);
