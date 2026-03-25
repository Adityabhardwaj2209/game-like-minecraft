import { useGameStore } from '../store/useGameStore'

const HeartIcon = ({ filled }) => (
  <span style={{ fontSize: 18, color: filled ? '#e74c3c' : '#555', textShadow: filled ? '0 0 6px #ff0000' : 'none' }}>♥</span>
)

const getTimeLabel = (t) => {
  if (t < 0.2 || t > 0.8) return '🌙 Night'
  if (t < 0.3) return '🌅 Dawn'
  if (t < 0.7) return '☀️ Day'
  return '🌇 Dusk'
}

const weatherIcon = { clear: '☀️', rain: '🌧️', fog: '🌫️' }

export function HUD() {
  const health = useGameStore(s => s.health)
  const maxHealth = useGameStore(s => s.maxHealth)
  const timeOfDay = useGameStore(s => s.timeOfDay)
  const weather = useGameStore(s => s.weather)
  const score = useGameStore(s => s.score)
  const ammo = useGameStore(s => s.ammo)
  const maxAmmo = useGameStore(s => s.maxAmmo)
  const respawn = useGameStore(s => s.respawn)
  const isAlive = useGameStore(s => s.isAlive)

  const hearts = Math.ceil(maxHealth / 10)

  return (
    <>
      {/* Health Bar */}
      <div style={{
        position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 10,
        background: 'rgba(0,0,0,0.4)', padding: '8px 16px', borderRadius: 10,
        backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)'
      }}>
        {/* Health Hearts */}
        <div style={{ display: 'flex', gap: 3 }}>
          {Array(hearts).fill().map((_, i) => (
            <HeartIcon key={i} filled={i < Math.floor(health / 10)} />
          ))}
        </div>
        {/* Ammo Bar  */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'white' }}>
          <span>🔫</span>
          <div style={{ background: '#333', borderRadius: 4, height: 8, width: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(ammo / maxAmmo) * 100}%`, background: ammo > 10 ? '#f39c12' : '#e74c3c', transition: 'width 0.2s' }} />
          </div>
          <span style={{ color: ammo > 0 ? '#f39c12' : '#e74c3c', minWidth: 40 }}>{ammo}/{maxAmmo}</span>
        </div>
      </div>

      {/* Time & Weather */}
      <div style={{
        position: 'absolute', top: 20, right: 250, zIndex: 10,
        color: 'white', textShadow: '1px 1px 3px black',
        display: 'flex', gap: 8, alignItems: 'center',
        background: 'rgba(0,0,0,0.4)', padding: '6px 12px',
        borderRadius: 8, backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.15)'
      }}>
        <span style={{ fontSize: 14 }}>{getTimeLabel(timeOfDay)}</span>
        <span style={{ fontSize: 14 }}>{weatherIcon[weather]}</span>
        <span style={{ fontSize: 13, color: '#f1c40f' }}>⭐ {score}</span>
      </div>

      {/* Death Screen */}
      {!isAlive && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(140,0,0,0.7)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, backdropFilter: 'blur(8px)'
        }}>
          <h1 style={{ color: 'white', fontSize: 64, margin: 0, textShadow: '0 0 20px red' }}>☠️ You Died</h1>
          <p style={{ color: '#ddd', fontSize: 20 }}>Skeletons got you in the dark...</p>
          <button
            onClick={respawn}
            style={{
              marginTop: 24, padding: '12px 40px', fontSize: 20,
              background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
              color: 'white', border: 'none', borderRadius: 10,
              cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,0,0,0.4)'
            }}
          >Respawn</button>
        </div>
      )}
    </>
  )
}
