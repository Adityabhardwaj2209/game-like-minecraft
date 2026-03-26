import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { asphaltTexture, concreteTexture, roadLineTexture } from '../textures'

const RoadSegment = ({ position, length, width, rotation = 0, type = 'highway' }) => {
  const meshRef = useRef()
  
  const roadGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(length, 0.2, width)
    return geo
  }, [length, width])

  const roadMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: type === 'highway' ? asphaltTexture : concreteTexture,
      roughness: 0.8,
      metalness: 0.1
    })
    return material
  }, [type])

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, rotation, 0]}
      geometry={roadGeometry}
      material={roadMaterial}
      receiveShadow
    />
  )
}

const RoadLines = ({ position, length, width, rotation = 0 }) => {
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(length, 0.21, 0.1)
    return geo
  }, [length])

  const lineMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: roadLineTexture,
      roughness: 0.3,
      metalness: 0.5
    })
    return material
  }, [])

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh geometry={lineGeometry} material={lineMaterial} position={[0, 0, -width/3]} />
      <mesh geometry={lineGeometry} material={lineMaterial} position={[0, 0, width/3]} />
    </group>
  )
}

const Intersection = ({ position, size }) => {
  const intersectionGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(size, 0.2, size)
    return geo
  }, [size])

  const intersectionMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: asphaltTexture,
      roughness: 0.8,
      metalness: 0.1
    })
    return material
  }, [])

  return (
    <mesh
      position={position}
      geometry={intersectionGeometry}
      material={intersectionMaterial}
      receiveShadow
    />
  )
}

const Sidewalk = ({ position, length, width, rotation = 0 }) => {
  const sidewalkGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(length, 0.3, width)
    return geo
  }, [length, width])

  const sidewalkMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: concreteTexture,
      roughness: 0.9,
      metalness: 0.05
    })
    return material
  }, [])

  return (
    <mesh
      position={position}
      rotation={[0, rotation, 0]}
      geometry={sidewalkGeometry}
      material={sidewalkMaterial}
      receiveShadow
    />
  )
}

export const Roads = () => {
  return (
    <group>
      {/* Main Highway - North-South (wider for better player movement) */}
      <RoadSegment position={[0, 0.1, 0]} length={100} width={10} type="highway" />
      <RoadLines position={[0, 0.15, 0]} length={100} width={10} />
      
      {/* Main Highway - East-West */}
      <RoadSegment position={[0, 0.1, 0]} length={100} width={10} rotation={Math.PI/2} type="highway" />
      <RoadLines position={[0, 0.15, 0]} length={100} width={10} rotation={Math.PI/2} />
      
      {/* Secondary Roads */}
      <RoadSegment position={[20, 0.1, 0]} length={60} width={8} type="street" />
      <RoadSegment position={[-20, 0.1, 0]} length={60} width={8} type="street" />
      <RoadSegment position={[0, 0.1, 20]} length={60} width={8} rotation={Math.PI/2} type="street" />
      <RoadSegment position={[0, 0.1, -20]} length={60} width={8} rotation={Math.PI/2} type="street" />
      
      {/* Connecting roads */}
      <RoadSegment position={[40, 0.1, 0]} length={40} width={6} type="street" />
      <RoadSegment position={[-40, 0.1, 0]} length={40} width={6} type="street" />
      <RoadSegment position={[0, 0.1, 40]} length={40} width={6} rotation={Math.PI/2} type="street" />
      <RoadSegment position={[0, 0.1, -40]} length={40} width={6} rotation={Math.PI/2} type="street" />
      
      {/* Intersections */}
      <Intersection position={[0, 0.1, 0]} size={14} />
      <Intersection position={[20, 0.1, 0]} size={12} />
      <Intersection position={[-20, 0.1, 0]} size={12} />
      <Intersection position={[0, 0.1, 20]} size={12} />
      <Intersection position={[0, 0.1, -20]} size={12} />
      
      {/* Wider sidewalks for NPC walking */}
      <Sidewalk position={[6, 0.15, 0]} length={100} width={3} />
      <Sidewalk position={[-6, 0.15, 0]} length={100} width={3} />
      <Sidewalk position={[0, 0.15, 6]} length={100} width={3} rotation={Math.PI/2} />
      <Sidewalk position={[0, 0.15, -6]} length={100} width={3} rotation={Math.PI/2} />
      
      {/* Crosswalks at intersections */}
      <RoadSegment position={[0, 0.12, 0]} length={14} width={1} rotation={Math.PI/2} type="street" />
      <RoadSegment position={[0, 0.12, 0]} length={14} width={1} type="street" />
      <RoadSegment position={[20, 0.12, 0]} length={12} width={1} rotation={Math.PI/2} type="street" />
      <RoadSegment position={[20, 0.12, 0]} length={12} width={1} type="street" />
      
      {/* Parking lots */}
      <RoadSegment position={[15, 0.1, 15]} length={20} width={15} type="street" />
      <RoadSegment position={[-15, 0.1, 15]} length={20} width={15} type="street" />
      <RoadSegment position={[15, 0.1, -15]} length={20} width={15} type="street" />
      <RoadSegment position={[-15, 0.1, -15]} length={20} width={15} type="street" />
      
      {/* Road side barriers */}
      <RoadSegment position={[12, 0.15, 0]} length={100} width={0.5} type="street" />
      <RoadSegment position={[-12, 0.15, 0]} length={100} width={0.5} type="street" />
      <RoadSegment position={[0, 0.15, 12]} length={100} width={0.5} rotation={Math.PI/2} type="street" />
      <RoadSegment position={[0, 0.15, -12]} length={100} width={0.5} rotation={Math.PI/2} type="street" />
    </group>
  )
}
