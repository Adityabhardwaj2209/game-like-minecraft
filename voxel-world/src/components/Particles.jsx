import { useFrame } from '@react-three/fiber'
import { useRef, useState, useCallback } from 'react'
import { Vector3 } from 'three'

const PARTICLE_COUNT = 12

export function useParticles() {
  const [particles, setParticles] = useState([])

  const spawnParticles = useCallback((x, y, z, color = '#8B6914') => {
    const newParticles = Array(PARTICLE_COUNT).fill().map(() => ({
      id: Math.random(),
      pos: new Vector3(x, y, z),
      vel: new Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 4
      ),
      life: 1.0,
      color,
      size: 0.05 + Math.random() * 0.1
    }))
    setParticles(prev => [...prev.slice(-50), ...newParticles])
  }, [])

  return { particles, setParticles, spawnParticles }
}

export function ParticleSystem({ particles, setParticles }) {
  useFrame((_, delta) => {
    setParticles(prev => prev
      .map(p => ({
        ...p,
        pos: p.pos.clone().addScaledVector(p.vel, delta),
        vel: p.vel.clone().setY(p.vel.y - 8 * delta),
        life: p.life - delta * 1.5
      }))
      .filter(p => p.life > 0)
    )
  })

  return (
    <>
      {particles.map(p => (
        <mesh key={p.id} position={p.pos.toArray()}>
          <boxGeometry args={[p.size, p.size, p.size]} />
          <meshStandardMaterial color={p.color} transparent opacity={p.life} />
        </mesh>
      ))}
    </>
  )
}
