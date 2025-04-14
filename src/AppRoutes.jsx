import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Player = lazy(() => import('./Pages/Player.jsx'));
const Dealer = lazy(() => import('./Pages/Dealer.jsx'));
const Signup = lazy(() => import('./Pages/Signup.jsx'));
const Login = lazy(() => import('./Pages/Login.jsx'));
const Welcome = lazy(() => import('./Pages/Welcome.jsx'));

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/player" element={<Player/>} />
        <Route path="/dealer" element={<Dealer/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
    </Routes>
  );
}

export default AppRoutes;