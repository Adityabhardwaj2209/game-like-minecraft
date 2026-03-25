import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Vector3, Raycaster } from 'three'
import { useGameStore } from '../store/useGameStore'
import { sounds } from '../utils/sounds'

const BULLET_SPEED = 30
const BULLET_RANGE = 40
const BULLET_DAMAGE = 50

function Bullet({ bullet, onHit }) {
  const meshRef = useRef()
  const traveled = useRef(0)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const dist = BULLET_SPEED * delta
    meshRef.current.position.addScaledVector(bullet.dir, dist)
    traveled.current += dist
    if (traveled.current > BULLET_RANGE) onHit(bullet.id)
  })

  return (
    <mesh ref={meshRef} position={bullet.startPos.toArray()}>
      <sphereGeometry args={[0.06, 6, 6]} />
      <meshStandardMaterial color="#ffdd00" emissive="#ff8800" emissiveIntensity={3} />
    </mesh>
  )
}

export function BulletSystem({ enemyHitCallback }) {
  const { camera } = useThree()
  const [bullets, setBullets] = useState([])
  const ammo = useGameStore(s => s.ammo)
  const useAmmo = useGameStore(s => s.useAmmo)
  const addScore = useGameStore(s => s.addScore)

  const shoot = useCallback(() => {
    if (ammo <= 0) {
      sounds.emptyClick()
      return
    }
    useAmmo()
    sounds.gunshot()
    const dir = new Vector3()
    camera.getWorldDirection(dir)
    setBullets(prev => [...prev, {
      id: Date.now() + Math.random(),
      startPos: camera.position.clone().addScaledVector(dir, 0.8),
      dir: dir.clone()
    }])
  }, [ammo, camera, useAmmo])

  useEffect(() => {
    const handleClick = (e) => {
      // Only shoot when pointer is locked (i.e. mouse is captured by the game)
      if (e.button === 0 && document.pointerLockElement) {
        shoot()
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [shoot])

  const removeBullet = useCallback((id) => {
    setBullets(prev => prev.filter(b => b.id !== id))
  }, [])

  return (
    <>
      {bullets.map(b => (
        <Bullet key={b.id} bullet={b} onHit={removeBullet} />
      ))}
    </>
  )
}
