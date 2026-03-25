import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'

const blocks = [
  { type: 'grass', color: '#51853a', num: 1 },
  { type: 'dirt', color: '#5c3a21', num: 2 },
  { type: 'stone', color: '#808080', num: 3 },
  { type: 'wood', color: '#8B4513', num: 4 },
  { type: 'glass', color: '#ADD8E6', num: 5 },
]

export function Hotbar() {
  const selectedBlockType = useStore((state) => state.selectedBlockType)
  const setBlockType = useStore((state) => state.setBlockType)

  useEffect(() => {
    const handleKeyDown = (e) => {
      const block = blocks.find(b => b.num.toString() === e.key)
      if (block) setBlockType(block.type)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setBlockType])

  return (
    <div style={{
      position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 10, padding: 10,
      background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 15, zIndex: 10
    }} onPointerDown={(e) => e.stopPropagation()}>
      {blocks.map((block) => (
        <div key={block.type} style={{
          position: 'relative', width: 50, height: 50,
          background: block.color, border: selectedBlockType === block.type ? '3px solid white' : '2px solid rgba(0,0,0,0.5)',
          borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s'
        }} onClick={(e) => { e.stopPropagation(); setBlockType(block.type) }}>
          <span style={{ position: 'absolute', top: 2, left: 5, color: 'white', fontSize: 12, fontWeight: 'bold' }}>{block.num}</span>
        </div>
      ))}
    </div>
  )
}
