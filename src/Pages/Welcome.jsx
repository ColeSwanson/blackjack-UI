import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

function Welcome() {
  const navigate = useNavigate();
  const {user} = useAuth();

  const handleLoginLogout = () => {
    if (user) {
      signOut(auth)
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f0f8ff', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
        <button
          onClick={handleLoginLogout}
          style={{
            padding: '8px 15px',
            fontSize: '16px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#5a6268';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#6c757d';
            e.target.style.transform = 'scale(1)';
          }}
        >
          {user ? 'Logout' : 'Login'}
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ marginBottom: '20px', color: '#333', fontSize: '2.5rem' }}>Welcome to the Blackjack Virtual Environment!</h1>
        <p style={{ marginBottom: '30px', color: '#555', fontSize: '1.2rem', textAlign: 'center', maxWidth: '600px' }}>
          The decisions you make will be communicated to the in-person dealer, who will scan and play your cards alongside other virtual and in-person players. 
          <br/>
          <br />
          Good luck!
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/player')}
            style={{
              padding: '12px 25px',
              fontSize: '18px',
              backgroundColor: '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#007BFF';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Player
          </button>
          <button
            onClick={() => navigate('/dealer')}
            style={{
              padding: '12px 25px',
              fontSize: '18px',
              backgroundColor: '#28A745',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#1e7e34';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#28A745';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Dealer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome
