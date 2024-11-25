import {useSelector} from "react-redux";
import {Navigate, useLocation} from "react-router-dom";

const ProtectedRoute = (props) => {
    const location = useLocation();
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

     if (location.pathname === '/login' || location.pathname === '/register') {
         return props.children;
     }

    return (
        <>
            {isAuthenticated ? props.children : <Navigate to='/login' replace/>}
        </>
    )
}

export default ProtectedRoute;
