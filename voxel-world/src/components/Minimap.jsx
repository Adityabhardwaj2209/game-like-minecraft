import React, { useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { useGameStore } from '../store/useGameStore'
import { useMissionStore } from '../store/useMissionStore'

// Enemy base positions - must match App.jsx
const ENEMY_BASES = [
  { x: 20, z: 20, label: '💀' },
  { x: -25, z: 10, label: '💀' },
]

const CHUNK_SIZE = 64
const MAP_SIZE = 160
const scale = MAP_SIZE / CHUNK_SIZE

const toScreen = (worldX, worldZ) => ({
  sx: (worldX + CHUNK_SIZE / 2) * scale,
  sz: (worldZ + CHUNK_SIZE / 2) * scale
})

// Draw a pulsing blip
const drawBlip = (ctx, sx, sz, color, size, label) => {
  ctx.beginPath()
  ctx.arc(sx, sz, size, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 1
  ctx.stroke()
  if (label) {
    ctx.font = `${size * 2}px sans-serif`
    ctx.fillText(label, sx - size, sz - size - 2)
  }
}

export function Minimap() {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    // Build static terrain buffer once
    const mapBuffer = document.createElement('canvas')
    mapBuffer.width = MAP_SIZE
    mapBuffer.height = MAP_SIZE
    const mapCtx = mapBuffer.getContext('2d')

    const drawStaticMap = () => {
      mapCtx.fillStyle = '#3a6e25'
      mapCtx.fillRect(0, 0, MAP_SIZE, MAP_SIZE)

      const cubes = useStore.getState().cubes
      cubes.forEach(cube => {
        const [x, y, z] = cube.pos
        const screenX = (x + CHUNK_SIZE / 2) * scale
        const screenZ = (z + CHUNK_SIZE / 2) * scale
        if (cube.type === 'water') {
          mapCtx.fillStyle = '#1E90FF'
          mapCtx.fillRect(screenX, screenZ, scale + 0.5, scale + 0.5)
        } else if (cube.type === 'wood' || cube.type === 'leaves') {
          mapCtx.fillStyle = '#006400'
          mapCtx.fillRect(screenX, screenZ, scale, scale)
        } else if (cube.type === 'stone' && y > 5) {
          mapCtx.fillStyle = '#707070'
          mapCtx.fillRect(screenX, screenZ, scale, scale)
        }
      })

      // Draw enemy base outlines (dark red zones)
      ENEMY_BASES.forEach(base => {
        const { sx, sz } = toScreen(base.x, base.z)
        mapCtx.fillStyle = 'rgba(180,0,0,0.25)'
        mapCtx.fillRect(sx - 14, sz - 14, 28, 28)
        mapCtx.strokeStyle = '#cc0000'
        mapCtx.lineWidth = 1.5
        mapCtx.strokeRect(sx - 14, sz - 14, 28, 28)
      })
    }
    drawStaticMap()

    const render = () => {
      frameRef.current++
      const blink = Math.sin(frameRef.current * 0.15) > 0

      ctx.drawImage(mapBuffer, 0, 0)

      const timeOfDay = useGameStore.getState().timeOfDay
      const isNight = timeOfDay < 0.2 || timeOfDay > 0.8
      const mission = useMissionStore.getState().getMission()

      // --- Enemy Base Markers (always visible) ---
      ENEMY_BASES.forEach(base => {
        const { sx, sz } = toScreen(base.x, base.z)
        // Dark red zone
        ctx.fillStyle = blink ? 'rgba(220,0,0,0.15)' : 'rgba(220,0,0,0.05)'
        ctx.fillRect(sx - 14, sz - 14, 28, 28)
        // Skull icon
        ctx.font = '12px sans-serif'
        ctx.fillText('💀', sx - 7, sz + 5)
        // Label ring
        ctx.beginPath()
        ctx.arc(sx, sz, 12, 0, 2 * Math.PI)
        ctx.strokeStyle = blink ? '#ff3300' : '#aa0000'
        ctx.lineWidth = 1.5
        ctx.stroke()
      })

      // --- Enemy NPC blips (only at night) ---
      if (isNight) {
        // Approximate skeleton positions (spread around player)
        const pos = useStore.getState().playerPosRef.current
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2
          const dist = 20 + i * 3
          const ex = (pos[0] || 0) + Math.cos(angle) * dist
          const ez = (pos[2] || 0) + Math.sin(angle) * dist
          const { sx, sz } = toScreen(ex, ez)
          if (sx < 0 || sx > MAP_SIZE || sz < 0 || sz > MAP_SIZE) continue
          if (blink) drawBlip(ctx, sx, sz, '#ff2222', 4, null)
        }
        // NPC threat ring around player
        const { sx: ppx, sz: ppz } = toScreen(pos[0] || 0, pos[2] || 0)
        ctx.beginPath()
        ctx.arc(ppx, ppz, 20 * scale / CHUNK_SIZE, 0, 2 * Math.PI)
        ctx.strokeStyle = 'rgba(255,0,0,0.25)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // --- Mission objective marker ---
      if (mission && mission.id === 'destroy_base') {
        ENEMY_BASES.forEach(base => {
          const { sx, sz } = toScreen(base.x, base.z)
          // Pulsing gold ring
          const pulse = (Math.sin(frameRef.current * 0.1) + 1) * 3 + 12
          ctx.beginPath()
          ctx.arc(sx, sz, pulse, 0, 2 * Math.PI)
          ctx.strokeStyle = '#f1c40f'
          ctx.lineWidth = 2
          ctx.stroke()
          ctx.font = '10px sans-serif'
          ctx.fillStyle = '#f1c40f'
          ctx.fillText('★', sx - 5, sz - 14)
        })
      }

      // --- Player dot (white with blue outline — GTA style) ---
      const pos = useStore.getState().playerPosRef.current
      if (pos) {
        const { sx, sz } = toScreen(pos[0], pos[2])
        ctx.beginPath()
        ctx.arc(sx, sz, 5, 0, 2 * Math.PI)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.strokeStyle = '#3498db'
        ctx.lineWidth = 2
        ctx.stroke()

        // Directional triangle
        const heading = 0 // TODO: sync from camera if needed
        ctx.save()
        ctx.translate(sx, sz)
        ctx.beginPath()
        ctx.moveTo(0, -7)
        ctx.lineTo(-4, 4)
        ctx.lineTo(4, 4)
        ctx.closePath()
        ctx.fillStyle = 'rgba(52,152,219,0.7)'
        ctx.fill()
        ctx.restore()
      }

      // --- Night mode overlay ---
      if (isNight) {
        ctx.fillStyle = 'rgba(10,0,40,0.28)'
        ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE)
      }

      // --- Legend ---
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(2, MAP_SIZE - 26, 80, 24)
      ctx.fillStyle = 'white'
      ctx.font = '8px monospace'
      ctx.fillText('⬜ You  💀 Base  🔴 Enemy', 5, MAP_SIZE - 13)

      animationId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div style={{
      position: 'absolute', top: 20, left: 20, zIndex: 10,
      width: MAP_SIZE + 4, height: MAP_SIZE + 4,
      background: '#111',
      borderRadius: 12,
      border: '2px solid rgba(255,255,255,0.25)',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
    }}>
      <canvas ref={canvasRef} width={MAP_SIZE} height={MAP_SIZE} style={{ display: 'block', borderRadius: 10 }} />
      {/* GTA-style compass */}
      <div style={{
        position: 'absolute', top: 4, right: 6, color: 'white',
        fontSize: 9, fontFamily: 'monospace', lineHeight: 1.1, textAlign: 'center'
      }}>
        <div style={{ color: '#e74c3c', fontWeight: 700 }}>N</div>
        <div>S</div>
      </div>
      <div style={{
        position: 'absolute', top: 12, right: 2, left: 2,
        display: 'flex', justifyContent: 'space-between',
        color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'monospace',
        pointerEvents: 'none', padding: '0 3px'
      }}>
        <span>W</span><span>E</span>
      </div>
    </div>
  )
}
