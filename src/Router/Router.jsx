import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Test from "../pages/Test";
import PrivateRouter from "./PrivateRouter";


const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<PrivateRouter />}>
                    <Route path="/test" element={<Test />} />
                </Route>
            </Routes>
        </>
    );
};

export default Router;