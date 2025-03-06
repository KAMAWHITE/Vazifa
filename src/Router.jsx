import { createBrowserRouter } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home"
import App from "./App"

export const Router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Login />
            }
        ]
    },
    {
        path: '/home',
        element: <Home />
    }
])