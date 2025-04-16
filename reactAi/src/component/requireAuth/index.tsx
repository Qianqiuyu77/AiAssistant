import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = !!sessionStorage.getItem("token");


    if (!isAuthenticated) {
        return <Navigate to="/Login" replace />;
    }

    return children;
};

export default RequireAuth;