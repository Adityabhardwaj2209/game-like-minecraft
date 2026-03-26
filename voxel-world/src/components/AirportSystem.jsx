import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { asphaltTexture, concreteTexture, glassTexture, grassTexture } from '../textures'

const Airplane = ({ position, rotation = 0, isFlying = false }) => {
  const planeRef = useRef()
  
  useFrame((state) => {
    if (isFlying && planeRef.current) {
      const time = state.clock.getElapsedTime()
      planeRef.current.position.y = position[1] + Math.sin(time * 0.3) * 5
      planeRef.current.position.x = position[0] + Math.cos(time * 0.2) * 10
      planeRef.current.rotation.z = Math.sin(time * 0.2) * 0.1
    }
  })

  const airplaneGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Fuselage
    const fuselageGeometry = new THREE.CylinderGeometry(1, 1.5, 20, 8)
    const fuselageMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.3,
      metalness: 0.6
    })
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial)
    fuselage.rotation.z = Math.PI / 2
    fuselage.position.set(0, 0, 0)
    group.add(fuselage)
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(30, 0.5, 4)
    const wingMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.4,
      metalness: 0.5
    })
    const wings = new THREE.Mesh(wingGeometry, wingMaterial)
    wings.position.set(0, 0, 0)
    group.add(wings)
    
    // Tail wing
    const tailWingGeometry = new THREE.BoxGeometry(8, 0.3, 2)
    const tailWing = new THREE.Mesh(tailWingGeometry, wingMaterial)
    tailWing.position.set(-8, 2, 0)
    group.add(tailWing)
    
    // Vertical stabilizer
    const tailGeometry = new THREE.BoxGeometry(0.3, 4, 3)
    const tail = new THREE.Mesh(tailGeometry, wingMaterial)
    tail.position.set(-9, 2, 0)
    group.add(tail)
    
    // Engines
    const engineGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 8)
    const engineMaterial = new THREE.MeshStandardMaterial({
      color: '#34495e',
      roughness: 0.6,
      metalness: 0.4
    })
    
    const engine1 = new THREE.Mesh(engineGeometry, engineMaterial)
    engine1.position.set(-5, -1, 3)
    engine1.rotation.z = Math.PI / 2
    group.add(engine1)
    
    const engine2 = new THREE.Mesh(engineGeometry, engineMaterial)
    engine2.position.set(-5, -1, -3)
    engine2.rotation.z = Math.PI / 2
    group.add(engine2)
    
    // Windows
    const windowGeometry = new THREE.SphereGeometry(0.2, 6, 6)
    const windowMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7
    })
    
    for (let i = 0; i < 8; i++) {
      const window = new THREE.Mesh(windowGeometry, windowMaterial)
      window.position.set(-6 + i * 1.5, 0.5, 0.8)
      group.add(window)
      
      const window2 = window.clone()
      window2.position.set(-6 + i * 1.5, 0.5, -0.8)
      group.add(window2)
    }
    
    // Landing gear
    const gearGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 6)
    const gearMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.8
    })
    
    const gear1 = new THREE.Mesh(gearGeometry, gearMaterial)
    gear1.position.set(5, -2, 0)
    group.add(gear1)
    
    const gear2 = new THREE.Mesh(gearGeometry, gearMaterial)
    gear2.position.set(-3, -2, 2)
    group.add(gear2)
    
    const gear3 = new THREE.Mesh(gearGeometry, gearMaterial)
    gear3.position.set(-3, -2, -2)
    group.add(gear3)
    
    return group
  }, [])

  return (
    <group ref={planeRef} position={position} rotation={[0, rotation, 0]}>
      <primitive object={airplaneGeometry} />
    </group>
  )
}

const Runway = ({ position }) => {
  const runwayGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Main runway
    const runwayMaterial = new THREE.MeshStandardMaterial({
      map: asphaltTexture,
      roughness: 0.7,
      metalness: 0.1
    })
    
    const runway = new THREE.Mesh(
      new THREE.BoxGeometry(80, 0.3, 4),
      runwayMaterial
    )
    runway.position.set(0, 0.15, 0)
    group.add(runway)
    
    // Runway markings
    const markingMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.3
    })
    
    // Center line
    for (let i = 0; i < 20; i++) {
      const marking = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.31, 0.3),
        markingMaterial
      )
      marking.position.set(-38 + i * 4, 0.16, 0)
      group.add(marking)
    }
    
    // Threshold markings
    for (let i = 0; i < 8; i++) {
      const marking = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.31, 4),
        markingMaterial
      )
      marking.position.set(-39, 0.16, -1.5 + i * 0.4)
      group.add(marking)
      
      const marking2 = marking.clone()
      marking2.position.set(39, 0.16, -1.5 + i * 0.4)
      group.add(marking2)
    }
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={runwayGeometry} />
    </group>
  )
}

const AirportTerminal = ({ position }) => {
  const terminalGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Main terminal building
    const terminalMaterial = new THREE.MeshStandardMaterial({
      color: '#ecf0f1',
      roughness: 0.6
    })
    
    const mainBuilding = new THREE.Mesh(
      new THREE.BoxGeometry(30, 8, 15),
      terminalMaterial
    )
    mainBuilding.position.set(0, 4, 0)
    group.add(mainBuilding)
    
    // Glass facade
    const glassMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    })
    
    const facade = new THREE.Mesh(
      new THREE.BoxGeometry(30, 6, 0.3),
      glassMaterial
    )
    facade.position.set(0, 5, 7.5)
    group.add(facade)
    
    // Control tower
    const towerGeometry = new THREE.CylinderGeometry(2, 3, 20, 8)
    const towerMaterial = new THREE.MeshStandardMaterial({
      color: '#34495e',
      roughness: 0.5,
      metalness: 0.5
    })
    const tower = new THREE.Mesh(towerGeometry, towerMaterial)
    tower.position.set(0, 10, -10)
    group.add(tower)
    
    // Tower cabin
    const cabinGeometry = new THREE.CylinderGeometry(3, 3, 4, 8)
    const cabinMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7
    })
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
    cabin.position.set(0, 22, -10)
    group.add(cabin)
    
    // Gates
    for (let i = 0; i < 4; i++) {
      const gate = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 0.2),
        terminalMaterial
      )
      gate.position.set(-10 + i * 7, 1.5, 7.6)
      group.add(gate)
    }
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={terminalGeometry} />
    </group>
  )
}

const Airport = ({ position }) => {
  const airportGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Ground
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: concreteTexture,
      roughness: 0.8
    })
    
    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(120, 0.5, 60),
      groundMaterial
    )
    ground.position.set(0, 0.25, 0)
    group.add(ground)
    
    // Taxiways
    const taxiway = new THREE.Mesh(
      new THREE.BoxGeometry(60, 0.3, 3),
      new THREE.MeshStandardMaterial({
        map: asphaltTexture,
        roughness: 0.7
      })
    )
    taxiway.position.set(0, 0.15, 10)
    group.add(taxiway)
    
    const taxiway2 = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.3, 40),
      new THREE.MeshStandardMaterial({
        map: asphaltTexture,
        roughness: 0.7
      })
    )
    taxiway2.position.set(45, 0.15, -10)
    group.add(taxiway2)
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={airportGeometry} />
      <Runway position={[0, 0, 0]} />
      <AirportTerminal position={[0, 0, -20]} />
      <Airplane position={[0, 2, 15]} rotation={Math.PI} />
      <Airplane position={[-20, 2, 8]} rotation={Math.PI / 2} />
      <Airplane position={[20, 2, -8]} rotation={-Math.PI / 2} />
      <Airplane position={[0, 15, 0]} rotation={Math.PI / 4} isFlying={true} />
    </group>
  )
}

export const AirportSystem = () => {
  return (
    <group>
      <Airport position={[50, 0, 0]} />
    </group>
  )
}
