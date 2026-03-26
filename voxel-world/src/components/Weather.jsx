import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { useGameStore } from '../store/useGameStore'
import { AdditiveBlending } from 'three'
import { useStore } from '../store/useStore'
import { sounds } from '../utils/sounds'

const RAIN_COUNT = 1000

export function Weather() {
  const rainRef = useRef()
  
  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos.push((Math.random() - 0.5) * 40, Math.random() * 20, (Math.random() - 0.5) * 40)
    }
    return new Float32Array(pos)
  }, [])

  useFrame((_, delta) => {
    const weather = useGameStore.getState().weather
    if (!rainRef.current) return

    rainRef.current.visible = weather === 'rain'
    if (weather === 'rain') {
      sounds.rainLoop.start()
    } else {
      sounds.rainLoop.stop()
    }
    if (weather !== 'rain') return

    const pos = rainRef.current.geometry.attributes.position.array
    const camPos = useStore.getState().playerPosRef.current

    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3 + 1] -= 15 * delta // Fall speed
      if (pos[i * 3 + 1] < (camPos[1] - 10)) {
        pos[i * 3] = camPos[0] + (Math.random() - 0.5) * 40
        pos[i * 3 + 1] = camPos[1] + 20
        pos[i * 3 + 2] = camPos[2] + (Math.random() - 0.5) * 40
      }
    }
    rainRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={rainRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={RAIN_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#aaccff"
        size={0.05}
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
