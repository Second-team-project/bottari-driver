import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

// 컴포넌트
import App from "../App.jsx";
import Main from "../components/main/Main.jsx";
import Login from "../components/auth/Login.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        loader: async () => {
          return redirect('/login');
        }
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: "/main",
        element: <Main />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}