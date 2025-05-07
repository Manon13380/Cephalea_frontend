import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PrivateRouter from "./PrivateRouter";


const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRouter />}>
                    <Route path="/home" element={<Home />} />
                </Route>
            </Routes>
        </>
    );
};

export default Router;