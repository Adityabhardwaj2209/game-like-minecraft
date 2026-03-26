import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { concreteTexture, glassTexture } from '../textures'

const StreetLight = ({ position }) => {
  const lightRef = useRef()
  
  const lightGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Light pole
    const poleGeometry = new THREE.CylinderGeometry(0.15, 0.2, 6, 8)
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.7,
      metalness: 0.3
    })
    const pole = new THREE.Mesh(poleGeometry, poleMaterial)
    pole.position.set(0, 3, 0)
    group.add(pole)
    
    // Light arm
    const armGeometry = new THREE.BoxGeometry(2, 0.15, 0.15)
    const arm = new THREE.Mesh(armGeometry, poleMaterial)
    arm.position.set(1, 5.5, 0)
    arm.rotation.z = -Math.PI / 6
    group.add(arm)
    
    // Light fixture
    const fixtureGeometry = new THREE.BoxGeometry(0.8, 0.6, 0.4)
    const fixtureMaterial = new THREE.MeshStandardMaterial({
      color: '#34495e',
      roughness: 0.6
    })
    const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial)
    fixture.position.set(2, 5.2, 0)
    group.add(fixture)
    
    // Light bulb
    const bulbGeometry = new THREE.SphereGeometry(0.2, 8, 8)
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: '#ffeb3b',
      emissive: '#ffeb3b',
      emissiveIntensity: 0.8
    })
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial)
    bulb.position.set(2, 5.2, 0)
    group.add(bulb)
    
    // Base
    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 8)
    const base = new THREE.Mesh(baseGeometry, poleMaterial)
    base.position.set(0, 0.15, 0)
    group.add(base)
    
    return group
  }, [])

  useFrame(() => {
    if (lightRef.current) {
      // Flicker effect occasionally
      if (Math.random() < 0.001) {
        const bulb = lightRef.current.children.find(child => 
          child.geometry instanceof THREE.SphereGeometry
        )
        if (bulb) {
          bulb.material.emissiveIntensity = 0.4
          setTimeout(() => {
            bulb.material.emissiveIntensity = 0.8
          }, 100)
        }
      }
    }
  })

  return (
    <group ref={lightRef} position={position}>
      <primitive object={lightGeometry} />
      {/* Point light for illumination */}
      <pointLight position={[2, 5.2, 0]} intensity={0.8} distance={15} color="#ffeb3b" />
    </group>
  )
}

const TrafficLight = ({ position }) => {
  const trafficLightRef = useRef()
  const [currentLight, setCurrentLight] = useState(0)
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Change lights every 3 seconds
    const lightIndex = Math.floor(time / 3) % 3
    setCurrentLight(lightIndex)
  })

  const trafficLightGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Pole
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.15, 4, 8)
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.7
    })
    const pole = new THREE.Mesh(poleGeometry, poleMaterial)
    pole.position.set(0, 2, 0)
    group.add(pole)
    
    // Traffic light box
    const boxGeometry = new THREE.BoxGeometry(0.6, 1.8, 0.3)
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.8
    })
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.position.set(0, 3.5, 0)
    group.add(box)
    
    // Red light
    const redLightGeometry = new THREE.SphereGeometry(0.15, 8, 8)
    const redLightMaterial = new THREE.MeshStandardMaterial({
      color: '#ff0000',
      emissive: '#ff0000',
      emissiveIntensity: 0.3
    })
    const redLight = new THREE.Mesh(redLightGeometry, redLightMaterial)
    redLight.position.set(0, 4.2, 0.16)
    group.add(redLight)
    
    // Yellow light
    const yellowLightGeometry = new THREE.SphereGeometry(0.15, 8, 8)
    const yellowLightMaterial = new THREE.MeshStandardMaterial({
      color: '#ffff00',
      emissive: '#ffff00',
      emissiveIntensity: 0.3
    })
    const yellowLight = new THREE.Mesh(yellowLightGeometry, yellowLightMaterial)
    yellowLight.position.set(0, 3.5, 0.16)
    group.add(yellowLight)
    
    // Green light
    const greenLightGeometry = new THREE.SphereGeometry(0.15, 8, 8)
    const greenLightMaterial = new THREE.MeshStandardMaterial({
      color: '#00ff00',
      emissive: '#00ff00',
      emissiveIntensity: 0.3
    })
    const greenLight = new THREE.Mesh(greenLightGeometry, greenLightMaterial)
    greenLight.position.set(0, 2.8, 0.16)
    group.add(greenLight)
    
    return group
  }, [])

  useFrame(() => {
    if (trafficLightRef.current) {
      const lights = trafficLightRef.current.children.filter(child => 
        child.geometry instanceof THREE.SphereGeometry
      )
      
      lights.forEach((light, index) => {
        if (index === currentLight) {
          light.material.emissiveIntensity = 0.8
        } else {
          light.material.emissiveIntensity = 0.1
        }
      })
    }
  })

  return (
    <group ref={trafficLightRef} position={position}>
      <primitive object={trafficLightGeometry} />
    </group>
  )
}

export const StreetLighting = () => {
  return (
    <group>
      {/* Street lights along main roads */}
      <StreetLight position={[8, 0, 0]} />
      <StreetLight position={[-8, 0, 0]} />
      <StreetLight position={[8, 0, 20]} />
      <StreetLight position={[-8, 0, 20]} />
      <StreetLight position={[8, 0, -20]} />
      <StreetLight position={[-8, 0, -20]} />
      <StreetLight position={[8, 0, 40]} />
      <StreetLight position={[-8, 0, 40]} />
      <StreetLight position={[8, 0, -40]} />
      <StreetLight position={[-8, 0, -40]} />
      
      <StreetLight position={[0, 0, 8]} />
      <StreetLight position={[0, 0, -8]} />
      <StreetLight position={[20, 0, 8]} />
      <StreetLight position={[20, 0, -8]} />
      <StreetLight position={[-20, 0, 8]} />
      <StreetLight position={[-20, 0, -8]} />
      <StreetLight position={[40, 0, 8]} />
      <StreetLight position={[40, 0, -8]} />
      <StreetLight position={[-40, 0, 8]} />
      <StreetLight position={[-40, 0, -8]} />
      
      {/* Traffic lights at intersections */}
      <TrafficLight position={[12, 0, 12]} />
      <TrafficLight position={[-12, 0, 12]} />
      <TrafficLight position={[12, 0, -12]} />
      <TrafficLight position={[-12, 0, -12]} />
      
      <TrafficLight position={[32, 0, 12]} />
      <TrafficLight position={[32, 0, -12]} />
      <TrafficLight position={[-32, 0, 12]} />
      <TrafficLight position={[-32, 0, -12]} />
      
      {/* Additional street lights for parking areas */}
      <StreetLight position={[15, 0, 25]} />
      <StreetLight position={[-15, 0, 25]} />
      <StreetLight position={[15, 0, -25]} />
      <StreetLight position={[-15, 0, -25]} />
    </group>
  )
}
