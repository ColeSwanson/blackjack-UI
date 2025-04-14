import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Choose Your Role</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button
          onClick={() => window.location.href = '/player'}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}
        >
          Player
        </button>
        <button
          onClick={() => window.location.href = '/dealer'}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28A745',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#28A745'}
        >
          Dealer
        </button>
      </div>
    </div>
  )
}

export default App
