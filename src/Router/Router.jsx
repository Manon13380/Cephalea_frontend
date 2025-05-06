import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Test from "../pages/Test";
import PrivateRouter from "./PrivateRouter";


const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRouter />}>
                    <Route path="/test" element={<Test />} />
                </Route>
            </Routes>
        </>
    );
};

export default Router;