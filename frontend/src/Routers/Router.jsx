import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from './../pages/Register';
import Add from "../pages/Add";
import Layout from "../component/Layout";
import Edit from "../pages/Edit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use the Layout component
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "add",
        element: <Add />,
      },
      
      {
        path: "/edit/:storeId",
        element: <Edit />,
      }
    ],
  },
]);


export default router;
