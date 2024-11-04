import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; 
import ErrorPage from "./pages/error-page";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import Register from "./pages/auth/Register";
import AdminSettings from "./pages/AdminSettings";
import Userprofile from "./pages/Userprofile";
import Index from "./pages/Index";
import App from "./App";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, authLoading } = useAuth(); 

    if (!isAuthenticated && !authLoading) {
      return <Navigate to="/login" replace />;
    }

  return children;  
};


const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/app",
      element: (
        <ProtectedRoute>
          <App />
        </ProtectedRoute>
      ),
      children: [
        {
          
          errorElement: <ErrorPage />,  
          children: [
            { index: true, element: <Index /> },
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "settings",
              element: <AdminSettings />,
            },
            {
              path: "profile",
              element: <Userprofile />
            },
          ],
        },
      ],
    },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}


