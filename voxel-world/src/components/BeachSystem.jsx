import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { woodTexture, glassTexture, waterTexture, grassTexture } from '../textures'

const FoodVendor = ({ position, type = 'hotdog' }) => {
  const vendorRef = useRef()
  const [isServing, setIsServing] = useState(false)
  
  const vendorGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Vendor cart
    const cartGeometry = new THREE.BoxGeometry(2, 1.5, 1.2)
    const cartMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.6
    })
    const cart = new THREE.Mesh(cartGeometry, cartMaterial)
    cart.position.set(0, 0.75, 0)
    group.add(cart)
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8)
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.8
    })
    
    const wheelPositions = [[-0.7, 0.3, 0.6], [0.7, 0.3, 0.6], [-0.7, 0.3, -0.6], [0.7, 0.3, -0.6]]
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
      wheel.position.set(...pos)
      wheel.rotation.z = Math.PI / 2
      group.add(wheel)
    })
    
    // Umbrella
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8)
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: '#34495e',
      roughness: 0.7
    })
    const pole = new THREE.Mesh(poleGeometry, poleMaterial)
    pole.position.set(0, 2.25, 0)
    group.add(pole)
    
    // Umbrella top
    const umbrellaGeometry = new THREE.ConeGeometry(1.5, 1, 8)
    const umbrellaMaterial = new THREE.MeshStandardMaterial({
      color: '#3498db',
      roughness: 0.8
    })
    const umbrella = new THREE.Mesh(umbrellaGeometry, umbrellaMaterial)
    umbrella.position.set(0, 3.5, 0)
    group.add(umbrella)
    
    // Food display
    if (type === 'hotdog') {
      // Hot dog grill
      const grillGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8)
      const grillMaterial = new THREE.MeshStandardMaterial({
        color: '#2c3e50',
        roughness: 0.9
      })
      const grill = new THREE.Mesh(grillGeometry, grillMaterial)
      grill.position.set(0, 1.6, 0)
      group.add(grill)
      
      // Hot dogs
      const hotdogGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8)
      const hotdogMaterial = new THREE.MeshStandardMaterial({
        color: '#8b4513',
        roughness: 0.7
      })
      
      for (let i = 0; i < 3; i++) {
        const hotdog = new THREE.Mesh(hotdogGeometry, hotdogMaterial)
        hotdog.position.set(-0.4 + i * 0.4, 1.7, 0)
        hotdog.rotation.z = Math.PI / 2
        group.add(hotdog)
      }
    } else if (type === 'icecream') {
      // Ice cream freezer
      const freezerGeometry = new THREE.BoxGeometry(1.2, 1, 0.8)
      const freezerMaterial = new THREE.MeshStandardMaterial({
        color: '#ecf0f1',
        roughness: 0.5
      })
      const freezer = new THREE.Mesh(freezerGeometry, freezerMaterial)
      freezer.position.set(0, 1.5, 0)
      group.add(freezer)
      
      // Ice cream cones on top
      const coneGeometry = new THREE.ConeGeometry(0.15, 0.4, 6)
      const coneMaterial = new THREE.MeshStandardMaterial({
        color: '#f4e4c1',
        roughness: 0.8
      })
      
      for (let i = 0; i < 2; i++) {
        const cone = new THREE.Mesh(coneGeometry, coneMaterial)
        cone.position.set(-0.3 + i * 0.6, 2.1, 0)
        group.add(cone)
        
        // Ice cream scoop
        const scoopGeometry = new THREE.SphereGeometry(0.12, 8, 8)
        const scoopMaterial = new THREE.MeshStandardMaterial({
          color: i === 0 ? '#ff69b4' : '#87ceeb',
          roughness: 0.3
        })
        const scoop = new THREE.Mesh(scoopGeometry, scoopMaterial)
        scoop.position.set(-0.3 + i * 0.6, 2.3, 0)
        group.add(scoop)
      }
    }
    
    return group
  }, [type])

  return (
    <group ref={vendorRef} position={position}>
      <primitive object={vendorGeometry} />
    </group>
  )
}

const Beach = ({ position }) => {
  const beachGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Sand
    const sandGeometry = new THREE.BoxGeometry(60, 0.5, 40)
    const sandMaterial = new THREE.MeshStandardMaterial({
      color: '#f4e4c1',
      roughness: 0.9
    })
    const sand = new THREE.Mesh(sandGeometry, sandMaterial)
    sand.position.set(0, 0.25, 0)
    group.add(sand)
    
    // Water edge
    const waterGeometry = new THREE.BoxGeometry(60, 0.3, 10)
    const waterMaterial = new THREE.MeshStandardMaterial({
      map: waterTexture,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8
    })
    const water = new THREE.Mesh(waterGeometry, waterMaterial)
    water.position.set(0, 0.15, 25)
    group.add(water)
    
    // Beach umbrellas
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        // Umbrella pole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2.5, 8)
        const poleMaterial = new THREE.MeshStandardMaterial({
          color: '#8b4513',
          roughness: 0.8
        })
        const pole = new THREE.Mesh(poleGeometry, poleMaterial)
        pole.position.set(-15 + i * 15, 1.25, -10 + j * 8)
        group.add(pole)
        
        // Umbrella top
        const umbrellaGeometry = new THREE.ConeGeometry(1.2, 0.8, 8)
        const umbrellaMaterial = new THREE.MeshStandardMaterial({
          color: ['#ff6b6b', '#4ecdc4', '#45b7d1'][i],
          roughness: 0.8
        })
        const umbrella = new THREE.Mesh(umbrellaGeometry, umbrellaMaterial)
        umbrella.position.set(-15 + i * 15, 2.65, -10 + j * 8)
        group.add(umbrella)
        
        // Beach chair
        const chairGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8)
        const chairMaterial = new THREE.MeshStandardMaterial({
          color: '#2c3e50',
          roughness: 0.7
        })
        const chair = new THREE.Mesh(chairGeometry, chairMaterial)
        chair.position.set(-15 + i * 15, 0.3, -10 + j * 8)
        group.add(chair)
        
        // Chair back
        const backGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.1)
        const back = new THREE.Mesh(backGeometry, chairMaterial)
        back.position.set(-15 + i * 15, 0.7, -10 + j * 8 + 0.35)
        back.rotation.x = -Math.PI / 6
        group.add(back)
      }
    }
    
    // Palm trees
    for (let i = 0; i < 4; i++) {
      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 4, 8)
      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: '#8b4513',
        roughness: 0.8
      })
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
      trunk.position.set(-25 + i * 12, 2, -18)
      group.add(trunk)
      
      // Palm leaves
      const leafGeometry = new THREE.ConeGeometry(2, 1, 6)
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: '#228b22',
        roughness: 0.7
      })
      const leaves = new THREE.Mesh(leafGeometry, leafMaterial)
      leaves.position.set(-25 + i * 12, 4.5, -18)
      group.add(leaves)
    }
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={beachGeometry} />
    </group>
  )
}

const BeachActivityNPC = ({ position, activity = 'swimming' }) => {
  const npcRef = useRef()
  
  useFrame((state) => {
    if (npcRef.current && activity === 'swimming') {
      const time = state.clock.getElapsedTime()
      npcRef.current.position.y = position[1] + Math.sin(time * 2) * 0.2
      npcRef.current.rotation.y = Math.sin(time * 0.5) * 0.1
    } else if (npcRef.current && activity === 'sunbathing') {
      const time = state.clock.getElapsedTime()
      npcRef.current.rotation.z = Math.sin(time * 0.3) * 0.05
    }
  })

  const npcGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    if (activity === 'swimming') {
      // Swimming NPC (simplified, in water)
      const bodyGeometry = new THREE.BoxGeometry(0.8, 0.4, 1.2)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: '#ff6b6b',
        roughness: 0.7
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 0, 0)
      group.add(body)
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.3, 8, 8)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.8
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 0.3, 0.5)
      group.add(head)
      
    } else if (activity === 'sunbathing') {
      // Sunbathing NPC (lying down)
      const bodyGeometry = new THREE.BoxGeometry(1.5, 0.3, 0.8)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: '#4ecdc4',
        roughness: 0.7
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 0.2, 0)
      body.rotation.z = Math.PI / 12
      group.add(body)
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.25, 8, 8)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.8
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0.7, 0.3, 0)
      group.add(head)
      
    } else if (activity === 'volleyball') {
      // Standing NPC for volleyball
      const bodyGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.3)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: '#45b7d1',
        roughness: 0.7
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.set(0, 0.8, 0)
      group.add(body)
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.3, 8, 8)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.8
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.set(0, 1.6, 0)
      group.add(head)
      
      // Arms (raised for volleyball)
      const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15)
      const armMaterial = new THREE.MeshStandardMaterial({
        color: '#d8b08a',
        roughness: 0.8
      })
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.4, 1.4, 0)
      leftArm.rotation.z = -Math.PI / 3
      group.add(leftArm)
      
      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.4, 1.4, 0)
      rightArm.rotation.z = Math.PI / 3
      group.add(rightArm)
    }
    
    return group
  }, [activity])

  return (
    <group ref={npcRef} position={position}>
      <primitive object={npcGeometry} />
    </group>
  )
}

const VolleyballNet = ({ position }) => {
  const netGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Net poles
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8)
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.7
    })
    
    const leftPole = new THREE.Mesh(poleGeometry, poleMaterial)
    leftPole.position.set(-3, 1.5, 0)
    group.add(leftPole)
    
    const rightPole = new THREE.Mesh(poleGeometry, poleMaterial)
    rightPole.position.set(3, 1.5, 0)
    group.add(rightPole)
    
    // Net
    const netGeometry = new THREE.BoxGeometry(6, 1.5, 0.05)
    const netMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.9,
      transparent: true,
      opacity: 0.7
    })
    const net = new THREE.Mesh(netGeometry, netMaterial)
    net.position.set(0, 1.5, 0)
    group.add(net)
    
    return group
  }, [])

  return (
    <group position={position}>
      <primitive object={netGeometry} />
    </group>
  )
}

export const BeachSystem = () => {
  return (
    <group>
      <Beach position={[80, 0, 0]} />
      <Beach position={[-80, 0, 0]} />
      
      {/* Beach activities */}
      <BeachActivityNPC position={[75, 0.5, 5]} activity="swimming" />
      <BeachActivityNPC position={[85, 0.5, 8]} activity="swimming" />
      <BeachActivityNPC position={[70, 0.3, -5]} activity="sunbathing" />
      <BeachActivityNPC position={[90, 0.3, -8]} activity="sunbathing" />
      <BeachActivityNPC position={[80, 0.8, 0]} activity="volleyball" />
      <BeachActivityNPC position={[75, 0.8, -3]} activity="volleyball" />
      <BeachActivityNPC position={[85, 0.8, 3]} activity="volleyball" />
      
      <VolleyballNet position={[80, 0, 0]} />
      
      <BeachActivityNPC position={[-75, 0.5, 5]} activity="swimming" />
      <BeachActivityNPC position={[-85, 0.5, 8]} activity="swimming" />
      <BeachActivityNPC position={[-70, 0.3, -5]} activity="sunbathing" />
      <BeachActivityNPC position={[-90, 0.3, -8]} activity="sunbathing" />
      
      <VolleyballNet position={[-80, 0, 0]} />
    </group>
  )
}

export const FoodVendorSystem = () => {
  return (
    <group>
      <FoodVendor position={[10, 0, 10]} type="hotdog" />
      <FoodVendor position={[-10, 0, 10]} type="icecream" />
      <FoodVendor position={[10, 0, -10]} type="hotdog" />
      <FoodVendor position={[-10, 0, -10]} type="icecream" />
      <FoodVendor position={[30, 0, 30]} type="hotdog" />
      <FoodVendor position={[-30, 0, 30]} type="icecream" />
      <FoodVendor position={[0, 0, 35]} type="hotdog" />
      <FoodVendor position={[0, 0, -35]} type="icecream" />
    </group>
  )
}
