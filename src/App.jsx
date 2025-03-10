import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from "react-router-dom";
import Header from "./components/Header/index.jsx";
import SideBar from "./components/Sidebar/index.jsx";
import Index from "./components/Home/index.jsx";
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
import CreatingwithFile from './pages/examcreating/examcreatingwithfile.jsx';
import ListExam from './components/exam/ListExam/ListExam.jsx';
import ExamDetail from './components/exam/DetailExam/DetailExam.jsx';
import PaymentTmpPage from "./pages/tmp/index.jsx";
import Limitations from "./components/Limitations/index.jsx";
import MomoPaymentTmpPage from "./pages/momo/index.jsx";
import ExamResults from './pages/examresult/index.jsx';

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
                { index: true, element: <Index /> },
                { path: "my-classes", element: <Classes typeView={"CLASS_MEMBER_VIEW"}/> },
                { path: "created-class", element: <Classes typeView={"AUTHOR_VIEW"}/> },
                { path: "recent-class", element: <Classes typeView={"RECENT_VIEW"}/> },
                { path: "quiz", element: <Quiz /> },
                { path: "profile", element: <Profile /> },
                { path: "quiz/:id", element: <ExamPage /> },
                { path: "examcreating", element: <ExamCreating /> },
                { path: "admin", element: <AdminPage /> },
                {path:"workspace/exams/create-with-file",element:<CreatingwithFile></CreatingwithFile>},
                {path:"workspace/exams/news",element:<Quiz />},
                {path:"workspace/exams/list",element:<ListExam />},
                {path:"quiz/exam/search",element:<ListExam />},
                {path:"quiz/exam/result",element:< ExamResults/>},
                {path:"de-thi/:id",element:<ExamDetail />},
                { path: "limitations", element: <Limitations /> },
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
        { path: "payment-tmp-page", element: <PaymentTmpPage /> },
        { path: "momo-tmp-page", element: <MomoPaymentTmpPage /> },
    ]);

    return (
        <RouterProvider router={router} />
    );
}
