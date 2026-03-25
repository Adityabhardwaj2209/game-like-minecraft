import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { Vector3 } from 'three'
import { checkVoxelCollision, getHighestBlockY } from '../utils/physics'

const NPCAvatar = ({ color }) => (
  <group position={[0, -0.5, 0]}>
    <mesh position={[0, 0, 0]}><boxGeometry args={[0.4, 0.4, 0.4]} /><meshStandardMaterial color="#f1c27d" /></mesh>
    <mesh position={[0, -0.6, 0]}><boxGeometry args={[0.5, 0.8, 0.3]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[-0.35, -0.6, 0]}><boxGeometry args={[0.15, 0.8, 0.15]} /><meshStandardMaterial color="#f1c27d" /></mesh>
    <mesh position={[0.35, -0.6, 0]}><boxGeometry args={[0.15, 0.8, 0.15]} /><meshStandardMaterial color="#f1c27d" /></mesh>
    <mesh position={[-0.15, -1.3, 0]}><boxGeometry args={[0.2, 0.6, 0.2]} /><meshStandardMaterial color="#2c3e50" /></mesh>
    <mesh position={[0.15, -1.3, 0]}><boxGeometry args={[0.2, 0.6, 0.2]} /><meshStandardMaterial color="#2c3e50" /></mesh>
  </group>
)

const AnimalAvatar = ({ type }) => {
  if (type === 'pig') return (
    <group position={[0, -1.0, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.4, 0.4, 0.6]} /><meshStandardMaterial color="pink" /></mesh>
      <mesh position={[0, 0.2, 0.3]}><boxGeometry args={[0.3, 0.3, 0.3]} /><meshStandardMaterial color="pink" /></mesh>
      <mesh position={[-0.15, -0.3, 0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="pink" /></mesh>
      <mesh position={[0.15, -0.3, 0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="pink" /></mesh>
      <mesh position={[-0.15, -0.3, -0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="pink" /></mesh>
      <mesh position={[0.15, -0.3, -0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="pink" /></mesh>
    </group>
  )
  if (type === 'cow') return (
    <group position={[0, -0.8, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.5, 0.5, 0.8]} /><meshStandardMaterial color="#8B4513" /></mesh>
      <mesh position={[0, 0.3, 0.4]}><boxGeometry args={[0.3, 0.3, 0.3]} /><meshStandardMaterial color="white" /></mesh>
      <mesh position={[-0.2, -0.4, 0.3]}><boxGeometry args={[0.15, 0.4, 0.15]} /><meshStandardMaterial color="white" /></mesh>
      <mesh position={[0.2, -0.4, 0.3]}><boxGeometry args={[0.15, 0.4, 0.15]} /><meshStandardMaterial color="white" /></mesh>
      <mesh position={[-0.2, -0.4, -0.3]}><boxGeometry args={[0.15, 0.4, 0.15]} /><meshStandardMaterial color="white" /></mesh>
      <mesh position={[0.2, -0.4, -0.3]}><boxGeometry args={[0.15, 0.4, 0.15]} /><meshStandardMaterial color="white" /></mesh>
    </group>
  )
  if (type === 'sheep') return (
    <group position={[0, -0.9, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.5, 0.5, 0.6]} /><meshStandardMaterial color="white" /></mesh>
      <mesh position={[0, 0.2, 0.3]}><boxGeometry args={[0.25, 0.25, 0.25]} /><meshStandardMaterial color="lightgrey" /></mesh>
      <mesh position={[-0.2, -0.3, 0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="lightgrey" /></mesh>
      <mesh position={[0.2, -0.3, 0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="lightgrey" /></mesh>
      <mesh position={[-0.2, -0.3, -0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="lightgrey" /></mesh>
      <mesh position={[0.2, -0.3, -0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="lightgrey" /></mesh>
    </group>
  )
  if (type === 'chicken') return (
    <group position={[0, -1.2, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.25, 0.25, 0.3]} /><meshStandardMaterial color="white" /></mesh>
      <mesh position={[0, 0.2, 0.15]}><boxGeometry args={[0.15, 0.15, 0.15]} /><meshStandardMaterial color="white" /></mesh>
      {/* 2 Legs only */}
      <mesh position={[-0.1, -0.2, 0]}><boxGeometry args={[0.05, 0.2, 0.05]} /><meshStandardMaterial color="orange" /></mesh>
      <mesh position={[0.1, -0.2, 0]}><boxGeometry args={[0.05, 0.2, 0.05]} /><meshStandardMaterial color="orange" /></mesh>
    </group>
  )
  return null
}

export function NPCs() {
   const addCube = useStore(state => state.addCube)
   const removeCube = useStore(state => state.removeCube)

   // Spawn 8 autonomous NPCs and 8 Animals
   const npcs = useMemo(() => {
      const cubesMap = useStore.getState().cubesMap
      const getJob = (i) => i < 8 ? (i % 2 === 0 ? 'builder' : 'miner') : 'animal'
      const getAnimalType = (i) => ['pig', 'cow', 'sheep', 'chicken'][i % 4]
      return Array(16).fill().map((_, i) => {
         const startX = Math.random()*40 - 20
         const startZ = Math.random()*40 - 20
         const startY = getHighestBlockY(startX, startZ, cubesMap) + 2 // Start on ground

         return {
            id: i,
            pos: new Vector3(startX, startY, startZ),
            velocity: new Vector3(0,0,0),
            target: null,
            job: getJob(i),
            animalType: getJob(i) === 'animal' ? getAnimalType(i) : null,
            color: i % 2 === 0 ? '#f1c40f' : '#95a5a6', // Builders are Yellow, Miners are Grey
            actionTimer: Math.random() * 3,
            isGrounded: true
         }
      })
   }, [])

   const groupRefs = useRef([])

   useFrame((state, delta) => {
       const cubesMap = useStore.getState().cubesMap
       const time = state.clock.getElapsedTime()

       npcs.forEach((npc, i) => {
           const ref = groupRefs.current[i]
           if (!ref) return

           // 1. AI Decision Loop
           if (!npc.target) {
               npc.actionTimer -= delta
               if (npc.actionTimer <= 0) {
                   // Pick a new target 15 units away
                   npc.target = new Vector3(
                       npc.pos.x + (Math.random() * 30 - 15), 
                       0, 
                       npc.pos.z + (Math.random() * 30 - 15)
                   )
               }
           } else {
               const dx = npc.target.x - npc.pos.x
               const dz = npc.target.z - npc.pos.z
               const dist = Math.sqrt(dx*dx + dz*dz)

               if (dist < 1.5) {
                   // Arrived at destination! Work logic.
                   if (npc.isGrounded) {
                       const front = new Vector3(0,0,1).applyEuler(ref.rotation).round()
                       const tx = Math.round(npc.pos.x) + front.x
                       const tz = Math.round(npc.pos.z) + front.z
                       const ty = Math.round(npc.pos.y)
                       
                       if (npc.job === 'builder') {
                           // Build wood pillar
                           addCube(tx, ty, tz, 'wood')
                           addCube(tx, ty+1, tz, 'wood')
                       } else if (npc.job === 'miner') {
                           // Try to destroy the block immediately in front and above
                           const block1 = cubesMap[`${tx},${ty},${tz}`]
                           const block2 = cubesMap[`${tx},${ty+1},${tz}`]
                           if (block1 && block1.type !== 'water') removeCube(tx, ty, tz)
                           if (block2 && block2.type !== 'water') removeCube(tx, ty+1, tz)
                       }
                   }
                   npc.target = null
                   npc.actionTimer = 2 + Math.random() * 5 // wait randomly
                   npc.velocity.x = 0
                   npc.velocity.z = 0
               } else {
                   // Move linearly
                   const speed = npc.job === 'animal' ? 1.5 : 2.5
                   npc.velocity.x = (dx / dist) * speed
                   npc.velocity.z = (dz / dist) * speed
                   
                   // Rotate
                   ref.rotation.y = Math.atan2(npc.velocity.x, npc.velocity.z)
                   
                   // Walk animation
                   const legRot = Math.sin(time * 15) * 0.5
                   if (npc.job === 'animal') {
                       if (ref.children[0].children.length >= 4) {
                           // 4 legs or 2 legs depending on model, legs start at index 2
                           if (npc.animalType === 'chicken') {
                               ref.children[0].children[2].rotation.x = -legRot
                               ref.children[0].children[3].rotation.x = legRot
                           } else {
                               ref.children[0].children[2].rotation.x = -legRot
                               ref.children[0].children[3].rotation.x = legRot
                               ref.children[0].children[4].rotation.x = legRot
                               ref.children[0].children[5].rotation.x = -legRot
                           }
                       }
                   } else {
                       ref.children[0].children[4].rotation.x = -legRot
                       ref.children[0].children[5].rotation.x = legRot
                       ref.children[0].children[2].rotation.x = legRot
                       ref.children[0].children[3].rotation.x = -legRot
                   }
               }
           }

           // 2. Physics & Navigation
           npc.velocity.y -= 30 * delta

           const isSafeToStep = (nx, nz) => {
               const floorY = getHighestBlockY(nx, nz, cubesMap)
               const block = cubesMap[`${Math.round(nx)},${floorY},${Math.round(nz)}`]
               if (block && block.type === 'water') return false // Dont step in water
               return true
           }

           // X Collision
           const tempX = npc.pos.x + npc.velocity.x * delta
           if (isSafeToStep(tempX, npc.pos.z)) {
               if (!checkVoxelCollision(tempX, npc.pos.y, npc.pos.z, cubesMap, 1.3, false)) {
                   npc.pos.x = tempX
               } else { 
                   npc.velocity.x = 0
                   if (npc.isGrounded) npc.velocity.y = 8 // Jump!
               }
           } else {
               npc.velocity.x = 0
               npc.target = null // Cancel target to avoid water
           }

           // Z Collision
           const tempZ = npc.pos.z + npc.velocity.z * delta
           if (isSafeToStep(npc.pos.x, tempZ)) {
               if (!checkVoxelCollision(npc.pos.x, npc.pos.y, tempZ, cubesMap, 1.3, false)) {
                   npc.pos.z = tempZ
               } else { 
                   npc.velocity.z = 0 
                   if (npc.isGrounded) npc.velocity.y = 8 // Jump!
               }
           } else {
               npc.velocity.z = 0
               npc.target = null
           }

           // Y Collision
           const tempY = npc.pos.y + npc.velocity.y * delta
           if (npc.velocity.y < 0) {
               const feetY = Math.round(tempY - 1.3)
               const block = cubesMap[`${Math.round(npc.pos.x)},${feetY},${Math.round(npc.pos.z)}`]
               if (block && block.type !== 'water' && block.type !== 'leaves') {
                   npc.velocity.y = 0
                   npc.pos.y = feetY + 1.8 // Rest on top
                   npc.isGrounded = true
               } else {
                   npc.pos.y = tempY
                   npc.isGrounded = false
               }
           } else if (npc.velocity.y > 0) {
               const headY = Math.round(tempY + 0.3)
               if (cubesMap[`${Math.round(npc.pos.x)},${headY},${Math.round(npc.pos.z)}`]) {
                   npc.velocity.y = 0
               } else { npc.pos.y = tempY }
           }

           if (npc.pos.y < -10) npc.pos.y = 20

           ref.position.copy(npc.pos)
       })
   })

   return (
       <>
          {npcs.map((npc, i) => (
             <group key={npc.id} ref={el => groupRefs.current[i] = el}>
                {npc.job === 'animal' ? (
                   <AnimalAvatar type={npc.animalType} />
                ) : (
                   <NPCAvatar color={npc.color} />
                )}
             </group>
          ))}
       </>
   )
}
