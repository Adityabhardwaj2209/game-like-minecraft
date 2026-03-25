import { useState } from 'react'
import { useGameStore } from '../store/useGameStore'

const AMMO_PACKS = [
  { id: 'basic',  label: '🔹 Basic Pack',  ammo: 15,  cost: 50,  color: '#3498db' },
  { id: 'large',  label: '🔷 Large Pack',   ammo: 30,  cost: 80,  color: '#2980b9' },
  { id: 'mega',   label: '💎 Mega Pack',    ammo: 100, cost: 200, color: '#9b59b6' },
]

export function AmmoStore() {
  const [open, setOpen] = useState(false)
  const ammo = useGameStore(s => s.ammo)
  const maxAmmo = useGameStore(s => s.maxAmmo)
  const score = useGameStore(s => s.score)
  const addAmmo = useGameStore(s => s.addAmmo)
  const addScore = useGameStore(s => s.addScore)

  const buy = (pack) => {
    if (score < pack.cost) return
    addScore(-pack.cost)
    addAmmo(pack.ammo)
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          position: 'absolute', top: 20, right: 20, zIndex: 20,
          background: 'linear-gradient(135deg, #2c3e50, #4a4a4a)',
          color: 'white', border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
          fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
          backdropFilter: 'blur(6px)', boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
        }}
      >
        🛒 Ammo Store
        <span style={{
          background: '#e74c3c', borderRadius: '50%', width: 20, height: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11
        }}>{ammo}</span>
      </button>

      {/* Store Panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 60, right: 20, zIndex: 20, width: 280,
          background: 'rgba(15, 20, 35, 0.93)', backdropFilter: 'blur(12px)',
          borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)', color: 'white'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>⚔️ Ammo Store</h2>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>

          {/* Status */}
          <div style={{
            background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 12px',
            marginBottom: 16, display: 'flex', justifyContent: 'space-between', fontSize: 13
          }}>
            <span>🔫 Ammo: <strong>{ammo} / {maxAmmo}</strong></span>
            <span>⭐ Score: <strong>{score}</strong></span>
          </div>

          {/* Ammo Bar */}
          <div style={{ background: '#222', borderRadius: 6, height: 8, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(ammo / maxAmmo) * 100}%`, background: 'linear-gradient(90deg, #e74c3c, #f39c12)', transition: 'width 0.3s' }} />
          </div>

          {/* Packs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AMMO_PACKS.map(pack => (
              <button
                key={pack.id}
                onClick={() => buy(pack)}
                disabled={score < pack.cost}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 10, border: `1px solid ${pack.color}44`,
                  background: score >= pack.cost ? `${pack.color}22` : 'rgba(100,100,100,0.1)',
                  color: score >= pack.cost ? 'white' : '#666',
                  cursor: score >= pack.cost ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 14 }}>{pack.label}</span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 13 }}>
                  <span style={{ color: '#2ecc71' }}>+{pack.ammo} 🔹</span>
                  <span style={{ color: '#f1c40f' }}>{pack.cost} ⭐</span>
                </div>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#888', marginTop: 12, textAlign: 'center' }}>
            Kill skeletons at night to earn ⭐ score!
          </p>
        </div>
      )}
    </>
  )
}
