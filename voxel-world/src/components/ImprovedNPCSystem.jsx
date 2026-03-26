import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { checkVoxelCollision, getHighestWalkableBlockY } from '../utils/physics'

const ImprovedNPC = ({ position, type = 'civilian', patrolPath = null }) => {
  const npcRef = useRef()
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [targetPosition, setTargetPosition] = useState(position)
  const lastPosition = useRef(position)
  const stuckTimer = useRef(0)
  
  useFrame((state) => {
    if (!npcRef.current) return

    const currentTime = state.clock.getElapsedTime()
    const { cubes } = useStore.getState()
    
    // Get current position
    const currentPos = npcRef.current.position
    
    // Check if NPC is stuck (not moving)
    const distanceFromLast = Math.sqrt(
      Math.pow(currentPos.x - lastPosition.current[0], 2) +
      Math.pow(currentPos.z - lastPosition.current[2], 2)
    )
    
    if (distanceFromLast < 0.1) {
      stuckTimer.current += 0.016
      if (stuckTimer.current > 2) {
        // NPC is stuck, find new path
        stuckTimer.current = 0
        findNewTarget()
      }
    } else {
      stuckTimer.current = 0
      lastPosition.current = [currentPos.x, currentPos.y, currentPos.z]
    }
    
    // Ground collision - keep NPC on ground
    const groundY = getHighestWalkableBlockY(currentPos.x, currentPos.z, cubes)
    if (groundY !== null) {
      currentPos.y = groundY + 1.0 // Keep NPC slightly above ground
    }
    
    // Wall collision - prevent moving through blocks
    const nextPos = currentPos.clone()
    const moveSpeed = 0.02
    
    if (patrolPath && patrolPath.length > 0) {
      const target = patrolPath[currentPathIndex]
      const direction = new THREE.Vector3(
        target[0] - currentPos.x,
        0,
        target[2] - currentPos.z
      ).normalize()
      
      nextPos.x += direction.x * moveSpeed
      nextPos.z += direction.z * moveSpeed
      
      // Check collision before moving
      const collision = checkVoxelCollision(nextPos, cubes)
      if (!collision) {
        currentPos.x = nextPos.x
        currentPos.z = nextPos.z
        
        // Face movement direction
        const angle = Math.atan2(direction.x, direction.z)
        currentPos.y = groundY + 1.0
        npcRef.current.rotation.y = angle
        
        // Check if reached waypoint
        const distanceToTarget = Math.sqrt(
          Math.pow(target[0] - currentPos.x, 2) +
          Math.pow(target[2] - currentPos.z, 2)
        )
        
        if (distanceToTarget < 1) {
          setCurrentPathIndex((prev) => (prev + 1) % patrolPath.length)
        }
        
        setIsMoving(true)
      } else {
        // Hit wall, find new path
        findNewTarget()
        setIsMoving(false)
      }
    }
    
    // Add some idle animation
    if (!isMoving) {
      currentPos.y = groundY + 1.0 + Math.sin(currentTime * 2) * 0.05
      npcRef.current.rotation.y = Math.sin(currentTime * 0.5) * 0.1
    }
  })
  
  const findNewTarget = () => {
    if (patrolPath && patrolPath.length > 0) {
      // Find a random point in the patrol path that's not blocked
      const validTargets = patrolPath.filter(target => {
        const collision = checkVoxelCollision(
          new THREE.Vector3(target[0], target[1], target[2]), 
          useStore.getState().cubes
        )
        return !collision
      })
      
      if (validTargets.length > 0) {
        const randomTarget = validTargets[Math.floor(Math.random() * validTargets.length)]
        setTargetPosition(randomTarget)
        const targetIndex = patrolPath.indexOf(randomTarget)
        setCurrentPathIndex(targetIndex >= 0 ? targetIndex : 0)
      }
    }
  }

  const npcGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    if (type === 'civilian') {
      // Civilian NPC
      const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.85
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 1.6, 0)
      group.add(head)
      
      const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: '#3498db',
        roughness: 0.75
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 0.8, 0)
      group.add(body)
      
      const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15)
      const armMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.85
      })
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.35, 0.8, 0)
      group.add(leftArm)
      
      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.35, 0.8, 0)
      group.add(rightArm)
      
      const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2)
      const legMaterial = new THREE.MeshStandardMaterial({
        color: '#3b3f45',
        roughness: 0.8
      })
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.15, 0.2, 0)
      group.add(leftLeg)
      
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.15, 0.2, 0)
      group.add(rightLeg)
      
    } else if (type === 'worker') {
      // Worker NPC
      const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.85
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 1.6, 0)
      group.add(head)
      
      // Hard hat
      const hatGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.5)
      const hatMaterial = new THREE.MeshStandardMaterial({
        color: '#f39c12',
        roughness: 0.7
      })
      const hat = new THREE.Mesh(hatGeometry, hatMaterial)
      hat.position.set(0, 1.9, 0)
      group.add(hat)
      
      const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: '#f39c12',
        roughness: 0.75
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 0.8, 0)
      group.add(body)
      
      const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15)
      const armMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.85
      })
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.35, 0.8, 0)
      group.add(leftArm)
      
      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.35, 0.8, 0)
      group.add(rightArm)
      
      const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2)
      const legMaterial = new THREE.MeshStandardMaterial({
        color: '#2c3e50',
        roughness: 0.8
      })
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.15, 0.2, 0)
      group.add(leftLeg)
      
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.15, 0.2, 0)
      group.add(rightLeg)
      
    } else if (type === 'police') {
      // Police NPC
      const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.85
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 1.6, 0)
      group.add(head)
      
      // Police cap
      const capGeometry = new THREE.BoxGeometry(0.5, 0.15, 0.4)
      const capMaterial = new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.7
      })
      const cap = new THREE.Mesh(capGeometry, capMaterial)
      cap.position.set(0, 1.85, 0)
      group.add(cap)
      
      const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.75
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 0.8, 0)
      group.add(body)
      
      const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15)
      const armMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.85
      })
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.35, 0.8, 0)
      group.add(leftArm)
      
      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.35, 0.8, 0)
      group.add(rightArm)
      
      const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2)
      const legMaterial = new THREE.MeshStandardMaterial({
        color: '#2c3e50',
        roughness: 0.8
      })
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.15, 0.2, 0)
      group.add(leftLeg)
      
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.15, 0.2, 0)
      group.add(rightLeg)
    }
    
    return group
  }, [type])

  return (
    <group ref={npcRef} position={position}>
      <primitive object={npcGeometry} />
    </group>
  )
}

export const ImprovedNPCSystem = () => {
  // Define patrol paths that avoid blocks
  const civilianPaths = [
    // Path around city center
    [[10, 1, 10], [15, 1, 10], [15, 1, 15], [10, 1, 15], [10, 1, 10]],
    [[-10, 1, -10], [-15, 1, -10], [-15, 1, -15], [-10, 1, -15], [-10, 1, -10]],
    [[20, 1, 20], [25, 1, 20], [25, 1, 25], [20, 1, 25], [20, 1, 20]],
    // Path along sidewalks
    [[5, 1, 0], [5, 1, 10], [5, 1, 20], [5, 1, 30], [5, 1, 20], [5, 1, 10], [5, 1, 0]],
    [[-5, 1, 0], [-5, 1, -10], [-5, 1, -20], [-5, 1, -30], [-5, 1, -20], [-5, 1, -10], [-5, 1, 0]]
  ]
  
  const workerPaths = [
    // Construction areas
    [[30, 1, 30], [32, 1, 30], [32, 1, 32], [30, 1, 32], [30, 1, 30]],
    [[-30, 1, -30], [-28, 1, -30], [-28, 1, -28], [-30, 1, -28], [-30, 1, -30]],
    // Building maintenance
    [[40, 1, 0], [42, 1, 0], [42, 1, 2], [40, 1, 2], [40, 1, 0]],
    [[-40, 1, 0], [-38, 1, 0], [-38, 1, 2], [-40, 1, 2], [-40, 1, 0]]
  ]
  
  const policePaths = [
    // Patrol routes
    [[0, 1, 0], [10, 1, 0], [10, 1, 10], [0, 1, 10], [0, 1, 0]],
    [[0, 1, 0], [-10, 1, 0], [-10, 1, 10], [0, 1, 10], [0, 1, 0]],
    [[20, 1, 0], [30, 1, 0], [30, 1, 10], [20, 1, 10], [20, 1, 0]],
    [[-20, 1, 0], [-30, 1, 0], [-30, 1, 10], [-20, 1, 10], [-20, 1, 0]]
  ]

  return (
    <group>
      {/* Civilians */}
      {civilianPaths.map((path, index) => (
        <ImprovedNPC 
          key={`civilian-${index}`}
          position={path[0]} 
          type="civilian" 
          patrolPath={path}
        />
      ))}
      
      {/* Workers */}
      {workerPaths.map((path, index) => (
        <ImprovedNPC 
          key={`worker-${index}`}
          position={path[0]} 
          type="worker" 
          patrolPath={path}
        />
      ))}
      
      {/* Police */}
      {policePaths.map((path, index) => (
        <ImprovedNPC 
          key={`police-${index}`}
          position={path[0]} 
          type="police" 
          patrolPath={path}
        />
      ))}
      
      {/* Static NPCs at specific locations */}
      <ImprovedNPC position={[15, 1, 0]} type="civilian" />
      <ImprovedNPC position={[-15, 1, 0]} type="civilian" />
      <ImprovedNPC position={[0, 1, 15]} type="civilian" />
      <ImprovedNPC position={[0, 1, -15]} type="civilian" />
      <ImprovedNPC position={[25, 1, 25]} type="civilian" />
      <ImprovedNPC position={[-25, 1, -25]} type="civilian" />
      
      <ImprovedNPC position={[35, 1, 35]} type="worker" />
      <ImprovedNPC position={[-35, 1, -35]} type="worker" />
      
      <ImprovedNPC position={[10, 1, 20]} type="police" />
      <ImprovedNPC position={[-10, 1, 20]} type="police" />
      <ImprovedNPC position={[10, 1, -20]} type="police" />
      <ImprovedNPC position={[-10, 1, -20]} type="police" />
    </group>
  )
}
