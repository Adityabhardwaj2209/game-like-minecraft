import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { useGameStore } from '../store/useGameStore'

const WheatStalk = ({ growthStage }) => {
  const h = 0.1 + growthStage * 0.4
  const color = growthStage > 0.8 ? '#f1c40f' : growthStage > 0.4 ? '#a8e063' : '#4caf50'
  return (
    <mesh position={[0, h / 2, 0]}>
      <boxGeometry args={[0.05, h, 0.05]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function Farming() {
  const farms = useMemo(() => {
    const map = useStore.getState().cubesMap
    const result = []
    // Place 4 farm patches near the origin
    const patches = [[5,5],[5,-5],[-5,5],[-5,-5]]
    patches.forEach(([px, pz]) => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const x = px + i
          const z = pz + j
          // Determine the Y level at this position
          let groundY = 2
          for (let y = 20; y >= -10; y--) {
            if (map[`${x},${y},${z}`]) { groundY = y; break }
          }
          result.push({ id: `${x}_${z}`, x, y: groundY + 1, z, growth: Math.random() * 0.5 })
        }
      }
    })
    return result
  }, [])

  const farmRef = useRef(farms)
  farmRef.current = farms

  useFrame((_, delta) => {
    // Grow slowly over time
    farmRef.current.forEach(f => {
      if (f.growth < 1) f.growth += delta * 0.01 // 100s to fully grow
    })
  })

  return (
    <>
      {farms.map(farm => (
        <group key={farm.id} position={[farm.x, farm.y, farm.z]}>
          {/* Farmland block — slightly brown */}
          <mesh position={[0, -0.55, 0]}>
            <boxGeometry args={[1, 0.1, 1]} />
            <meshStandardMaterial color="#8B5E3C" />
          </mesh>
          <WheatStalk growthStage={farm.growth} />
        </group>
      ))}
    </>
  )
}
