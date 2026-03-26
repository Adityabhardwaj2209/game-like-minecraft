import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboard } from '../hooks/useKeyboard'
import { useStore } from '../store/useStore'
import * as THREE from 'three'
import { glassTexture } from '../textures'

const PlayerCar = ({ position, onExit }) => {
  const carRef = useRef()
  const { camera } = useThree()
  const [isDriving, setIsDriving] = useState(true)
  const [speed, setSpeed] = useState(0)
  const [rotation, setRotation] = useState(0)
  
  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboard()

  useFrame((state, delta) => {
    if (!carRef.current || !isDriving) return

    const acceleration = 0.5
    const maxSpeed = 15
    const friction = 0.1
    const turnSpeed = 0.03

    // Handle acceleration
    if (moveForward) {
      setSpeed(prev => Math.min(prev + acceleration * delta * 60, maxSpeed))
    } else if (moveBackward) {
      setSpeed(prev => Math.max(prev - acceleration * delta * 60, -maxSpeed / 2))
    } else {
      // Apply friction
      setSpeed(prev => {
        if (Math.abs(prev) < 0.1) return 0
        return prev * (1 - friction * delta * 60)
      })
    }

    // Handle steering (only when moving)
    if (Math.abs(speed) > 0.1) {
      if (moveLeft) {
        setRotation(prev => prev + turnSpeed * Math.sign(speed))
      }
      if (moveRight) {
        setRotation(prev => prev - turnSpeed * Math.sign(speed))
      }
    }

    // Update position
    const forwardVector = new THREE.Vector3(
      Math.sin(rotation) * speed,
      0,
      Math.cos(rotation) * speed
    )

    carRef.current.position.add(forwardVector.multiplyScalar(delta))
    carRef.current.rotation.y = rotation

    // Update camera to follow car
    const cameraOffset = new THREE.Vector3(
      Math.sin(rotation) * -8,
      3,
      Math.cos(rotation) * -8
    )
    camera.position.lerp(
      carRef.current.position.clone().add(cameraOffset),
      0.1
    )
    camera.lookAt(carRef.current.position)

    // Exit vehicle with jump key
    if (jump) {
      setIsDriving(false)
      onExit(carRef.current.position)
    }
  })

  const carGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.6,
      metalness: 0.3
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.set(0, 0.75, 0)
    group.add(body)
    
    // Car roof
    const roofGeometry = new THREE.BoxGeometry(2.5, 1, 1.8)
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: '#c0392b',
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
      emissiveIntensity: 0.5
    })
    
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial)
    leftHeadlight.position.set(2, 0.8, 0.6)
    group.add(leftHeadlight)
    
    const rightHeadlight = leftHeadlight.clone()
    rightHeadlight.position.set(2, 0.8, -0.6)
    group.add(rightHeadlight)
    
    return group
  }, [])

  return (
    <group ref={carRef} position={position}>
      <primitive object={carGeometry} />
      {/* Car lights */}
      <pointLight position={[2, 0.8, 0.6]} intensity={0.5} distance={10} color="#ffffff" />
      <pointLight position={[2, 0.8, -0.6]} intensity={0.5} distance={10} color="#ffffff" />
    </group>
  )
}

const PlayerBike = ({ position, onExit }) => {
  const bikeRef = useRef()
  const { camera } = useThree()
  const [isDriving, setIsDriving] = useState(true)
  const [speed, setSpeed] = useState(0)
  const [rotation, setRotation] = useState(0)
  
  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboard()

  useFrame((state, delta) => {
    if (!bikeRef.current || !isDriving) return

    const acceleration = 0.8
    const maxSpeed = 20
    const friction = 0.15
    const turnSpeed = 0.05

    // Handle acceleration
    if (moveForward) {
      setSpeed(prev => Math.min(prev + acceleration * delta * 60, maxSpeed))
    } else if (moveBackward) {
      setSpeed(prev => Math.max(prev - acceleration * delta * 60, -maxSpeed / 3))
    } else {
      // Apply friction
      setSpeed(prev => {
        if (Math.abs(prev) < 0.1) return 0
        return prev * (1 - friction * delta * 60)
      })
    }

    // Handle steering
    if (Math.abs(speed) > 0.1) {
      if (moveLeft) {
        setRotation(prev => prev + turnSpeed * Math.sign(speed))
      }
      if (moveRight) {
        setRotation(prev => prev - turnSpeed * Math.sign(speed))
      }
    }

    // Update position
    const forwardVector = new THREE.Vector3(
      Math.sin(rotation) * speed,
      0,
      Math.cos(rotation) * speed
    )

    bikeRef.current.position.add(forwardVector.multiplyScalar(delta))
    bikeRef.current.rotation.y = rotation

    // Update camera to follow bike
    const cameraOffset = new THREE.Vector3(
      Math.sin(rotation) * -6,
      2.5,
      Math.cos(rotation) * -6
    )
    camera.position.lerp(
      bikeRef.current.position.clone().add(cameraOffset),
      0.1
    )
    camera.lookAt(bikeRef.current.position)

    // Exit vehicle with jump key
    if (jump) {
      setIsDriving(false)
      onExit(bikeRef.current.position)
    }
  })

  const bikeGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Bike frame
    const frameGeometry = new THREE.BoxGeometry(2, 0.8, 0.8)
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: '#3498db',
      roughness: 0.6,
      metalness: 0.4
    })
    const frame = new THREE.Mesh(frameGeometry, frameMaterial)
    frame.position.set(0, 0.8, 0)
    group.add(frame)
    
    // Seat
    const seatGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.6)
    const seatMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.7
    })
    const seat = new THREE.Mesh(seatGeometry, seatMaterial)
    seat.position.set(-0.3, 1.2, 0)
    group.add(seat)
    
    // Handlebars
    const handlebarGeometry = new THREE.BoxGeometry(0.1, 0.1, 1)
    const handlebarMaterial = new THREE.MeshStandardMaterial({
      color: '#34495e',
      roughness: 0.6,
      metalness: 0.4
    })
    const handlebars = new THREE.Mesh(handlebarGeometry, handlebarMaterial)
    handlebars.position.set(0.8, 1.3, 0)
    group.add(handlebars)
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.2, 12)
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.8,
      metalness: 0.2
    })
    
    const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    frontWheel.position.set(0.8, 0.6, 0)
    frontWheel.rotation.z = Math.PI / 2
    group.add(frontWheel)
    
    const rearWheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
    rearWheel.position.set(-0.8, 0.6, 0)
    rearWheel.rotation.z = Math.PI / 2
    group.add(rearWheel)
    
    // Headlight
    const headlightGeometry = new THREE.SphereGeometry(0.15, 8, 8)
    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 0.6
    })
    const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial)
    headlight.position.set(1, 0.8, 0)
    group.add(headlight)
    
    return group
  }, [])

  return (
    <group ref={bikeRef} position={position}>
      <primitive object={bikeGeometry} />
      {/* Bike light */}
      <pointLight position={[1, 0.8, 0]} intensity={0.4} distance={8} color="#ffffff" />
    </group>
  )
}

export const PlayerVehicleSystem = () => {
  const [currentVehicle, setCurrentVehicle] = useState(null)
  const [vehicleType, setVehicleType] = useState(null)
  const { playerPos, setPlayerPos } = useStore()

  const enterVehicle = (type, position) => {
    setCurrentVehicle(position)
    setVehicleType(type)
  }

  const exitVehicle = (position) => {
    setPlayerPos([position.x, position.y + 2, position.z])
    setCurrentVehicle(null)
    setVehicleType(null)
  }

  // Check if player is near a vehicle (simplified proximity check)
  const nearbyCar = [15, 0.5, 15]
  const nearbyBike = [-15, 0.5, 15]

  const isNearCar = Math.sqrt(
    Math.pow(playerPos[0] - nearbyCar[0], 2) +
    Math.pow(playerPos[2] - nearbyCar[2], 2)
  ) < 3

  const isNearBike = Math.sqrt(
    Math.pow(playerPos[0] - nearbyBike[0], 2) +
    Math.pow(playerPos[2] - nearbyBike[2], 2)
  ) < 3

  if (currentVehicle && vehicleType === 'car') {
    return <PlayerCar position={currentVehicle} onExit={exitVehicle} />
  }
  
  if (currentVehicle && vehicleType === 'bike') {
    return <PlayerBike position={currentVehicle} onExit={exitVehicle} />
  }

  return (
    <group>
      {/* Parked vehicles the player can enter */}
      <group position={nearbyCar}>
        <PlayerCar position={[0, 0, 0]} onExit={() => {}} />
        {isNearCar && (
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
          </mesh>
        )}
      </group>
      
      <group position={nearbyBike}>
        <PlayerBike position={[0, 0, 0]} onExit={() => {}} />
        {isNearBike && (
          <mesh position={[0, 3, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
          </mesh>
        )}
      </group>
    </group>
  )
}
