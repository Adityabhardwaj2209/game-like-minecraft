import { useFrame } from '@react-three/fiber'
import { useRef, useState, useCallback } from 'react'
import { Vector3 } from 'three'
import { useStore } from '../store/useStore'
import { useGameStore } from '../store/useGameStore'
import { sounds } from '../utils/sounds'

const DROP_COLLECT_RADIUS = 1.5

const DropItem = ({ drop, onCollect }) => {
  const meshRef = useRef()
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    // Bobbing animation
    meshRef.current.position.y = drop.pos.y + Math.sin(clock.getElapsedTime() * 3 + drop.id) * 0.1 + 0.3
    meshRef.current.rotation.y += 0.02
    
    // Check player proximity
    const playerPos = useStore.getState().playerPosRef.current
    const dx = playerPos[0] - drop.pos.x
    const dz = playerPos[2] - drop.pos.z
    if (Math.sqrt(dx*dx + dz*dz) < DROP_COLLECT_RADIUS) {
      onCollect(drop)
    }
  })

  const color = drop.type === 'ammo' ? '#f39c12' : drop.type === 'bone' ? '#ecf0f1' : '#2ecc71'
  const emoji = drop.type === 'ammo' ? '🔹' : drop.type === 'bone' ? '🦴' : '💊'

  return (
    <group ref={meshRef} position={[drop.pos.x, drop.pos.y, drop.pos.z]}>
      {/* Glowing orb */}
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      {/* Inner smaller sphere */}
      <mesh>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
      </mesh>
      <pointLight color={color} intensity={1.5} distance={3} />
    </group>
  )
}

const DROP_TYPES = [
  { type: 'ammo', chance: 0.6, label: '+5 Ammo', color: '#f39c12' },
  { type: 'bone', chance: 0.3, label: '+30 Score', color: '#ecf0f1' },
  { type: 'health', chance: 0.2, label: '+20 HP', color: '#e74c3c' },
]

export function Drops({ drops, setDrops }) {
  const addAmmo = useGameStore(s => s.addAmmo)
  const addScore = useGameStore(s => s.addScore)
  const heal = useGameStore(s => s.heal)

  const handleCollect = useCallback((drop) => {
    sounds.itemPickup()
    if (drop.type === 'ammo') addAmmo(5)
    else if (drop.type === 'bone') addScore(30)
    else if (drop.type === 'health') heal(20)
    setDrops(prev => prev.filter(d => d.id !== drop.id))

    // Show floating text (via store notification or DOM)
    const el = document.createElement('div')
    el.textContent = drop.type === 'ammo' ? '+5 🔹 Ammo' : drop.type === 'bone' ? '+30 ⭐' : '+20 ♥'
    el.style.cssText = `position:fixed;top:40%;left:52%;transform:translateX(-50%);
      color:${drop.type === 'ammo' ? '#f39c12' : drop.type === 'bone' ? '#f1c40f' : '#e74c3c'};
      font-size:22px;font-weight:bold;pointer-events:none;z-index:999;
      text-shadow:0 2px 8px rgba(0,0,0,0.8);animation:none;`
    document.body.appendChild(el)
    let opacity = 1
    const fade = setInterval(() => {
      opacity -= 0.05
      el.style.opacity = opacity
      el.style.top = (40 - (1 - opacity) * 5) + '%'
      if (opacity <= 0) { clearInterval(fade); el.remove() }
    }, 30)
  }, [addAmmo, addScore, heal])

  return (
    <>
      {drops.map(drop => (
        <DropItem key={drop.id} drop={drop} onCollect={handleCollect} />
      ))}
    </>
  )
}

export const spawnDropsAt = (x, y, z) => {
  const newDrops = []
  DROP_TYPES.forEach(dt => {
    if (Math.random() < dt.chance) {
      newDrops.push({
        id: Date.now() + Math.random(),
        type: dt.type,
        pos: new Vector3(
          x + (Math.random() - 0.5) * 1.5,
          y,
          z + (Math.random() - 0.5) * 1.5
        )
      })
    }
  })
  return newDrops
}
