import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Loading from "./Pages/Loading.jsx";


const Player = lazy(() => import('./Pages/Player.jsx'));
const Dealer = lazy(() => import('./Pages/Dealer.jsx'));
const Signup = lazy(() => import('./Pages/Signup.jsx'));
const Login = lazy(() => import('./Pages/Login.jsx'));
const Welcome = lazy(() => import('./Pages/Welcome.jsx'));

const AppRoutes = () => {
    const { user } = useAuth(); 

    return (
        <Suspense
            fallback={
                <Loading/>
            }
        >
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/player" element={user ? <Player /> : <Navigate to="/login" />} />
                <Route path="/dealer" element={user ? <Dealer /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;