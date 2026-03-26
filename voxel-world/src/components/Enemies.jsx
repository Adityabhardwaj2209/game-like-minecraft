import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { Vector3 } from 'three'
import { useGameStore } from '../store/useGameStore'
import { useStore } from '../store/useStore'
import { getHighestBlockY } from '../utils/physics'
import { useMissionStore } from '../store/useMissionStore'
import { sounds } from '../utils/sounds'

const BULLET_KILL_RADIUS = 1.2

const EnemyMesh = () => (
  <group position={[0, -0.5, 0]}>
    {/* Skeleton head */}
    <mesh position={[0, 0.1, 0]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#eee" emissive="#ff0000" emissiveIntensity={0.3} />
    </mesh>
    {/* Skeleton eyes (glowing red) */}
    <mesh position={[-0.1, 0.15, 0.22]}>
      <boxGeometry args={[0.08, 0.08, 0.01]} />
      <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
    </mesh>
    <mesh position={[0.1, 0.15, 0.22]}>
      <boxGeometry args={[0.08, 0.08, 0.01]} />
      <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
    </mesh>
    {/* Body */}
    <mesh position={[0, -0.5, 0]}>
      <boxGeometry args={[0.3, 0.6, 0.15]} />
      <meshStandardMaterial color="#ccc" wireframe />
    </mesh>
    {/* Legs */}
    <mesh position={[-0.1, -1.0, 0]}>
      <boxGeometry args={[0.12, 0.5, 0.12]} />
      <meshStandardMaterial color="#ccc" />
    </mesh>
    <mesh position={[0.1, -1.0, 0]}>
      <boxGeometry args={[0.12, 0.5, 0.12]} />
      <meshStandardMaterial color="#ccc" />
    </mesh>
  </group>
)

const ENEMY_COUNT = 5
const DAMAGE_INTERVAL = 1.5 // seconds between damage ticks
const DAMAGE_AMOUNT = 8
const AGGRO_RANGE = 12
const ATTACK_RANGE = 1.5

export function Enemies() {
  const playerPosRef = useStore(state => state.playerPosRef)
  const cubesMap = useStore(state => state.cubesMap)

  const enemies = useMemo(() => {
    const map = useStore.getState().cubesMap
    return Array(ENEMY_COUNT).fill().map((_, i) => {
      const angle = (i / ENEMY_COUNT) * Math.PI * 2
      const dist = 25 + Math.random() * 10
      const x = Math.cos(angle) * dist
      const z = Math.sin(angle) * dist
      const y = getHighestBlockY(x, z, map) + 2
      return {
        id: i,
        pos: new Vector3(x, y, z),
        velocity: new Vector3(0, 0, 0),
        damageTimer: 0,
        hp: 100,
        isGrounded: true
      }
    })
  }, [])

  const refs = useRef([])

  useFrame((_, delta) => {
    const timeOfDay = useGameStore.getState().timeOfDay
    const isNight = timeOfDay < 0.2 || timeOfDay > 0.8
    const map = useStore.getState().cubesMap
    const playerPos = playerPosRef.current
    const missionProgress = useMissionStore.getState().progress
    const addScore = useGameStore.getState().addScore

    enemies.forEach((enemy, i) => {
      const ref = refs.current[i]
      if (!ref) return

      // Only active at night
      ref.visible = isNight
      if (!isNight) {
        // Reset position away from player
        enemy.pos.y = 999
        enemy.hp = 100 // Restore HP at dawn
        return
      }
      else if (enemy.pos.y === 999) {
        // Respawn at reset position when night falls
        const angle = Math.random() * Math.PI * 2
        const dist = 20 + Math.random() * 10
        enemy.pos.x = (playerPos[0] || 0) + Math.cos(angle) * dist
        enemy.pos.z = (playerPos[2] || 0) + Math.sin(angle) * dist
        enemy.pos.y = getHighestBlockY(enemy.pos.x, enemy.pos.z, map) + 2
      }

      const dx = playerPos[0] - enemy.pos.x
      const dz = playerPos[2] - enemy.pos.z
      const dist = Math.sqrt(dx * dx + dz * dz)

      if (dist < AGGRO_RANGE) {
        // Chase player
        const speed = 2.5
        enemy.velocity.x = (dx / dist) * speed
        enemy.velocity.z = (dz / dist) * speed
        ref.rotation.y = Math.atan2(dx, dz)

        // Leg walking animation
        const legRot = Math.sin(Date.now() * 0.01) * 0.5
        const enemyMesh = ref.children[0]
        if (enemyMesh && enemyMesh.children.length >= 6) {
          // EnemyMesh legs are child indexes 4 and 5.
          enemyMesh.children[4].rotation.x = -legRot
          enemyMesh.children[5].rotation.x = legRot
        }

        // Attack if close
        if (dist < ATTACK_RANGE) {
          enemy.damageTimer += delta
          if (enemy.damageTimer >= DAMAGE_INTERVAL) {
            useGameStore.getState().takeDamage(DAMAGE_AMOUNT)
            sounds.playerHurt()
            enemy.damageTimer = 0
          }
          enemy.velocity.x = 0
          enemy.velocity.z = 0
        }
      } else {
        enemy.velocity.x *= 0.9
        enemy.velocity.z *= 0.9
      }

      // Simple gravity
      enemy.velocity.y -= 25 * delta

      enemy.pos.x += enemy.velocity.x * delta
      enemy.pos.z += enemy.velocity.z * delta

      const tempY = enemy.pos.y + enemy.velocity.y * delta
      const feetY = Math.round(tempY - 1.3)
      const block = map[`${Math.round(enemy.pos.x)},${feetY},${Math.round(enemy.pos.z)}`]
      if (block && block.type !== 'water') {
        enemy.velocity.y = 0
        enemy.pos.y = feetY + 1.8
        enemy.isGrounded = true
      } else {
        enemy.pos.y = tempY
      }

      if (enemy.pos.y < -10) enemy.pos.y = 20
      ref.position.copy(enemy.pos)
    })
  })

  return (
    <>
      {enemies.map((e, i) => (
        <group key={e.id} ref={el => refs.current[i] = el} visible={false}>
          <EnemyMesh />
          {/* Red glow effect */}
          <pointLight color="#ff0000" intensity={0.5} distance={3} />
        </group>
      ))}
    </>
  )
}
