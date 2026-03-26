import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { woodTexture, glassTexture } from '../textures'

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
