import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { asphaltTexture, concreteTexture, glassTexture } from '../textures'

const Bus = ({ position, rotation = 0, isMoving = false }) => {
  const busRef = useRef()
  const [busPosition, setBusPosition] = useState(position)
  
  useFrame((state) => {
    if (isMoving && busRef.current) {
      const time = state.clock.getElapsedTime()
      busRef.current.position.x = position[0] + Math.sin(time * 0.5) * 2
    }
  })

  const busGeometry = useMemo(() => {
    const busGroup = new THREE.Group()
    
    // Main bus body
    const bodyGeometry = new THREE.BoxGeometry(12, 4, 2.5)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: '#ff6b35',
      roughness: 0.6,
      metalness: 0.3
    })
    const busBody = new THREE.Mesh(bodyGeometry, bodyMaterial)
    busBody.position.set(0, 2, 0)
    busGroup.add(busBody)
    
    // Windows
    const windowGeometry = new THREE.BoxGeometry(1.5, 1.2, 2.6)
    const windowMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7
    })
    
    for (let i = 0; i < 6; i++) {
      const window = new THREE.Mesh(windowGeometry, windowMaterial)
      window.position.set(-4.5 + i * 1.8, 2.5, 0)
      busGroup.add(window)
    }
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 8)
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.8
    })
    
    const wheelPositions = [
      [-4, 0.8, 1.5], [4, 0.8, 1.5],
      [-4, 0.8, -1.5], [4, 0.8, -1.5]
    ]
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.position.set(...pos)
      wheel.rotation.z = Math.PI / 2
      busGroup.add(wheel)
    })
    
    // Front and back lights
    const lightGeometry = new THREE.BoxGeometry(0.3, 0.5, 2.6)
    const frontLightMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 0.5
    })
    const rearLightMaterial = new THREE.MeshStandardMaterial({
      color: '#ff0000',
      emissive: '#ff0000',
      emissiveIntensity: 0.3
    })
    
    const frontLight = new THREE.Mesh(lightGeometry, frontLightMaterial)
    frontLight.position.set(6.2, 2, 0)
    busGroup.add(frontLight)
    
    const rearLight = new THREE.Mesh(lightGeometry, rearLightMaterial)
    rearLight.position.set(-6.2, 2, 0)
    busGroup.add(rearLight)
    
    return busGroup
  }, [])

  return (
    <group ref={busRef} position={busPosition} rotation={[0, rotation, 0]}>
      <primitive object={busGeometry} />
    </group>
  )
}

const BusStop = ({ position }) => {
  const stopGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Shelter
    const shelterGeometry = new THREE.BoxGeometry(6, 3, 3)
    const shelterMaterial = new THREE.MeshStandardMaterial({
      color: '#4a90e2',
      roughness: 0.7
    })
    const shelter = new THREE.Mesh(shelterGeometry, shelterMaterial)
    shelter.position.set(0, 3, 0)
    group.add(shelter)
    
    // Roof
    const roofGeometry = new THREE.BoxGeometry(7, 0.2, 4)
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.8
    })
    const roof = new THREE.Mesh(roofGeometry, roofMaterial)
    roof.position.set(0, 4.6, 0)
    group.add(roof)
    
    // Benches
    const benchGeometry = new THREE.BoxGeometry(2, 0.3, 0.8)
    const benchMaterial = new THREE.MeshStandardMaterial({
      color: '#8b4513',
      roughness: 0.9
    })
    
    const bench1 = new THREE.Mesh(benchGeometry, benchMaterial)
    bench1.position.set(-1.5, 0.3, 0)
    group.add(bench1)
    
    const bench2 = new THREE.Mesh(benchGeometry, benchMaterial)
    bench2.position.set(1.5, 0.3, 0)
    group.add(bench2)
    
    // Sign
    const signGeometry = new THREE.BoxGeometry(0.1, 2, 0.8)
    const signMaterial = new THREE.MeshStandardMaterial({
      color: '#f39c12',
      roughness: 0.6
    })
    const sign = new THREE.Mesh(signGeometry, signMaterial)
    sign.position.set(3.5, 2, 0)
    group.add(sign)
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={stopGeometry} />
    </group>
  )
}

const BusStand = ({ position }) => {
  const standGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Main platform
    const platformGeometry = new THREE.BoxGeometry(30, 0.5, 15)
    const platformMaterial = new THREE.MeshStandardMaterial({
      map: concreteTexture,
      roughness: 0.8
    })
    const platform = new THREE.Mesh(platformGeometry, platformMaterial)
    platform.position.set(0, 0.25, 0)
    group.add(platform)
    
    // Terminal building
    const terminalGeometry = new THREE.BoxGeometry(10, 6, 8)
    const terminalMaterial = new THREE.MeshStandardMaterial({
      color: '#ecf0f1',
      roughness: 0.7
    })
    const terminal = new THREE.Mesh(terminalGeometry, terminalMaterial)
    terminal.position.set(0, 3, -8)
    group.add(terminal)
    
    // Terminal windows
    const windowGeometry = new THREE.BoxGeometry(2, 1.5, 0.2)
    const windowMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    })
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        const window = new THREE.Mesh(windowGeometry, windowMaterial)
        window.position.set(-3 + i * 3, 4 + j * 2, -4)
        group.add(window)
      }
    }
    
    // Ticket counters
    const counterGeometry = new THREE.BoxGeometry(8, 1.2, 1)
    const counterMaterial = new THREE.MeshStandardMaterial({
      color: '#34495e',
      roughness: 0.6
    })
    const counter = new THREE.Mesh(counterGeometry, counterMaterial)
    counter.position.set(0, 0.6, -3)
    group.add(counter)
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={standGeometry} />
      <Bus position={[0, 0.5, 5]} rotation={Math.PI} />
      <Bus position={[8, 0.5, 5]} rotation={Math.PI} />
      <Bus position={[-8, 0.5, 5]} rotation={Math.PI} isMoving={true} />
      <BusStop position={[15, 0, 0]} />
      <BusStop position={[-15, 0, 0]} />
    </group>
  )
}

export const BusSystem = () => {
  return (
    <group>
      <BusStand position={[30, 0, 30]} />
      <BusStand position={[-30, 0, 30]} />
      <BusStand position={[30, 0, -30]} />
      <BusStop position={[0, 0, 10]} />
      <BusStop position={[10, 0, 0]} />
      <BusStop position={[-10, 0, 0]} />
      <BusStop position={[0, 0, -10]} />
    </group>
  )
}
