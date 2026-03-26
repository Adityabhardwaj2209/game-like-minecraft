import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { glassTexture, concreteTexture, asphaltTexture } from '../textures'

const Ambulance = ({ position, isMoving = false }) => {
  const ambulanceRef = useRef()
  
  useFrame((state) => {
    if (isMoving && ambulanceRef.current) {
      const time = state.clock.getElapsedTime()
      ambulanceRef.current.position.x = position[0] + Math.sin(time * 0.8) * 1.5
    }
  })

  const ambulanceGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Main vehicle body
    const bodyGeometry = new THREE.BoxGeometry(6, 3, 2.5)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.6
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.set(0, 1.5, 0)
    group.add(body)
    
    // Red cross on sides
    const crossMaterial = new THREE.MeshStandardMaterial({
      color: '#ff0000',
      roughness: 0.3
    })
    
    // Vertical part of cross
    const crossVerticalGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.1)
    const crossVertical = new THREE.Mesh(crossVerticalGeometry, crossMaterial)
    crossVertical.position.set(0, 2, 1.26)
    group.add(crossVertical)
    
    // Horizontal part of cross
    const crossHorizontalGeometry = new THREE.BoxGeometry(1.5, 0.5, 0.1)
    const crossHorizontal = new THREE.Mesh(crossHorizontalGeometry, crossMaterial)
    crossHorizontal.position.set(0, 2, 1.26)
    group.add(crossHorizontal)
    
    // Windows
    const windowMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    })
    
    const windowGeometry = new THREE.BoxGeometry(1.5, 1, 0.1)
    
    // Front window
    const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial)
    frontWindow.position.set(2.5, 2, 0)
    frontWindow.rotation.y = Math.PI / 2
    group.add(frontWindow)
    
    // Side windows
    const sideWindowGeometry = new THREE.BoxGeometry(1, 1, 0.1)
    const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial)
    leftWindow.position.set(-1, 2, -1.26)
    group.add(leftWindow)
    
    const rightWindow = leftWindow.clone()
    rightWindow.position.set(-1, 2, 1.26)
    group.add(rightWindow)
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 8)
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.8
    })
    
    const wheelPositions = [
      [-2, 0.6, 1.3], [2, 0.6, 1.3],
      [-2, 0.6, -1.3], [2, 0.6, -1.3]
    ]
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.position.set(...pos)
      wheel.rotation.z = Math.PI / 2
      group.add(wheel)
    })
    
    // Lights
    const lightGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
    
    // Emergency lights (red and blue)
    const redLight = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
      color: '#ff0000',
      emissive: '#ff0000',
      emissiveIntensity: 0.5
    }))
    redLight.position.set(2.8, 3.2, 0.5)
    group.add(redLight)
    
    const blueLight = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
      color: '#0000ff',
      emissive: '#0000ff',
      emissiveIntensity: 0.5
    }))
    blueLight.position.set(2.8, 3.2, -0.5)
    group.add(blueLight)
    
    return group
  }, [])

  return (
    <group ref={ambulanceRef} position={position}>
      <primitive object={ambulanceGeometry} />
    </group>
  )
}

const HospitalBuilding = ({ position }) => {
  const hospitalGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Main hospital building
    const mainGeometry = new THREE.BoxGeometry(20, 12, 15)
    const mainMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.6
    })
    const mainBuilding = new THREE.Mesh(mainGeometry, mainMaterial)
    mainBuilding.position.set(0, 6, 0)
    group.add(mainBuilding)
    
    // Hospital wings
    const wingGeometry = new THREE.BoxGeometry(15, 8, 10)
    const wingMaterial = new THREE.MeshStandardMaterial({
      color: '#ecf0f1',
      roughness: 0.6
    })
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial)
    leftWing.position.set(-17.5, 4, 0)
    group.add(leftWing)
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial)
    rightWing.position.set(17.5, 4, 0)
    group.add(rightWing)
    
    // Windows
    const windowMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7
    })
    
    const windowGeometry = new THREE.BoxGeometry(2, 2.5, 0.2)
    
    // Main building windows
    for (let floor = 0; floor < 3; floor++) {
      for (let col = 0; col < 4; col++) {
        // Front windows
        const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial)
        frontWindow.position.set(-6 + col * 4, 2 + floor * 3.5, 7.6)
        group.add(frontWindow)
        
        // Back windows
        const backWindow = new THREE.Mesh(windowGeometry, windowMaterial)
        backWindow.position.set(-6 + col * 4, 2 + floor * 3.5, -7.6)
        group.add(backWindow)
      }
    }
    
    // Wing windows
    for (let floor = 0; floor < 2; floor++) {
      for (let col = 0; col < 3; col++) {
        // Left wing windows
        const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial)
        leftWindow.position.set(-17.5, 2 + floor * 3, -3 + col * 3)
        group.add(leftWindow)
        
        // Right wing windows
        const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial)
        rightWindow.position.set(17.5, 2 + floor * 3, -3 + col * 3)
        group.add(rightWindow)
      }
    }
    
    // Main entrance
    const entranceGeometry = new THREE.BoxGeometry(4, 5, 1)
    const entranceMaterial = new THREE.MeshStandardMaterial({
      color: '#3498db',
      roughness: 0.5
    })
    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial)
    entrance.position.set(0, 2.5, 7.5)
    group.add(entrance)
    
    // Glass entrance doors
    const doorGeometry = new THREE.BoxGeometry(3, 4, 0.2)
    const doorMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    })
    const doors = new THREE.Mesh(doorGeometry, doorMaterial)
    doors.position.set(0, 2, 8.1)
    group.add(doors)
    
    // Hospital sign
    const signGeometry = new THREE.BoxGeometry(12, 1, 0.5)
    const signMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.4
    })
    const sign = new THREE.Mesh(signGeometry, signMaterial)
    sign.position.set(0, 10, 7.75)
    group.add(sign)
    
    // Red cross on sign
    const crossMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.3
    })
    
    const crossVerticalGeometry = new THREE.BoxGeometry(1, 0.8, 0.6)
    const crossVertical = new THREE.Mesh(crossVerticalGeometry, crossMaterial)
    crossVertical.position.set(0, 10, 8)
    group.add(crossVertical)
    
    const crossHorizontalGeometry = new THREE.BoxGeometry(3, 0.8, 0.6)
    const crossHorizontal = new THREE.Mesh(crossHorizontalGeometry, crossMaterial)
    crossHorizontal.position.set(0, 10, 8)
    group.add(crossHorizontal)
    
    // Helipad on roof
    const helipadGeometry = new THREE.CylinderGeometry(6, 6, 0.2, 8)
    const helipadMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.8
    })
    const helipad = new THREE.Mesh(helipadGeometry, helipadMaterial)
    helipad.position.set(0, 12.1, 0)
    group.add(helipad)
    
    // Helipad markings (H)
    const hMarkMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.3
    })
    
    const hVerticalGeometry = new THREE.BoxGeometry(0.8, 4, 0.3)
    const hVertical = new THREE.Mesh(hVerticalGeometry, hMarkMaterial)
    hVertical.position.set(0, 12.2, 0)
    group.add(hVertical)
    
    const hHorizontalGeometry = new THREE.BoxGeometry(4, 0.8, 0.3)
    const hHorizontal = new THREE.Mesh(hHorizontalGeometry, hMarkMaterial)
    hHorizontal.position.set(0, 12.2, 0)
    group.add(hHorizontal)
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={hospitalGeometry} />
    </group>
  )
}

const EmergencyRoom = ({ position }) => {
  const erGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // ER building
    const erBuildingGeometry = new THREE.BoxGeometry(8, 6, 6)
    const erMaterial = new THREE.MeshStandardMaterial({
      color: '#e8f6f3',
      roughness: 0.6
    })
    const erBuilding = new THREE.Mesh(erBuildingGeometry, erMaterial)
    erBuilding.position.set(0, 3, 0)
    group.add(erBuilding)
    
    // ER entrance
    const erEntranceGeometry = new THREE.BoxGeometry(3, 3, 0.5)
    const erEntranceMaterial = new THREE.MeshStandardMaterial({
      color: '#16a085',
      roughness: 0.5
    })
    const erEntrance = new THREE.Mesh(erEntranceGeometry, erEntranceMaterial)
    erEntrance.position.set(0, 1.5, 3.25)
    group.add(erEntrance)
    
    // ER sign
    const erSignGeometry = new THREE.BoxGeometry(4, 0.8, 0.3)
    const erSignMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.4
    })
    const erSign = new THREE.Mesh(erSignGeometry, erSignMaterial)
    erSign.position.set(0, 5.5, 3.15)
    group.add(erSign)
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={erGeometry} />
    </group>
  )
}

const Hospital = ({ position }) => {
  const hospitalGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Hospital grounds
    const groundGeometry = new THREE.BoxGeometry(50, 0.5, 30)
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: concreteTexture,
      roughness: 0.8
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.position.set(0, 0.25, 0)
    group.add(ground)
    
    // Parking area
    const parkingGeometry = new THREE.BoxGeometry(20, 0.3, 15)
    const parkingMaterial = new THREE.MeshStandardMaterial({
      map: asphaltTexture,
      roughness: 0.7
    })
    const parking = new THREE.Mesh(parkingGeometry, parkingMaterial)
    parking.position.set(25, 0.15, 0)
    group.add(parking)
    
    // Parking lines
    const lineMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.3
    })
    
    const lineGeometry = new THREE.BoxGeometry(0.2, 0.31, 3)
    
    for (let i = 0; i < 5; i++) {
      const line = new THREE.Mesh(lineGeometry, lineMaterial)
      line.position.set(18 + i * 3, 0.16, -4)
      group.add(line)
      
      const line2 = line.clone()
      line2.position.set(18 + i * 3, 0.16, 4)
      group.add(line2)
    }
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={hospitalGeometry} />
      <HospitalBuilding position={[0, 0, 0]} />
      <EmergencyRoom position={[0, 0, 12]} />
      <EmergencyRoom position={[0, 0, -12]} />
      <Ambulance position={[20, 0.5, 5]} isMoving={true} />
      <Ambulance position={[25, 0.5, -5]} />
    </group>
  )
}

export const HospitalSystem = () => {
  return (
    <group>
      <Hospital position={[-50, 0, 30]} />
      <Hospital position={[50, 0, -30]} />
    </group>
  )
}
