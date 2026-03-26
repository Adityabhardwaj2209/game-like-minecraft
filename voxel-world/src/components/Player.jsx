import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import { Vector3, Euler } from 'three'
import { useKeyboard } from '../hooks/useKeyboard'
import { useStore } from '../store/useStore'
import { useGameStore } from '../store/useGameStore'
import { checkVoxelCollision, getHighestWalkableBlockY } from '../utils/physics'
import { sounds, resumeAudio } from '../utils/sounds'
import { grassTexture, dirtTexture, stoneTexture, woodTexture, glassTexture, waterTexture, leavesTexture } from '../textures'

const blockTypes = { grass: grassTexture, dirt: dirtTexture, stone: stoneTexture, wood: woodTexture, glass: glassTexture, water: waterTexture, leaves: leavesTexture }

const SPEED = 5
const JUMP_FORCE = 8
const GRAVITY = 30

const PlayerAvatar = () => {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#f1c27d" />
      </mesh>
      {/* Body */}
      <mesh position={[0, -0.75, 0]}>
        <boxGeometry args={[0.6, 1.0, 0.3]} />
        <meshStandardMaterial color="#00bcd4" />
      </mesh>
      {/* Left Arm */}
      <mesh position={[-0.45, -0.75, 0]}>
        <boxGeometry args={[0.2, 1.0, 0.2]} />
        <meshStandardMaterial color="#f1c27d" />
      </mesh>
      {/* Right Arm */}
      <mesh position={[0.45, -0.75, 0]}>
        <boxGeometry args={[0.2, 1.0, 0.2]} />
        <meshStandardMaterial color="#f1c27d" />
      </mesh>
      {/* Left Leg */}
      <mesh position={[-0.15, -1.6, 0]}>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.15, -1.6, 0]}>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
    </group>
  )
}

export function Player({ onBlockBreak }) {
  const { camera } = useThree()
  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboard()
  const isTraveling = useGameStore(s => s.isTraveling)
  const cinematicMode = useGameStore(s => s.cinematicMode)
  
  const velocity = useRef(new Vector3(0, 0, 0))
  const isGrounded = useRef(false)
  
  // Start exactly on top of the ground
  const startingY = getHighestWalkableBlockY(0, 0, useStore.getState().cubesMap) + 2
  const position = useRef(new Vector3(0, startingY, 0)) 
  
  const avatarRef = useRef()
  const handRef = useRef()
  const gunBodyRef = useRef()
  const muzzleFlashRef = useRef()
  const recoilProgress = useRef(0) // 0 = rest, 1 = peak recoil
  const recoilDir = useRef(1) // 1 = recoiling backward, -1 = returning
  const isStriking = useRef(false)
  const footstepTimer = useRef(0)
  const playerPosRef = useStore(state => state.playerPosRef)
  const selectedBlockType = useStore(state => state.selectedBlockType)

  const [isFpv, setIsFpv] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle Camera on 'V'
      if (e.code === 'KeyV') setIsFpv(prev => !prev)
    }
    const handleMouseDown = (e) => {
      if (e.button === 0 || e.button === 2) {
        isStriking.current = true
        recoilProgress.current = 0
        recoilDir.current = 1 // start kick back
        setTimeout(() => { isStriking.current = false }, 200)
      }
    }
    const handlePointerLock = () => resumeAudio()
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('pointerlockchange', handlePointerLock)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('pointerlockchange', handlePointerLock)
    }
  }, [])

  useFrame((state, delta) => {
    const pendingTeleport = useGameStore.getState().pendingTeleport
    if (pendingTeleport) {
      position.current.set(pendingTeleport[0], pendingTeleport[1], pendingTeleport[2])
      velocity.current.set(0, 0, 0)
      isGrounded.current = false
      useGameStore.getState().consumeTeleport()
    }

    if (isTraveling || cinematicMode) {
      playerPosRef.current[0] = position.current.x
      playerPosRef.current[1] = position.current.y
      playerPosRef.current[2] = position.current.z
      camera.position.copy(position.current)
      return
    }

    // Basic Custom Physics
    velocity.current.y -= GRAVITY * delta

    const direction = new Vector3()
    const frontVector = new Vector3(0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0))
    const sideVector = new Vector3((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0)
    
    // Transform movement direction relative to camera's YAW only
    const euler = new Euler(0, 0, 0, 'YXZ')
    euler.setFromQuaternion(camera.quaternion)
    
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(new Euler(0, euler.y, 0))

    velocity.current.x = direction.x
    velocity.current.z = direction.z

    if (jump && isGrounded.current) {
      velocity.current.y = JUMP_FORCE
      isGrounded.current = false
      sounds.jump()
    }

    // Footstep sounds
    const isMoving = moveForward || moveBackward || moveLeft || moveRight
    if (isMoving && isGrounded.current) {
      footstepTimer.current += delta
      if (footstepTimer.current > 0.38) {
        sounds.footstep()
        footstepTimer.current = 0
      }
    } else {
      footstepTimer.current = 0
    }

    // VOXEL COLLISION SYSTEM
    const checkCollision = (nx, ny, nz) => {
      const map = useStore.getState().cubesMap
      return checkVoxelCollision(nx, ny, nz, map, 1.6)
    }

    // Move X
    const tempX = position.current.x + velocity.current.x * delta
    if (!checkCollision(tempX, position.current.y, position.current.z)) {
      position.current.x = tempX
    } else { velocity.current.x = 0 }

    // Move Z
    const tempZ = position.current.z + velocity.current.z * delta
    if (!checkCollision(position.current.x, position.current.y, tempZ)) {
      position.current.z = tempZ
    } else { velocity.current.z = 0 }

    // Move Y
    const tempY = position.current.y + velocity.current.y * delta
    if (velocity.current.y < 0) { // falling
      const map = useStore.getState().cubesMap
      const rX = Math.round(position.current.x)
      const rZ = Math.round(position.current.z)
      const feetBlockY = Math.round(tempY - 1.6)
      const block = map[`${rX},${feetBlockY},${rZ}`]

      if (block && block.type !== 'water' && block.type !== 'leaves') {
         velocity.current.y = 0
         isGrounded.current = true
         position.current.y = feetBlockY + 2.1 // Snap feet exactly to block top
      } else {
         position.current.y = tempY
         isGrounded.current = false
      }
    } else if (velocity.current.y > 0) { // jumping
      const headBlockY = Math.round(tempY + 0.4)
      const map = useStore.getState().cubesMap
      const block = map[`${Math.round(position.current.x)},${headBlockY},${Math.round(position.current.z)}`]
      if (block && block.type !== 'water' && block.type !== 'leaves') {
         velocity.current.y = 0
      } else { position.current.y = tempY }
    } else {
      // standing, check if ground vanished
      const map = useStore.getState().cubesMap
      const feetBlockY = Math.round(position.current.y - 1.6 - 0.1)
      const block = map[`${Math.round(position.current.x)},${feetBlockY},${Math.round(position.current.z)}`]
      if (!block || block.type === 'water' || block.type === 'leaves') {
         isGrounded.current = false
      }
    }

    // Safety net fallback
    if (position.current.y < -10) position.current.y = 20

    // Avatar Transform Binding
    if (avatarRef.current) {
      avatarRef.current.position.copy(position.current)
      avatarRef.current.rotation.y = euler.y
      
      const avatarBody = avatarRef.current.children[0]
      if (avatarBody && avatarBody.children.length >= 6) {
        // Simple Leg animation while walking
        if (moveForward || moveBackward || moveLeft || moveRight) {
          const time = state.clock.getElapsedTime()
          const jumpFactor = isGrounded.current ? 1 : 0
          const legRotation = Math.sin(time * 10) * 0.5 * jumpFactor
          // Right leg
          avatarBody.children[5].rotation.x = legRotation
          // Left leg
          avatarBody.children[4].rotation.x = -legRotation
          // Right arm
          avatarBody.children[3].rotation.x = -legRotation
          // Left arm
          avatarBody.children[2].rotation.x = legRotation
        } else {
          // Reset arms and legs
          for(let i=2; i<=5; i++){
            avatarBody.children[i].rotation.x = 0
          }
        }
      }
    }

    // Sync position to global store for Minimap
    playerPosRef.current[0] = position.current.x
    playerPosRef.current[1] = position.current.y
    playerPosRef.current[2] = position.current.z

    // Camera perspective binding
    if (isFpv) {
      camera.position.copy(position.current)
      
      // Update First-Person Hand (Gun)
      if (handRef.current) {
         handRef.current.position.copy(camera.position)
         handRef.current.quaternion.copy(camera.quaternion)
         
         // Base offset: gun in bottom-right view
         handRef.current.translateZ(-0.55)
         handRef.current.translateX(0.32)
         handRef.current.translateY(-0.28)
         
         const time = state.clock.getElapsedTime()
         // Idle breathing bob
         handRef.current.translateY(Math.sin(time * 1.6) * 0.008)
         handRef.current.translateX(Math.sin(time * 0.9) * 0.004)

         // Walk bob — more pronounced sway
         if (moveForward || moveBackward || moveLeft || moveRight) {
           handRef.current.translateY(Math.sin(time * 10) * 0.025)
           handRef.current.translateX(Math.sin(time * 5) * 0.012)
         }

         // --- Recoil spring animation ---
         if (isStriking.current && recoilDir.current === 1) {
           recoilProgress.current = Math.min(1, recoilProgress.current + delta * 12)
           if (recoilProgress.current >= 1) recoilDir.current = -1
         } else if (recoilDir.current === -1) {
           recoilProgress.current = Math.max(0, recoilProgress.current - delta * 6)
         }

         const recoil = recoilProgress.current
         handRef.current.translateZ(recoil * 0.08)    // kick backward
         handRef.current.translateY(-recoil * 0.04)   // dip down
         if (handRef.current.rotation) {
           handRef.current.rotation.x -= recoil * 0.25  // tilt up on recoil
         }

         // Muzzle flash
         if (muzzleFlashRef.current) {
           muzzleFlashRef.current.visible = recoil > 0.4 && recoilDir.current === 1
         }
      }
    } else {
      // Third-person view logic
      const idealOffset = new Vector3(0, 1.5, 5) // 5 units backwards, 1.5 up
      idealOffset.applyQuaternion(camera.quaternion)
      idealOffset.add(position.current)
      camera.position.copy(idealOffset)
    }
  })

  return (
    <>
      <PointerLockControls />
      
      {/* Third Person Full Avatar */}
      <group ref={avatarRef} visible={!isFpv}>
        <PlayerAvatar />
      </group>

      {/* First Person Gun (right-hand) */}
      <group ref={handRef} visible={isFpv}>
        {/* Lower Arm */}
        <mesh position={[0, -0.2, 0.12]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.14, 0.55, 0.14]} />
          <meshStandardMaterial color="#f1c27d" />
        </mesh>

        {/* Gun body group — offset for recoil ref */}
        <group ref={gunBodyRef} position={[0, 0, 0]}>
          {/* Main receiver */}
          <mesh position={[0, 0.04, -0.12]}>
            <boxGeometry args={[0.11, 0.12, 0.35]} />
            <meshStandardMaterial color="#2c2c2c" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Barrel */}
          <mesh position={[0, 0.06, -0.38]}>
            <boxGeometry args={[0.055, 0.055, 0.28]} />
            <meshStandardMaterial color="#111" metalness={1} roughness={0.05} />
          </mesh>

          {/* Scope rail */}
          <mesh position={[0, 0.12, -0.12]}>
            <boxGeometry args={[0.04, 0.04, 0.2]} />
            <meshStandardMaterial color="#444" metalness={0.8} />
          </mesh>

          {/* Front sight */}
          <mesh position={[0, 0.16, -0.32]}>
            <boxGeometry args={[0.02, 0.06, 0.02]} />
            <meshStandardMaterial color="#f39c12" emissive="#f39c12" emissiveIntensity={0.5} />
          </mesh>
          {/* Rear sight */}
          <mesh position={[0, 0.14, -0.04]}>
            <boxGeometry args={[0.07, 0.04, 0.02]} />
            <meshStandardMaterial color="#555" />
          </mesh>

          {/* Trigger guard */}
          <mesh position={[0, -0.04, -0.1]}>
            <boxGeometry args={[0.03, 0.04, 0.12]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>

          {/* Handle */}
          <mesh position={[0, -0.1, -0.03]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.09, 0.18, 0.08]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>

          {/* Magazine */}
          <mesh position={[0, -0.09, -0.14]}>
            <boxGeometry args={[0.07, 0.14, 0.06]} />
            <meshStandardMaterial color="#222" />
          </mesh>

          {/* Muzzle Flash — only visible on shoot */}
          <group ref={muzzleFlashRef} visible={false} position={[0, 0.06, -0.55]}>
            <mesh>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#ff8800" emissive="#ffaa00" emissiveIntensity={5} transparent opacity={0.85} />
            </mesh>
            <pointLight color="#ff8800" intensity={3} distance={2} />
          </group>
        </group>
      </group>
    </>
  )
}
