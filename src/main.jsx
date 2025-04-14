import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Player from './Pages/Player.jsx'
import Dealer from './Pages/Dealer.jsx';
import Signup from './Pages/Signup.jsx';
import Login from './Pages/Login.jsx';
import Welcome from './Pages/Welcome.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/player" element={<Player/>} />
        <Route path="/dealer" element={<Dealer/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
      </Routes>
    </Router>
  </StrictMode>,
)
