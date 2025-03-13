import React, {useEffect, useState} from 'react';
import {createBrowserRouter, RouterProvider, Outlet, useNavigate} from "react-router-dom";
import Header from "./components/Header/index.jsx";
import SideBar from "./components/Sidebar/index.jsx";
import Index from "./components/Home/index.jsx";
import Register from "./pages/register/index.jsx";
import NotFound from "./pages/notfound/index.jsx";
import LoginPage from "./pages/login/index.jsx";
import Quiz from "./components/quiz/index.jsx";
import './index.css';
import Profile from "./components/Profile/index.jsx";
import ExamPage from './pages/exam/index.jsx';
import ExamCreating from './components/ExamCreating/index.jsx';
import ForgotPasswordPage from './pages/forgotpassword/index.jsx';
import ChangePassword from './pages/changepassword/index.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';
import CreatingwithFile from './pages/examcreating/examcreatingwithfile.jsx';
import ListExam from './components/exam/ListExam/ListExam.jsx';
import ExamDetail from './components/exam/DetailExam/DetailExam.jsx';
import PaymentTmpPage from "./pages/tmp/index.jsx";
import MomoPaymentTmpPage from "./pages/momo/index.jsx";
import ExamResults from './pages/examresult/index.jsx';
import ClassList from "./components/Classes/index.jsx";
import ClassDetail from "./components/Classes/Detail/index.jsx";
import GenerateExamByAI from "./pages/examai/GenerateExamByAI.jsx";
import LimitationWalletPage from "./pages/limitation/LimitationWalletPage.jsx";
import ExamPages from "./components/exam/ExamPage/ExamPages.jsx";
import ExamResultDetail from "./pages/examresult/ResultDetail.jsx";
import ResultDashBoard from "./components/exam/Result/ResultDashBoard.jsx";
import LimitationList from "./components/Limitations/index.jsx";
import IPNHandle from "./pages/Ipn-handler/IPN.jsx";
import AdminDashBoard from "./pages/admin/AdminPage.jsx";
import AdminSidebar from "./components/Admin/Sidebar/index.jsx";
import AdminUsers from "./components/Admin/User/index.jsx";
import AdminClasses from "./components/Admin/Class/index.jsx";
import AdminExams from "./components/Admin/Exam/index.jsx";
import AdminQuestions from "./components/Admin/Question/index.jsx";
import AdminServicePackage from "./components/Admin/ServicePackage/index.jsx";
import AdminPayments from "./components/Admin/Payment/index.jsx";
import AdminReports from "./components/Admin/Report/index.jsx";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const isAdminRoute = location.pathname.includes('/admin')

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
            {isAdminRoute ? (
                <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            ) : (
                <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            )}
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
                <Header isSidebarOpen={isSidebarOpen} />
                <Outlet />
            </div>
        </div>
    );
};

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout/>,
            errorElement: <NotFound/>,
            children: [
                {index: true, element: <Index/>},
                {path: "limitation-wallet", element: <LimitationWalletPage />},
                {path: "classes/my-class", element: <ClassList/>},
                {path: "classes/created-class", element: <ClassList/>},
                {path: "class/recent-view", element: <ClassList/>},
                {path: "class/:id", element: <ClassDetail />},
                {path: "quiz", element: <Quiz/>},
                {path: "profile", element: <Profile/>},
                {path: "quiz/:id", element: <ExamPage/>},
                {path: "examcreating", element: <ExamCreating/>},
                {path: "workspace/exams/create-with-file", element: <CreatingwithFile></CreatingwithFile>},
                {path: "workspace/exams/create-with-ai", element: <GenerateExamByAI />},
                {path: "workspace/exams/news", element: <Quiz/>},
                {path: "workspace/exams/list", element: <ListExam/>},
                {path: "quiz/exam/search", element: <ListExam/>},
                {path: "quiz/exam/result", element: < ExamResults/>},
                {path: "exam/explore", element: <ExamPages/>},
                {path: "classes/exam/:classCode", element: <ExamPages/>},
                {path: "exam/created", element: <ExamPages/>},
                {path: "exam/:id", element: <ExamDetail/>},
                {path: "result/:id", element: <ExamResultDetail />},
                {path: "result-dashboard", element: <ResultDashBoard />},
                {path: "limitations", element: <LimitationList />},
                {path: "ipn-handle-page", element: <IPNHandle />},
            ],
        },
        {
            path: "/admin",
            element: <Layout/>,
            errorElement: <NotFound/>,
            children: [
                {index: true, element: <AdminDashBoard />},
                {path: "/admin/users", element: <AdminUsers />},
                {path: "/admin/classes", element: <AdminClasses />},
                {path: "/admin/exams", element: <AdminExams />},
                {path: "/admin/questions", element: <AdminQuestions />},
                {path: "/admin/service-packages", element: <AdminServicePackage />},
                {path: "/admin/payments", element: <AdminPayments />},
                {path: "/admin/reports", element: <AdminReports />}
            ]
        },
        {
            path: "*",
            element: <NotFound/>,
        },
        {path: "login", element: <LoginPage/>},
        {path: "register", element: <Register/>},
        {path: "forgot-password", element: <ForgotPasswordPage/>},
        {path: "change-password", element: <ChangePassword/>},
        {path: "payment-tmp-page", element: <PaymentTmpPage/>},
        {path: "momo-tmp-page", element: <MomoPaymentTmpPage/>},
    ]);

    return (
        <RouterProvider router={router}/>
    );
}
