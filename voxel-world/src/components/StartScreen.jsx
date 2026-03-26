import { useState, useEffect, useRef } from 'react'

const BLOCK_COLORS = ['#27ae60','#2980b9','#8B6914','#7f8c8d','#1a6b1a','#1E90FF','#c0392b']

function FloatingVoxels() {
  const canvasRef = useRef()
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const blocks = Array(40).fill().map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 18 + Math.random() * 40,
      color: BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.012,
      opacity: 0.08 + Math.random() * 0.18,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      blocks.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        b.rot += b.vr
        if (b.y + b.size < 0) { b.y = canvas.height + b.size; b.x = Math.random() * canvas.width }

        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.rotate(b.rot)
        ctx.globalAlpha = b.opacity
        // Top face
        ctx.fillStyle = b.color
        ctx.beginPath()
        ctx.moveTo(0, -b.size * 0.5)
        ctx.lineTo(b.size * 0.5, -b.size * 0.2)
        ctx.lineTo(b.size * 0.5, b.size * 0.3)
        ctx.lineTo(0, b.size * 0.05)
        ctx.closePath()
        ctx.fill()
        // Left face
        ctx.fillStyle = shadeColor(b.color, -30)
        ctx.beginPath()
        ctx.moveTo(0, b.size * 0.05)
        ctx.lineTo(0, -b.size * 0.5)
        ctx.lineTo(-b.size * 0.5, -b.size * 0.2)
        ctx.lineTo(-b.size * 0.5, b.size * 0.3)
        ctx.closePath()
        ctx.fill()
        // Front face
        ctx.fillStyle = shadeColor(b.color, -15)
        ctx.beginPath()
        ctx.moveTo(-b.size * 0.5, b.size * 0.3)
        ctx.lineTo(0, b.size * 0.05)
        ctx.lineTo(b.size * 0.5, b.size * 0.3)
        ctx.lineTo(0, b.size * 0.6)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', handleResize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}

function shadeColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return `rgb(${r},${g},${b})`
}

const CONTROLS = [
  ['WASD', 'Move'],
  ['Space', 'Jump'],
  ['Left Click', 'Break Block / Shoot'],
  ['Right Click', 'Place Block'],
  ['1-5', 'Select Block Type'],
  ['V', 'Toggle 3rd Person'],
  ['Esc', 'Unlock Mouse'],
]

export function StartScreen({ onStart }) {
  const [hovered, setHovered] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [particles, setParticles] = useState([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const burst = Array(20).fill().map(() => ({
      id: Math.random(),
      x: 50 + (Math.random() - 0.5) * 30,
      y: 50 + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      color: BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)],
      life: 1
    }))
    setParticles(burst)
    const interval = setInterval(() => {
      setParticles(prev => prev
        .map(p => ({ ...p, life: p.life - 0.008, x: p.x + p.vx * 0.1, y: p.y + p.vy * 0.1 }))
        .filter(p => p.life > 0)
      )
    }, 16)
    return () => clearInterval(interval)
  }, [])

  const handleStart = () => {
    setVisible(false)
    setTimeout(onStart, 400)
  }

  if (!visible) return (
    <div style={{ position: 'fixed', inset: 0, background: 'black', zIndex: 1000, animation: 'none', opacity: 0, transition: 'opacity 0.4s' }} />
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1a0d 40%, #1a0a0a 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      overflow: 'hidden'
    }}>
      <FloatingVoxels />

      {/* Title */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          fontSize: 72, fontWeight: 900, letterSpacing: -2,
          background: 'linear-gradient(135deg, #2ecc71, #27ae60, #f39c12, #e74c3c)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textShadow: 'none', lineHeight: 1, marginBottom: 8,
          filter: 'drop-shadow(0 0 30px rgba(46,204,113,0.5))'
        }}>
          ⛏️ VOXEL WORLD
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, letterSpacing: 4, textTransform: 'uppercase' }}>
          Story. Build. Survive.
        </div>
      </div>

      {/* Buttons */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        {/* START */}
        <button
          onClick={handleStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            padding: '18px 70px', fontSize: 22, fontWeight: 700, letterSpacing: 2,
            background: hovered
              ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
              : 'linear-gradient(135deg, #1e8449, #27ae60)',
            color: 'white', border: 'none', borderRadius: 14, cursor: 'pointer',
            boxShadow: hovered ? '0 0 40px rgba(46,204,113,0.7), 0 8px 25px rgba(0,0,0,0.5)' : '0 8px 25px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease', transform: hovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          ▶ START GAME
        </button>

        {/* CONTROLS */}
        <button
          onClick={() => setShowControls(s => !s)}
          style={{
            padding: '10px 40px', fontSize: 14, fontWeight: 600, letterSpacing: 1,
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, cursor: 'pointer',
            backdropFilter: 'blur(8px)', transition: 'all 0.2s'
          }}
        >
          🎮 {showControls ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div style={{
          position: 'relative', zIndex: 2, marginTop: 24,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14,
          padding: '20px 32px', minWidth: 320
        }}>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 700, marginBottom: 14, textAlign: 'center', letterSpacing: 2 }}>
            CONTROLS
          </div>
          {CONTROLS.map(([key, action]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 32 }}>
              <span style={{
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6, padding: '3px 10px', fontSize: 12, color: '#f39c12', fontWeight: 600, letterSpacing: 0.5
              }}>{key}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{action}</span>
            </div>
          ))}
        </div>
      )}

      {/* Feature tags */}
      <div style={{
        position: 'absolute', bottom: 30, display: 'flex', gap: 12, zIndex: 2, flexWrap: 'wrap', justifyContent: 'center', padding: '0 20px'
      }}>
        {['🌍 Open World', '🎬 Story Mode', '☠️ Skeleton Enemies', '🌙 Day/Night Cycle', '🔫 Combat', '🚗 Island Transport', '⚔️ Missions'].map(tag => (
          <span key={tag} style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, padding: '5px 14px', color: 'rgba(255,255,255,0.55)', fontSize: 12
          }}>{tag}</span>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 8, color: 'rgba(255,255,255,0.2)', fontSize: 10, zIndex: 2 }}>
        Built with React + Three.js + Web Audio API
      </div>
    </div>
  )
}
