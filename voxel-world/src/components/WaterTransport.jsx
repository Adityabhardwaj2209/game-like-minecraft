import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { waterTexture, woodTexture, glassTexture, concreteTexture } from '../textures'

const Ship = ({ position, type = 'cargo', isMoving = false }) => {
  const shipRef = useRef()
  
  useFrame((state) => {
    if (isMoving && shipRef.current) {
      const time = state.clock.getElapsedTime()
      shipRef.current.position.x = position[0] + Math.sin(time * 0.3) * 3
      shipRef.current.rotation.z = Math.sin(time * 0.2) * 0.05
    }
  })

  const shipGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    if (type === 'cargo') {
      // Cargo ship hull
      const hullGeometry = new THREE.BoxGeometry(25, 8, 6)
      const hullMaterial = new THREE.MeshStandardMaterial({
        color: '#8b4513',
        roughness: 0.7,
        metalness: 0.3
      })
      const hull = new THREE.Mesh(hullGeometry, hullMaterial)
      hull.position.set(0, 0, 0)
      group.add(hull)
      
      // Cargo containers
      const containerMaterial = new THREE.MeshStandardMaterial({
        color: '#e74c3c',
        roughness: 0.6
      })
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
          for (let k = 0; k < 3; k++) {
            const container = new THREE.Mesh(
              new THREE.BoxGeometry(3, 3, 2.5),
              containerMaterial
            )
            container.position.set(-8 + i * 8, 5 + j * 3.5, -2 + k * 2)
            group.add(container)
          }
        }
      }
      
      // Bridge
      const bridgeGeometry = new THREE.BoxGeometry(4, 6, 4)
      const bridgeMaterial = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.4
      })
      const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial)
      bridge.position.set(8, 8, 0)
      group.add(bridge)
      
      // Bridge windows
      const windowMaterial = new THREE.MeshStandardMaterial({
        map: glassTexture,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.8
      })
      
      const bridgeWindow = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 0.2),
        windowMaterial
      )
      bridgeWindow.position.set(8, 9, 2.1)
      group.add(bridgeWindow)
      
    } else if (type === 'cruise') {
      // Cruise ship hull
      const hullGeometry = new THREE.BoxGeometry(20, 10, 8)
      const hullMaterial = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.5
      })
      const hull = new THREE.Mesh(hullGeometry, hullMaterial)
      hull.position.set(0, 0, 0)
      group.add(hull)
      
      // Decks
      for (let i = 0; i < 4; i++) {
        const deck = new THREE.Mesh(
          new THREE.BoxGeometry(18, 0.3, 7.5),
          new THREE.MeshStandardMaterial({
            color: '#ecf0f1',
            roughness: 0.6
          })
        )
        deck.position.set(0, 2 + i * 2.5, 0)
        group.add(deck)
      }
      
      // Windows for decks
      const windowMaterial = new THREE.MeshStandardMaterial({
        map: glassTexture,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.7
      })
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 8; j++) {
          const window = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.8, 0.2),
            windowMaterial
          )
          window.position.set(-7 + j * 2, 3 + i * 2.5, 4.1)
          group.add(window)
        }
      }
      
      // Funnel
      const funnelGeometry = new THREE.CylinderGeometry(1, 1.5, 4, 8)
      const funnelMaterial = new THREE.MeshStandardMaterial({
        color: '#e74c3c',
        roughness: 0.6
      })
      const funnel = new THREE.Mesh(funnelGeometry, funnelMaterial)
      funnel.position.set(3, 12, 0)
      group.add(funnel)
      
      // Pool on top deck
      const poolGeometry = new THREE.BoxGeometry(4, 0.1, 3)
      const poolMaterial = new THREE.MeshStandardMaterial({
        map: waterTexture,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8
      })
      const pool = new THREE.Mesh(poolGeometry, poolMaterial)
      pool.position.set(-3, 11, 0)
      group.add(pool)
    }
    
    return group
  }, [type])

  return (
    <group ref={shipRef} position={position}>
      <primitive object={shipGeometry} />
    </group>
  )
}

const Boat = ({ position, type = 'fishing', isMoving = false }) => {
  const boatRef = useRef()
  
  useFrame((state) => {
    if (isMoving && boatRef.current) {
      const time = state.clock.getElapsedTime()
      boatRef.current.position.x = position[0] + Math.sin(time * 0.5) * 2
      boatRef.current.rotation.z = Math.sin(time * 0.3) * 0.1
    }
  })

  const boatGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    if (type === 'fishing') {
      // Fishing boat hull
      const hullGeometry = new THREE.BoxGeometry(4, 1, 2)
      const hullMaterial = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.7
      })
      const hull = new THREE.Mesh(hullGeometry, hullMaterial)
      hull.position.set(0, 0, 0)
      group.add(hull)
      
      // Cabin
      const cabinGeometry = new THREE.BoxGeometry(1.5, 1, 1.5)
      const cabinMaterial = new THREE.MeshStandardMaterial({
        color: '#3498db',
        roughness: 0.6
      })
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
      cabin.position.set(0.5, 1, 0)
      group.add(cabin)
      
      // Fishing net
      const netGeometry = new THREE.BoxGeometry(3, 2, 0.1)
      const netMaterial = new THREE.MeshStandardMaterial({
        color: '#2c3e50',
        roughness: 0.9
      })
      const net = new THREE.Mesh(netGeometry, netMaterial)
      net.position.set(-0.5, 1, 1.5)
      net.rotation.x = Math.PI / 4
      group.add(net)
      
    } else if (type === 'speedboat') {
      // Speedboat hull
      const hullGeometry = new THREE.BoxGeometry(3, 0.8, 1.5)
      const hullMaterial = new THREE.MeshStandardMaterial({
        color: '#e74c3c',
        roughness: 0.4,
        metalness: 0.6
      })
      const hull = new THREE.Mesh(hullGeometry, hullMaterial)
      hull.position.set(0, 0, 0)
      group.add(hull)
      
      // Windshield
      const windshieldGeometry = new THREE.BoxGeometry(1, 0.8, 0.1)
      const windshieldMaterial = new THREE.MeshStandardMaterial({
        map: glassTexture,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.8
      })
      const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial)
      windshield.position.set(0.5, 0.8, 0)
      group.add(windshield)
      
      // Engine
      const engineGeometry = new THREE.BoxGeometry(0.5, 0.6, 0.8)
      const engineMaterial = new THREE.MeshStandardMaterial({
        color: '#2c3e50',
        roughness: 0.6,
        metalness: 0.4
      })
      const engine = new THREE.Mesh(engineGeometry, engineMaterial)
      engine.position.set(-1.5, 0.5, 0)
      group.add(engine)
    }
    
    return group
  }, [type])

  return (
    <group ref={boatRef} position={position}>
      <primitive object={boatGeometry} />
    </group>
  )
}

const Harbor = ({ position }) => {
  const harborGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Pier
    const pierMaterial = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.8
    })
    
    const pier = new THREE.Mesh(
      new THREE.BoxGeometry(30, 0.5, 8),
      pierMaterial
    )
    pier.position.set(0, 0.25, 0)
    group.add(pier)
    
    // Pier supports
    const supportGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 6)
    const supportMaterial = new THREE.MeshStandardMaterial({
      color: '#8b4513',
      roughness: 0.9
    })
    
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 2; j++) {
        const support = new THREE.Mesh(supportGeometry, supportMaterial)
        support.position.set(-12 + i * 4.8, -1, -3 + j * 6)
        group.add(support)
      }
    }
    
    // Harbor building
    const buildingGeometry = new THREE.BoxGeometry(10, 6, 6)
    const buildingMaterial = new THREE.MeshStandardMaterial({
      color: '#ecf0f1',
      roughness: 0.7
    })
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial)
    building.position.set(0, 3, -10)
    group.add(building)
    
    // Crane
    const craneBaseGeometry = new THREE.BoxGeometry(2, 8, 2)
    const craneMaterial = new THREE.MeshStandardMaterial({
      color: '#f39c12',
      roughness: 0.6
    })
    const craneBase = new THREE.Mesh(craneBaseGeometry, craneMaterial)
    craneBase.position.set(15, 4, 0)
    group.add(craneBase)
    
    const craneArmGeometry = new THREE.BoxGeometry(12, 0.5, 0.5)
    const craneArm = new THREE.Mesh(craneArmGeometry, craneMaterial)
    craneArm.position.set(15, 8.5, 0)
    group.add(craneArm)
    
    // Lighthouse
    const lighthouseBaseGeometry = new THREE.CylinderGeometry(2, 2.5, 8, 8)
    const lighthouseMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.6
    })
    const lighthouseBase = new THREE.Mesh(lighthouseBaseGeometry, lighthouseMaterial)
    lighthouseBase.position.set(-15, 4, 0)
    group.add(lighthouseBase)
    
    const lighthouseTopGeometry = new THREE.CylinderGeometry(1, 2, 2, 8)
    const lighthouseTopMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.5
    })
    const lighthouseTop = new THREE.Mesh(lighthouseTopGeometry, lighthouseTopMaterial)
    lighthouseTop.position.set(-15, 9, 0)
    group.add(lighthouseTop)
    
    // Light
    const lightGeometry = new THREE.SphereGeometry(0.5, 8, 8)
    const lightMaterial = new THREE.MeshStandardMaterial({
      color: '#ffff00',
      emissive: '#ffff00',
      emissiveIntensity: 0.5
    })
    const light = new THREE.Mesh(lightGeometry, lightMaterial)
    light.position.set(-15, 10, 0)
    group.add(light)
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={harborGeometry} />
    </group>
  )
}

export const WaterTransport = () => {
  return (
    <group>
      <Harbor position={[0, 0, 50]} />
      <Ship position={[5, 2, 55]} type="cargo" isMoving={true} />
      <Ship position={[-10, 2, 60]} type="cruise" />
      <Boat position={[15, 0.5, 52]} type="fishing" isMoving={true} />
      <Boat position={[-15, 0.5, 48]} type="speedboat" isMoving={true} />
      
      <Harbor position={[0, 0, -50]} />
      <Ship position={[8, 2, -55]} type="cruise" isMoving={true} />
      <Boat position={[-8, 0.5, -52]} type="fishing" />
    </group>
  )
}
