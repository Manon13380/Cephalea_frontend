import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PrivateRouter from "./PrivateRouter";
import CrisisForm from "../pages/CrisisForm";
import CrisisList from "../pages/CrisisList";
import CrisisDetails from "../pages/CrisisDetails";

const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRouter />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/crisis-form" element={<CrisisForm />} />
                    <Route path="/crisis-list" element={<CrisisList />} />
                    <Route path="/crisis/:id" element={<CrisisDetails />} />
                </Route>
            </Routes>
        </>
    );
};

export default Router;