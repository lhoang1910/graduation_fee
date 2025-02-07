import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header/index.jsx";
import Footer from "./components/Footer/index.jsx";
import SideBar from "./components/Sidebar/index.jsx";
import Home from "./components/Home/Home.jsx";
import Register from "./pages/register/index.jsx";
import NotFound from "./pages/notfound/index.jsx";
import LoginPage from "./pages/login/index.jsx";
import Quiz from "./components/quiz/index.jsx";
import './index.css';
import Profile from "./components/Profile/index.jsx";
import Classes from "./components/Classes/index.jsx";
import ExamPage from './pages/exam/index.jsx';
import ExamCreating from './components/ExamCreating/index.jsx';
import ForgotPasswordPage from './pages/forgotpassword/index.jsx';
import ChangePassword from './pages/changepassword/index.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const currentPath = window.location.pathname;

        if (!token && currentPath !== '/login' && currentPath !== '/register') {
            navigate('/login');
        }
    }, [navigate]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout-app">
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
                <Header isSidebarOpen={isSidebarOpen}/>
                <Outlet/>
                {/* <Footer/> */}
            </div>
        </div>
    );
};

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            errorElement: <NotFound />,
            children: [
                { index: true, element: <Home /> },
                { path: "classes", element: <Classes /> },
                { path: "quiz", element: <Quiz /> },
                { path: "profile", element: <Profile /> },
                { path: "exam", element: <ExamPage /> },
                { path: "examcreating", element: <ExamCreating /> },
                { path: "admin", element: <AdminPage /> }



            ],
        },
        {
            path: "*",
            element: <NotFound />,
        },
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPasswordPage /> },
        { path: "change-password", element: <ChangePassword /> },
    ]);

    return (
        <RouterProvider router={router} />
    );
}
