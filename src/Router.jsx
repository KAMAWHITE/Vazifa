import { createBrowserRouter } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home"

export const Router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/home',
        element: <Home />
    }
])