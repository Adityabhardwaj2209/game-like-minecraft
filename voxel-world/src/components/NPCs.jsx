import { useFrame } from '@react-three/fiber'
import { useRef, useMemo, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useStore } from '../store/useStore'
import { useGameStore } from '../store/useGameStore'
import { Vector3 } from 'three'
import { checkVoxelCollision, getHighestWalkableBlockY } from '../utils/physics'
import { sounds } from '../utils/sounds'

const NPCAvatar = ({ color }) => (
  <group position={[0, -0.5, 0]}>
    <mesh position={[0, 0, 0]}><boxGeometry args={[0.4, 0.4, 0.4]} /><meshStandardMaterial color="#d8b08a" roughness={0.85} /></mesh>
    <mesh position={[0, -0.6, 0]}><boxGeometry args={[0.5, 0.8, 0.3]} /><meshStandardMaterial color={color} roughness={0.75} /></mesh>
    <mesh position={[-0.35, -0.6, 0]}><boxGeometry args={[0.15, 0.8, 0.15]} /><meshStandardMaterial color="#d8b08a" roughness={0.85} /></mesh>
    <mesh position={[0.35, -0.6, 0]}><boxGeometry args={[0.15, 0.8, 0.15]} /><meshStandardMaterial color="#d8b08a" roughness={0.85} /></mesh>
    <mesh position={[-0.15, -1.3, 0]}><boxGeometry args={[0.2, 0.6, 0.2]} /><meshStandardMaterial color="#3b3f45" roughness={0.8} /></mesh>
    <mesh position={[0.15, -1.3, 0]}><boxGeometry args={[0.2, 0.6, 0.2]} /><meshStandardMaterial color="#3b3f45" roughness={0.8} /></mesh>
  </group>
)

const AnimalAvatar = ({ type }) => {
  if (type === 'pig') return (
    <group position={[0, -1.0, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.4, 0.4, 0.6]} /><meshStandardMaterial color="#f2a7b3" roughness={0.9} /></mesh>
      <mesh position={[0, 0.2, 0.3]}><boxGeometry args={[0.3, 0.3, 0.3]} /><meshStandardMaterial color="#eca0ac" roughness={0.9} /></mesh>
      <mesh position={[-0.15, -0.3, 0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#d9a196" roughness={0.85} /></mesh>
      <mesh position={[0.15, -0.3, 0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#d9a196" roughness={0.85} /></mesh>
      <mesh position={[-0.15, -0.3, -0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#d9a196" roughness={0.85} /></mesh>
      <mesh position={[0.15, -0.3, -0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#d9a196" roughness={0.85} /></mesh>
    </group>
  )
  if (type === 'cow') return (
    <group position={[0, -0.8, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.5, 0.5, 0.8]} /><meshStandardMaterial color="#4b3627" roughness={0.95} /></mesh>
      <mesh position={[0, 0.3, 0.4]}><boxGeometry args={[0.3, 0.3, 0.3]} /><meshStandardMaterial color="#f5f5f0" roughness={0.92} /></mesh>
      <mesh position={[0.12, 0.08, 0.1]}><boxGeometry args={[0.16, 0.16, 0.16]} /><meshStandardMaterial color="#f1eee8" roughness={0.93} /></mesh>
      <mesh position={[-0.14, -0.02, -0.12]}><boxGeometry args={[0.14, 0.14, 0.14]} /><meshStandardMaterial color="#f1eee8" roughness={0.93} /></mesh>
      <mesh position={[-0.2, -0.4, 0.3]}><boxGeometry args={[0.15, 0.4, 0.15]} /><meshStandardMaterial color="#b39a7a" roughness={0.9} /></mesh>
      <mesh position={[0.2, -0.4, 0.3]}><boxGeometry args={[0.15, 0.4, 0.15]} /><meshStandardMaterial color="#b39a7a" roughness={0.9} /></mesh>
      <mesh position={[-0.2, -0.4, -0.3]}><boxGeometry args={[0.15, 0.4, 0.15]} /><meshStandardMaterial color="#b39a7a" roughness={0.9} /></mesh>
      <mesh position={[0.2, -0.4, -0.3]}><boxGeometry args={[0.15, 0.4, 0.15]} /><meshStandardMaterial color="#b39a7a" roughness={0.9} /></mesh>
    </group>
  )
  if (type === 'sheep') return (
    <group position={[0, -0.9, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.5, 0.5, 0.6]} /><meshStandardMaterial color="#f7f7f2" roughness={1} /></mesh>
      <mesh position={[0, 0.2, 0.3]}><boxGeometry args={[0.25, 0.25, 0.25]} /><meshStandardMaterial color="#c9c9c1" roughness={0.95} /></mesh>
      <mesh position={[-0.2, -0.3, 0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#4f4f4f" roughness={0.85} /></mesh>
      <mesh position={[0.2, -0.3, 0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#4f4f4f" roughness={0.85} /></mesh>
      <mesh position={[-0.2, -0.3, -0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#4f4f4f" roughness={0.85} /></mesh>
      <mesh position={[0.2, -0.3, -0.2]}><boxGeometry args={[0.1, 0.3, 0.1]} /><meshStandardMaterial color="#4f4f4f" roughness={0.85} /></mesh>
    </group>
  )
  if (type === 'chicken') return (
    <group position={[0, -1.2, 0]}>
      <mesh position={[0, 0, 0]}><boxGeometry args={[0.25, 0.25, 0.3]} /><meshStandardMaterial color="#f3f3e8" roughness={0.95} /></mesh>
      <mesh position={[0, 0.2, 0.15]}><boxGeometry args={[0.15, 0.15, 0.15]} /><meshStandardMaterial color="#f3f3e8" roughness={0.95} /></mesh>
      <mesh position={[0, 0.2, 0.24]}><boxGeometry args={[0.07, 0.05, 0.03]} /><meshStandardMaterial color="#f4a62a" roughness={0.85} /></mesh>
      {/* 2 Legs only */}
      <mesh position={[-0.1, -0.2, 0]}><boxGeometry args={[0.05, 0.2, 0.05]} /><meshStandardMaterial color="#d6861d" roughness={0.85} /></mesh>
      <mesh position={[0.1, -0.2, 0]}><boxGeometry args={[0.05, 0.2, 0.05]} /><meshStandardMaterial color="#d6861d" roughness={0.85} /></mesh>
    </group>
  )
  return null
}

export function NPCs() {
   const { camera } = useThree()
   const addCube = useStore(state => state.addCube)
   const removeCube = useStore(state => state.removeCube)
   const timeOfDay = useGameStore(state => state.timeOfDay)
   const addScore = useGameStore(state => state.addScore)
   const playerPosRef = useStore(state => state.playerPosRef)

   const getPhase = (t) => {
      if (t < 0.2 || t > 0.8) return 'night'
      if (t < 0.3) return 'dawn'
      if (t < 0.7) return 'day'
      return 'evening'
   }

   const phase = getPhase(timeOfDay)

   const roleDialogues = {
      police: {
         night: ['Move along, area secure.', 'Night patrol in progress.', 'Stay alert.'],
         day: ['Off shift. Keeping watch.', 'Quiet day on the island.'],
         dawn: ['Shift handover at dawn.', 'Long night, still standing.'],
         evening: ['Prepping for patrol.']
      },
      farmer: {
         day: ['Harvest looks good today.', 'Tilling the soil.', 'Need more water for crops.'],
         dawn: ['Early start in the fields.', 'Sun is up, time to work.'],
         evening: ['Wrapping up farm work.', 'Heading home before dark.'],
         night: ['Too dark to farm. Sleeping.', 'Farm can wait until sunrise.']
      },
      townfolk: {
         day: ['Market is open today.', 'Nice weather for a walk.'],
         dawn: ['Another day in Block City.'],
         evening: ['Going home for dinner.', 'See you tomorrow.'],
         night: ['Keeping indoors tonight.', 'Lock your doors, skeletons roam.']
      },
      animal: {
         day: ['*sniff*', '*graze*'],
         dawn: ['*rustle*'],
         evening: ['*wanders back to pen*'],
         night: ['*sleeping*']
      }
   }

   const randomDialogue = (role, nowPhase) => {
      const lines = roleDialogues[role]?.[nowPhase] || ['...']
      return lines[Math.floor(Math.random() * lines.length)]
   }

   // Spawn 8 autonomous citizens and 8 animals.
   const npcs = useMemo(() => {
      const cubesMap = useStore.getState().cubesMap
      const getRole = (i) => {
         if (i >= 8) return 'animal'
         if (i < 3) return 'police'
         if (i < 6) return 'farmer'
         return 'townfolk'
      }
      const getAnimalType = (i) => ['pig', 'cow', 'sheep', 'chicken'][i % 4]
      return Array(16).fill().map((_, i) => {
         const startX = Math.random()*40 - 20
         const startZ = Math.random()*40 - 20
         const startY = getHighestWalkableBlockY(startX, startZ, cubesMap) + 2 // Start on walkable ground
         const role = getRole(i)

         return {
            id: i,
            pos: new Vector3(startX, startY, startZ),
            velocity: new Vector3(0,0,0),
            target: null,
            role,
            animalType: role === 'animal' ? getAnimalType(i) : null,
            color: role === 'police' ? '#22313f' : role === 'farmer' ? '#6b8e23' : '#4f3f78',
            actionTimer: Math.random() * 3,
            dialogTimer: 2 + Math.random() * 6,
            dialogue: '...',
            alive: true,
            showDialogue: false,
            labelTimer: Math.random() * 0.3,
            homePos: new Vector3(startX, startY, startZ),
            isGrounded: true
         }
      })
   }, [])

   const groupRefs = useRef([])
   const aimDir = useMemo(() => new Vector3(), [])
   const toNpc = useMemo(() => new Vector3(), [])

   useEffect(() => {
      const onMouseDown = (e) => {
        if (e.button !== 0 || !document.pointerLockElement) return

        camera.getWorldDirection(aimDir).normalize()

        let best = null
        let bestDot = 0.985 // narrow "aimed at" cone
        let bestDistance = Infinity

        npcs.forEach((npc) => {
          if (!npc.alive) return
          toNpc.set(
            npc.pos.x - camera.position.x,
            (npc.pos.y + 0.6) - camera.position.y,
            npc.pos.z - camera.position.z
          )
          const dist = toNpc.length()
          if (dist > 40) return
          const dot = toNpc.normalize().dot(aimDir)
          if (dot > bestDot || (dot > 0.98 && dist < bestDistance * 0.75)) {
            bestDot = dot
            bestDistance = dist
            best = npc
          }
        })

        if (best) {
          best.alive = false
          best.dialogue = '...'
          sounds.enemyDeath()
          addScore(best.role === 'animal' ? 15 : 35)
        }
      }

      window.addEventListener('mousedown', onMouseDown)
      return () => window.removeEventListener('mousedown', onMouseDown)
   }, [camera, npcs, aimDir, toNpc, addScore])

   useFrame((state, delta) => {
       const cubesMap = useStore.getState().cubesMap
       const time = state.clock.getElapsedTime()

       npcs.forEach((npc, i) => {
           const ref = groupRefs.current[i]
           if (!ref) return
          if (!npc.alive) {
            ref.visible = false
            return
          }
          ref.visible = true

          // Scheduled dialogues
          npc.dialogTimer -= delta
          if (npc.dialogTimer <= 0) {
            npc.dialogue = randomDialogue(npc.role, phase)
            npc.dialogTimer = 4 + Math.random() * 7
          }
          npc.labelTimer -= delta
          if (npc.labelTimer <= 0) {
            const px = playerPosRef.current[0]
            const pz = playerPosRef.current[2]
            const dxp = npc.pos.x - px
            const dzp = npc.pos.z - pz
            const playerDist = Math.sqrt(dxp * dxp + dzp * dzp)
            npc.showDialogue = npc.role !== 'animal' && playerDist < 12
            npc.labelTimer = 0.25
          }

          const isNight = phase === 'night'
          const farmerWorking = npc.role === 'farmer' && (phase === 'dawn' || phase === 'day')
          const farmerSleeping = npc.role === 'farmer' && (phase === 'evening' || phase === 'night')
          const policePatrol = npc.role === 'police' && isNight

           // 1. AI Decision Loop
           if (!npc.target) {
               npc.actionTimer -= delta
               if (npc.actionTimer <= 0) {
                  if (farmerSleeping) {
                    // Farmers return to home and "sleep" after evening.
                    npc.target = npc.homePos.clone()
                  } else if (policePatrol) {
                    // Police actively patrol in wider radius during night.
                    npc.target = new Vector3(
                      npc.pos.x + (Math.random() * 36 - 18),
                      0,
                      npc.pos.z + (Math.random() * 36 - 18)
                    )
                  } else {
                    // General wandering for day routines.
                    npc.target = new Vector3(
                      npc.pos.x + (Math.random() * 30 - 15),
                      0,
                      npc.pos.z + (Math.random() * 30 - 15)
                    )
                  }
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
                       
                       if (npc.role === 'farmer' && farmerWorking) {
                           // Farmers maintain farmland by placing dirt patches.
                           addCube(tx, ty, tz, 'dirt')
                       } else if (npc.role === 'police' && policePatrol) {
                           // Police clear obstacles while patrolling.
                           const block = cubesMap[`${tx},${ty},${tz}`]
                           if (block && block.type !== 'water') removeCube(tx, ty, tz)
                       }
                   }
                   npc.target = null
                   npc.actionTimer = 2 + Math.random() * 5 // wait randomly
                   npc.velocity.x = 0
                   npc.velocity.z = 0
               } else {
                   // Move linearly
                   let speed = npc.role === 'animal' ? 1.5 : 2.2
                   if (policePatrol) speed = 3.0
                   if (farmerSleeping) speed = 1.6
                   npc.velocity.x = (dx / dist) * speed
                   npc.velocity.z = (dz / dist) * speed
                   
                   // Rotate
                   ref.rotation.y = Math.atan2(npc.velocity.x, npc.velocity.z)
                   
                   // Walk animation
                   const legRot = Math.sin(time * 15) * 0.5
                   if (npc.role === 'animal') {
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

          if (farmerSleeping) {
            // Farmers stay mostly still once they reach home at night.
            const hx = npc.homePos.x - npc.pos.x
            const hz = npc.homePos.z - npc.pos.z
            const hDist = Math.sqrt(hx * hx + hz * hz)
            if (hDist < 1.8) {
              npc.velocity.x = 0
              npc.velocity.z = 0
            }
          }

           // 2. Physics & Navigation
           npc.velocity.y -= 30 * delta

           const isSafeToStep = (nx, nz) => {
               const floorY = getHighestWalkableBlockY(nx, nz, cubesMap)
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

          // Keep NPCs/animals glued to walkable terrain when close to ground.
          const groundY = getHighestWalkableBlockY(npc.pos.x, npc.pos.z, cubesMap) + 1.8
          if (Math.abs(npc.pos.y - groundY) < 0.5) {
            npc.pos.y = groundY
            npc.velocity.y = Math.min(0, npc.velocity.y)
            npc.isGrounded = true
          }

           ref.position.copy(npc.pos)
       })
   })

   return (
       <>
          {npcs.map((npc, i) => (
             <group key={npc.id} ref={el => groupRefs.current[i] = el}>
                {npc.alive && (npc.role === 'animal' ? (
                   <AnimalAvatar type={npc.animalType} />
                ) : (
                   <NPCAvatar color={npc.color} />
                ))}
                {npc.alive && npc.showDialogue && (
                  <Html position={[0, 1.3, 0]} center distanceFactor={18}>
                    <div style={{
                      background: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      fontSize: 11,
                      padding: '3px 7px',
                      borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.2)',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none'
                    }}>
                      {npc.role.toUpperCase()}: {npc.dialogue}
                    </div>
                  </Html>
                )}
             </group>
          ))}
       </>
   )
}
