import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { asphaltTexture, concreteTexture, glassTexture } from '../textures'

const Car = ({ position, type = 'sedan', color = '#ff6b35', isMoving = false, path = null }) => {
  const carRef = useRef()
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  
  useFrame((state) => {
    if (isMoving && path && path.length > 0 && carRef.current) {
      const time = state.clock.getElapsedTime()
      const speed = 0.05
      
      // Move along path
      const targetPoint = path[currentPathIndex]
      const currentPos = carRef.current.position
      
      const direction = new THREE.Vector3(
        targetPoint[0] - currentPos.x,
        0,
        targetPoint[2] - currentPos.z
      ).normalize()
      
      currentPos.x += direction.x * speed
      currentPos.z += direction.z * speed
      
      // Rotate to face direction
      const angle = Math.atan2(direction.x, direction.z)
      carRef.current.rotation.y = angle
      
      // Check if reached waypoint
      const distance = Math.sqrt(
        Math.pow(targetPoint[0] - currentPos.x, 2) + 
        Math.pow(targetPoint[2] - currentPos.z, 2)
      )
      
      if (distance < 1) {
        setCurrentPathIndex((prev) => (prev + 1) % path.length)
      }
    }
  })

  const carGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.6,
      metalness: 0.3
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.set(0, 0.75, 0)
    group.add(body)
    
    // Car roof
    const roofGeometry = new THREE.BoxGeometry(2.5, 1, 1.8)
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.6,
      metalness: 0.3
    })
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.set(0, 1.75, 0)
    group.add(roof)
    
    // Windows
    const windowMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7
    })
    
    // Front windshield
    const frontWindshieldGeometry = new THREE.BoxGeometry(1.8, 0.8, 0.1)
    const frontWindshield = new THREE.Mesh(frontWindshieldGeometry, windowMaterial)
    frontWindshield.position.set(0.5, 2, 0.9)
    frontWindshield.rotation.x = -0.3
    group.add(frontWindshield)
    
    // Rear windshield
    const rearWindshieldGeometry = new THREE.BoxGeometry(1.8, 0.8, 0.1)
    const rearWindshield = new THREE.Mesh(rearWindshieldGeometry, windowMaterial)
    rearWindshield.position.set(-0.5, 2, -0.9)
    rearWindshield.rotation.x = 0.3
    group.add(rearWindshield)
    
    // Side windows
    const sideWindowGeometry = new THREE.BoxGeometry(0.1, 0.7, 1.6)
    const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial)
    leftWindow.position.set(1.25, 2, 0)
    group.add(leftWindow)
    
    const rightWindow = leftWindow.clone()
    rightWindow.position.set(-1.25, 2, 0)
    group.add(rightWindow)
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8)
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.8
    })
    
    const wheelPositions = [
      [1.2, 0.4, 0.8], [-1.2, 0.4, 0.8],
      [1.2, 0.4, -0.8], [-1.2, 0.4, -0.8]
    ]
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.position.set(...pos)
      wheel.rotation.z = Math.PI / 2
      group.add(wheel)
    })
    
    // Headlights
    const headlightGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.2)
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 0.3
    })
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial)
    leftHeadlight.position.set(2, 0.8, 0.6)
    group.add(leftHeadlight)
    
    const rightHeadlight = leftHeadlight.clone()
    rightHeadlight.position.set(2, 0.8, -0.6)
    group.add(rightHeadlight)
    
    // Taillights
    const taillightGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.2)
    const taillightMaterial = new THREE.MeshStandardMaterial({
      color: '#ff0000',
      emissive: '#ff0000',
      emissiveIntensity: 0.2
    })
    
    const leftTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial)
    leftTaillight.position.set(-2, 0.8, 0.6)
    group.add(leftTaillight)
    
    const rightTaillight = leftTaillight.clone()
    rightTaillight.position.set(-2, 0.8, -0.6)
    group.add(rightTaillight)
    
    return group
  }, [color])

  return (
    <group ref={carRef} position={position}>
      <primitive object={carGeometry} />
    </group>
  )
}

const Truck = ({ position, isMoving = false, path = null }) => {
  const truckRef = useRef()
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  
  useFrame((state) => {
    if (isMoving && path && path.length > 0 && truckRef.current) {
      const time = state.clock.getElapsedTime()
      const speed = 0.03 // Slower than cars
      
      const targetPoint = path[currentPathIndex]
      const currentPos = truckRef.current.position
      
      const direction = new THREE.Vector3(
        targetPoint[0] - currentPos.x,
        0,
        targetPoint[2] - currentPos.z
      ).normalize()
      
      currentPos.x += direction.x * speed
      currentPos.z += direction.z * speed
      
      const angle = Math.atan2(direction.x, direction.z)
      truckRef.current.rotation.y = angle
      
      const distance = Math.sqrt(
        Math.pow(targetPoint[0] - currentPos.x, 2) + 
        Math.pow(targetPoint[2] - currentPos.z, 2)
      )
      
      if (distance < 1) {
        setCurrentPathIndex((prev) => (prev + 1) % path.length)
      }
    }
  })

  const truckGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Truck cabin
    const cabinGeometry = new THREE.BoxGeometry(2, 2, 2)
    const cabinMaterial = new THREE.MeshStandardMaterial({
      color: '#3498db',
      roughness: 0.6
    })
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
    cabin.position.set(2, 1, 0)
    group.add(cabin)
    
    // Truck bed
    const bedGeometry = new THREE.BoxGeometry(4, 1.5, 2.5)
    const bedMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.7
    })
    const bed = new THREE.Mesh(bedGeometry, bedMaterial)
    bed.position.set(-1, 0.75, 0)
    group.add(bed)
    
    // Wheels (larger than car wheels)
    const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 8)
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.8
    })
    
    const wheelPositions = [
      [2.5, 0.6, 1], [-0.5, 0.6, 1],
      [2.5, 0.6, -1], [-0.5, 0.6, -1],
      [-2.5, 0.6, 1], [-2.5, 0.6, -1]
    ]
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.position.set(...pos)
      wheel.rotation.z = Math.PI / 2
      group.add(wheel)
    })
    
    return group
  }, [])

  return (
    <group ref={truckRef} position={position}>
      <primitive object={truckGeometry} />
    </group>
  )
}

const WalkingNPC = ({ position, isMoving = false, path = null }) => {
  const npcRef = useRef()
  const [currentPathIndex, setCurrentPathIndex] = useState(0)
  const [walkCycle, setWalkCycle] = useState(0)
  
  useFrame((state) => {
    if (isMoving && path && path.length > 0 && npcRef.current) {
      const time = state.clock.getElapsedTime()
      const speed = 0.02
      
      // Walking animation
      setWalkCycle(time * 5)
      
      const targetPoint = path[currentPathIndex]
      const currentPos = npcRef.current.position
      
      const direction = new THREE.Vector3(
        targetPoint[0] - currentPos.x,
        0,
        targetPoint[2] - currentPos.z
      ).normalize()
      
      currentPos.x += direction.x * speed
      currentPos.z += direction.z * speed
      
      const angle = Math.atan2(direction.x, direction.z)
      npcRef.current.rotation.y = angle
      
      const distance = Math.sqrt(
        Math.pow(targetPoint[0] - currentPos.x, 2) + 
        Math.pow(targetPoint[2] - currentPos.z, 2)
      )
      
      if (distance < 0.5) {
        setCurrentPathIndex((prev) => (prev + 1) % path.length)
      }
    }
  })

  const npcGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Head
    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
    const headMaterial = new THREE.MeshStandardMaterial({
      color: '#d8b08a',
      roughness: 0.85
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.set(0, 1.6, 0)
    group.add(head)
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.75
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.set(0, 0.8, 0)
    group.add(body)
    
    // Arms
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
    
    // Legs
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
    
    return group
  }, [])

  useFrame(() => {
    if (npcRef.current && isMoving) {
      // Animate walking
      const leftLeg = npcRef.current.children.find(child => 
        child.geometry instanceof THREE.BoxGeometry && 
        child.position.x === -0.15 && child.position.y === 0.2
      )
      const rightLeg = npcRef.current.children.find(child => 
        child.geometry instanceof THREE.BoxGeometry && 
        child.position.x === 0.15 && child.position.y === 0.2
      )
      
      if (leftLeg && rightLeg) {
        leftLeg.rotation.x = Math.sin(walkCycle) * 0.3
        rightLeg.rotation.x = -Math.sin(walkCycle) * 0.3
      }
    }
  })

  return (
    <group ref={npcRef} position={position}>
      <primitive object={npcGeometry} />
    </group>
  )
}

export const TrafficSystem = () => {
  // Define paths for vehicles and NPCs
  const mainRoadPath = [
    [0, 0.5, -40], [0, 0.5, -20], [0, 0.5, 0], [0, 0.5, 20], [0, 0.5, 40],
    [20, 0.5, 40], [20, 0.5, 20], [20, 0.5, 0], [20, 0.5, -20], [20, 0.5, -40],
    [0, 0.5, -40]
  ]
  
  const secondaryRoadPath = [
    [-20, 0.5, 0], [0, 0.5, 0], [20, 0.5, 0], [40, 0.5, 0], [40, 0.5, 20],
    [40, 0.5, 0], [20, 0.5, 0], [0, 0.5, 0], [-20, 0.5, 0]
  ]
  
  const sidewalkPath = [
    [5, 0.5, -30], [5, 0.5, -15], [5, 0.5, 0], [5, 0.5, 15], [5, 0.5, 30],
    [5, 0.5, 15], [5, 0.5, 0], [5, 0.5, -15], [5, 0.5, -30]
  ]

  return (
    <group>
      {/* Cars on main road */}
      <Car position={[0, 0.5, -20]} color="#ff6b35" isMoving={true} path={mainRoadPath} />
      <Car position={[10, 0.5, 0]} color="#3498db" isMoving={true} path={mainRoadPath} />
      <Car position={[-10, 0.5, 20]} color="#2ecc71" isMoving={true} path={mainRoadPath} />
      
      {/* Trucks on secondary roads */}
      <Truck position={[-20, 0.5, 0]} isMoving={true} path={secondaryRoadPath} />
      <Truck position={[30, 0.5, 20]} isMoving={true} path={secondaryRoadPath} />
      
      {/* Walking NPCs on sidewalks */}
      <WalkingNPC position={[5, 0.5, -15]} isMoving={true} path={sidewalkPath} />
      <WalkingNPC position={[-5, 0.5, 10]} isMoving={true} path={sidewalkPath} />
      <WalkingNPC position={[5, 0.5, 25]} isMoving={true} path={sidewalkPath} />
      
      {/* Static parked cars */}
      <Car position={[15, 0.5, 15]} color="#9b59b6" isMoving={false} />
      <Car position={[-15, 0.5, -15]} color="#f39c12" isMoving={false} />
      <Car position={[25, 0.5, -25]} color="#1abc9c" isMoving={false} />
    </group>
  )
}
