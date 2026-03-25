import { useMemo, useRef } from 'react'
import { useStore } from '../store/useStore'
import { getHighestBlockY } from '../utils/physics'

// Build a simple enemy stone fortress at (x, z)
const buildFortress = (cx, cz, map, addCube) => {
  const baseBlocks = []

  // First find the ground level
  let groundY = getHighestBlockY(cx, cz, map) + 1

  const W = 7, H = 4, D = 7

  for (let x = -W/2; x <= W/2; x++) {
    for (let z = -D/2; z <= D/2; z++) {
      for (let y = 0; y < H; y++) {
        const isWall = (Math.abs(x) >= W/2 - 0.5 || Math.abs(z) >= D/2 - 0.5)
        const isRoof = y === H - 1
        const isFloor = y === 0
        if (isWall || isRoof || isFloor) {
          const bx = Math.round(cx + x)
          const bz = Math.round(cz + z)
          const by = groundY + y
          baseBlocks.push({ x: bx, y: by, z: bz })
        }
      }
    }
  }
  
  // Add watch towers
  for (const [tx, tz] of [[-3,-3],[3,-3],[-3,3],[3,3]]) {
    for (let y = 0; y < H + 2; y++) {
      baseBlocks.push({ x: Math.round(cx + tx), y: groundY + y, z: Math.round(cz + tz) })
    }
  }

  return baseBlocks
}

export function EnemyBase({ position = [15, 0, 15] }) {
  const cubesMap = useStore(state => state.cubesMap)
  const addCubeRaw = useStore(state => state.addCube)

  const blocks = useMemo(() => {
    return buildFortress(position[0], position[2], cubesMap, addCubeRaw)
  }, [])

  return (
    <>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}
          onPointerDown={(e) => {
            e.stopPropagation()
            // brick-red stone for enemy base
          }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8B0000" roughness={0.9} />
        </mesh>
      ))}

      {/* Red flag on top */}
      <mesh position={[position[0], getHighestBlockY(position[0], position[2], cubesMap) + 7, position[2]]}>
        <boxGeometry args={[0.05, 1.2, 0.05]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[position[0] + 0.2, getHighestBlockY(position[0], position[2], cubesMap) + 7.4, position[2]]}>
        <boxGeometry args={[0.4, 0.3, 0.02]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </>
  )
}
