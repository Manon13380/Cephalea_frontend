import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PrivateRouter from "./PrivateRouter";
import CrisisForm from "../pages/CrisisForm";
import CrisisList from "../pages/CrisisList";
import CrisisDetails from "../pages/CrisisDetails";
import TreatmentsPage from "../pages/TreatmentsPage";
import AddTreatmentForm from '../pages/AddTreatmentForm';
import CalendarPage from '../pages/CalendarPage';
import ProfilePage from '../pages/ProfilePage';

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
                    <Route path="/treatments" element={<TreatmentsPage />} />
                                        <Route path="/add-treatment" element={<AddTreatmentForm />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Routes>
        </>
    );
};

export default Router;