import { useRef, useLayoutEffect, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { useMissionStore } from '../store/useMissionStore'
import { Matrix4, Vector3 } from 'three'
import { sounds } from '../utils/sounds'
import { grassTexture, dirtTexture, stoneTexture, woodTexture, glassTexture, waterTexture, leavesTexture } from '../textures'

const blockTypes = {
  grass: grassTexture,
  dirt: dirtTexture,
  stone: stoneTexture,
  wood: woodTexture,
  glass: glassTexture,
  water: waterTexture,
  leaves: leavesTexture
}

const InstancedBlocks = ({ type, texture, cubes }) => {
  const meshRef = useRef()
  const tempMatrix = useMemo(() => new Matrix4(), [])
  const tempPos = useMemo(() => new Vector3(), [])

  useLayoutEffect(() => {
    if (meshRef.current) {
      cubes.forEach((cube, index) => {
        tempPos.set(cube.pos[0], cube.pos[1], cube.pos[2])
        tempMatrix.setPosition(tempPos)
        meshRef.current.setMatrixAt(index, tempMatrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  }, [cubes, tempMatrix, tempPos])

  if (!cubes.length) return null

  const isTransparent = type === 'glass' || type === 'water'

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, cubes.length]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} transparent={isTransparent} opacity={isTransparent ? 0.6 : 1} />
    </instancedMesh>
  )
}

export function Cubes() {
  const cubes = useStore((state) => state.cubes)
  const addCube = useStore((state) => state.addCube)
  const removeCube = useStore((state) => state.removeCube)
  const missionProgress = useMissionStore(s => s.progress)

  const cubesByType = useMemo(() => {
    const grouped = {}
    Object.keys(blockTypes).forEach(t => grouped[t] = [])
    cubes.forEach(c => grouped[c.type].push(c))
    return grouped
  }, [cubes])

  return (
    <group
      onPointerDown={(e) => {
        e.stopPropagation()
        const normal = e.face.normal.clone().transformDirection(e.eventObject.matrixWorld).round()
        const center = e.point.clone().sub(normal.clone().multiplyScalar(0.5)).round()
        
        if (e.button === 0) {
          removeCube(center.x, center.y, center.z)
          sounds.blockBreak(blockHit?.type)
          missionProgress('destroy_base', 1)
        } else if (e.button === 2) {
          addCube(center.x + normal.x, center.y + normal.y, center.z + normal.z)
          sounds.blockPlace()
          missionProgress('build', 1)
        }
      }}
    >
      {Object.entries(blockTypes).map(([type, texture]) => (
        <InstancedBlocks key={type} type={type} texture={texture} cubes={cubesByType[type]} />
      ))}
    </group>
  )
}
