import {createBrowserRouter} from "react-router-dom";
import {paths} from "./routes.ts";
import HomePage from "@/pages/HomePage";

export const router = createBrowserRouter([
    {
        path: paths.home,
        element: <HomePage />,
    },
])