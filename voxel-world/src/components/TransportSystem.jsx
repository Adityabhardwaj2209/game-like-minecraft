import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useStore } from '../store/useStore'
import { useGameStore } from '../store/useGameStore'

const vehicleColors = {
  car: '#e67e22',
  bus: '#f1c40f',
  train: '#3498db',
  airplane: '#ecf0f1'
}

const islandNodes = {
  central: [0, 2, 0],
  north: [0, 2, -24],
  east: [24, 2, 0],
  west: [-24, 2, 0]
}

function VehicleDisplay({ type, offset = [0, 0, 0], fly = false }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.6
    if (fly) ref.current.position.y = offset[1] + Math.sin(t * 2) * 0.25
  })

  return (
    <group ref={ref} position={offset}>
      <mesh>
        <boxGeometry args={type === 'train' ? [1.2, 0.45, 0.35] : [0.9, 0.4, 0.5]} />
        <meshStandardMaterial color={vehicleColors[type]} />
      </mesh>
      {type === 'airplane' && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.06, 0.25]} />
          <meshStandardMaterial color="#bdc3c7" />
        </mesh>
      )}
    </group>
  )
}

export function TransportSystem() {
  const selectedVehicle = useGameStore(s => s.selectedVehicle)
  const activeIsland = useGameStore(s => s.activeIsland)
  const isTraveling = useGameStore(s => s.isTraveling)
  const startTravel = useGameStore(s => s.startTravel)
  const playerPosRef = useStore(s => s.playerPosRef)

  const nearbyIslandId = useMemo(() => {
    const [px, , pz] = playerPosRef.current
    let nearest = null
    let minDist = Infinity
    Object.entries(islandNodes).forEach(([id, [x, , z]]) => {
      const dx = px - x
      const dz = pz - z
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < minDist) {
        minDist = dist
        nearest = id
      }
    })
    return minDist <= 8 ? nearest : null
  }, [playerPosRef.current[0], playerPosRef.current[2]])

  const destinations = nearbyIslandId
    ? Object.keys(islandNodes).filter(id => id !== nearbyIslandId)
    : []

  return (
    <>
      {Object.entries(islandNodes).map(([id, pos]) => (
        <group key={id} position={pos}>
          <mesh>
            <cylinderGeometry args={[1.6, 1.6, 0.2, 24]} />
            <meshStandardMaterial color={id === activeIsland ? '#2ecc71' : '#7f8c8d'} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color="#95a5a6" />
          </mesh>
        </group>
      ))}

      <VehicleDisplay type="car" offset={[0, 3.4, 0]} />
      <VehicleDisplay type="bus" offset={[0, 3.4, -24]} />
      <VehicleDisplay type="train" offset={[24, 3.4, 0]} />
      <VehicleDisplay type="airplane" offset={[-24, 6.5, 0]} fly />

      {!isTraveling && nearbyIslandId && (
        <group position={islandNodes[nearbyIslandId]}>
          {destinations.map((id, index) => (
            <mesh
              key={id}
              position={[index * 1.4 - ((destinations.length - 1) * 0.7), 1.9, 0]}
              onClick={(e) => {
                e.stopPropagation()
                startTravel(id)
              }}
            >
              <boxGeometry args={[1.1, 0.28, 1.1]} />
              <meshStandardMaterial color={vehicleColors[selectedVehicle]} />
            </mesh>
          ))}
        </group>
      )}
    </>
  )
}

export function TransportHUD() {
  const islands = useGameStore(s => s.islands)
  const activeIsland = useGameStore(s => s.activeIsland)
  const selectedVehicle = useGameStore(s => s.selectedVehicle)
  const setSelectedVehicle = useGameStore(s => s.setSelectedVehicle)
  const isTraveling = useGameStore(s => s.isTraveling)
  const travelStatus = useGameStore(s => s.travelStatus)
  const playerPosRef = useStore(s => s.playerPosRef)
  const startTravel = useGameStore(s => s.startTravel)

  const currentNode = useMemo(() => {
    const [px, , pz] = playerPosRef.current
    let nearest = null
    let minDist = Infinity
    Object.entries(islandNodes).forEach(([id, [x, , z]]) => {
      const dx = px - x
      const dz = pz - z
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < minDist) {
        minDist = dist
        nearest = id
      }
    })
    return minDist <= 8 ? nearest : null
  }, [playerPosRef.current[0], playerPosRef.current[2]])

  const vehicleOptions = ['car', 'bus', 'train', 'airplane']

  return (
    <div
      style={{
        position: 'absolute',
        left: 20,
        bottom: 20,
        zIndex: 30,
        color: 'white',
        background: 'rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.18)',
        borderRadius: 10,
        padding: 12,
        width: 280,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>Island Transport</div>
      <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>
        Current: {islands[activeIsland]?.name}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {vehicleOptions.map((vehicle) => (
          <button
            key={vehicle}
            onClick={() => setSelectedVehicle(vehicle)}
            style={{
              padding: '4px 8px',
              fontSize: 12,
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              color: selectedVehicle === vehicle ? '#111' : '#fff',
              background: selectedVehicle === vehicle ? '#f1c40f' : 'rgba(255,255,255,0.1)'
            }}
          >
            {vehicle}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, marginBottom: 8 }}>
        {currentNode ? `At terminal: ${islands[currentNode]?.name}` : 'Move closer to an island terminal to travel'}
      </div>

      {currentNode && !isTraveling && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.keys(islands)
            .filter(id => id !== currentNode)
            .map(id => (
              <button
                key={id}
                onClick={() => startTravel(id)}
                style={{
                  padding: '4px 8px',
                  fontSize: 12,
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(52, 152, 219, 0.25)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Go {islands[id].name}
              </button>
            ))}
        </div>
      )}

      <div style={{ marginTop: 10, fontSize: 12, color: isTraveling ? '#f39c12' : '#bdc3c7' }}>
        {travelStatus || 'Select a vehicle, then choose destination.'}
      </div>
    </div>
  )
}
