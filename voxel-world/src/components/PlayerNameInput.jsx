import { useState } from 'react'

export const PlayerNameInput = ({ onNameSubmit, onStart }) => {
  const [playerName, setPlayerName] = useState('')
  const [showInput, setShowInput] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (playerName.trim()) {
      onNameSubmit(playerName.trim())
      setShowInput(false)
    }
  }

  const handleStart = () => {
    if (playerName.trim()) {
      onStart()
    }
  }

  if (!showInput) return null

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      padding: '40px',
      borderRadius: '15px',
      border: '2px solid #3498db',
      boxShadow: '0 0 30px rgba(52, 152, 219, 0.5)',
      zIndex: 1000,
      textAlign: 'center',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ 
        marginBottom: '20px', 
        color: '#3498db',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        Enter Your Name
      </h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your character name..."
          maxLength={20}
          style={{
            width: '250px',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #2c3e50',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            outline: 'none',
            marginBottom: '15px'
          }}
          autoFocus
        />
        
        <div>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#3498db',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2980b9'
              e.target.style.transform = 'scale(1.05)'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3498db'
              e.target.style.transform = 'scale(1)'
            }}
          >
            Confirm Name
          </button>
          
          <button
            type="button"
            onClick={handleStart}
            disabled={!playerName.trim()}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: playerName.trim() ? '#27ae60' : '#95a5a6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: playerName.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (playerName.trim()) {
                e.target.style.backgroundColor = '#229954'
                e.target.style.transform = 'scale(1.05)'
              }
            }}
            onMouseOut={(e) => {
              if (playerName.trim()) {
                e.target.style.backgroundColor = '#27ae60'
                e.target.style.transform = 'scale(1)'
              }
            }}
          >
            Start Game
          </button>
        </div>
      </form>
      
      <p style={{ 
        fontSize: '14px', 
        color: '#bdc3c7',
        marginTop: '15px' 
      }}>
        Enter your name and click "Start Game" to begin your adventure!
      </p>
    </div>
  )
}

export const PlayerNameDisplay = ({ playerName }) => {
  if (!playerName) return null

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      color: '#ffffff',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: '8px 15px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      zIndex: 100
    }}>
      👤 {playerName}
    </div>
  )
}
