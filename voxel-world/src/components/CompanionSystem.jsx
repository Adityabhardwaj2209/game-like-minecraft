import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore'

const CompanionCharacter = ({ position }) => {
  const companionRef = useRef()
  const [currentAction, setCurrentAction] = useState('idle')
  const [followPlayer, setFollowPlayer] = useState(false)
  const actionTimer = useRef(0)
  
  useFrame((state) => {
    if (!companionRef.current) return
    
    const time = state.clock.getElapsedTime()
    const { playerPos } = useStore.getState()
    
    // Change actions periodically
    if (time - actionTimer.current > 5) {
      const actions = ['idle', 'wave', 'dance', 'jump']
      setCurrentAction(actions[Math.floor(Math.random() * actions.length)])
      actionTimer.current = time
    }
    
    // Follow player if close enough
    const distance = Math.sqrt(
      Math.pow(playerPos[0] - companionRef.current.position.x, 2) +
      Math.pow(playerPos[2] - companionRef.current.position.z, 2)
    )
    
    if (distance < 10 && distance > 2) {
      const direction = new THREE.Vector3(
        playerPos[0] - companionRef.current.position.x,
        0,
        playerPos[2] - companionRef.current.position.z
      ).normalize()
      
      companionRef.current.position.x += direction.x * 0.02
      companionRef.current.position.z += direction.z * 0.02
      
      // Rotate to face player
      const angle = Math.atan2(direction.x, direction.z)
      companionRef.current.rotation.y = angle
    }
    
    // Perform actions
    if (currentAction === 'wave') {
      companionRef.current.children[2].rotation.z = Math.sin(time * 5) * 0.5
    } else if (currentAction === 'dance') {
      companionRef.current.rotation.y = Math.sin(time * 3) * 0.2
      companionRef.current.position.y = position[1] + Math.sin(time * 4) * 0.1
    } else if (currentAction === 'jump') {
      companionRef.current.position.y = position[1] + Math.abs(Math.sin(time * 2)) * 0.5
    } else {
      companionRef.current.position.y = position[1]
      companionRef.current.children[2].rotation.z = 0
    }
  })

  const companionGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Hair
    const hairGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.5)
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: '#8b4513',
      roughness: 0.8
    })
    const hair = new THREE.Mesh(hairGeometry, hairMaterial)
    hair.position.set(0, 0.3, 0)
    group.add(hair)
    
    // Head
    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
    const headMaterial = new THREE.MeshStandardMaterial({
      color: '#d8b08a',
      roughness: 0.85
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.set(0, 0, 0)
    group.add(head)
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8)
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: '#4169e1',
      roughness: 0.3
    })
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    leftEye.position.set(-0.1, 0, 0.18)
    group.add(leftEye)
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial)
    rightEye.position.set(0.1, 0, 0.18)
    group.add(rightEye)
    
    // Smile
    const smileGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.05)
    const smileMaterial = new THREE.MeshStandardMaterial({
      color: '#ff69b4',
      roughness: 0.5
    })
    const smile = new THREE.Mesh(smileGeometry, smileMaterial)
    smile.position.set(0, -0.1, 0.18)
    group.add(smile)
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: '#ff69b4',
      roughness: 0.75
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.set(0, -0.6, 0)
    group.add(body)
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.15)
    const armMaterial = new THREE.MeshStandardMaterial({
      color: '#d8b08a',
      roughness: 0.85
    })
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-0.35, -0.6, 0)
    group.add(leftArm)
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(0.35, -0.6, 0)
    group.add(rightArm)
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2)
    const legMaterial = new THREE.MeshStandardMaterial({
      color: '#4b3627',
      roughness: 0.8
    })
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
    leftLeg.position.set(-0.15, -1.3, 0)
    group.add(leftLeg)
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
    rightLeg.position.set(0.15, -1.3, 0)
    group.add(rightLeg)
    
    return group
  }, [])

  return (
    <group ref={companionRef} position={position}>
      <primitive object={companionGeometry} />
    </group>
  )
}

const CompanionDialog = ({ isVisible, message }) => {
  if (!isVisible) return null

  return (
    <div style={{
      position: 'absolute',
      top: '40%',
      left: '50%',
      transform: 'translateX(-50%)',
      color: '#ffffff',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      backgroundColor: 'rgba(255,105,180,0.8)',
      padding: '15px 25px',
      borderRadius: '20px',
      border: '2px solid rgba(255,255,255,0.5)',
      maxWidth: '300px',
      textAlign: 'center',
      zIndex: 100,
      animation: 'bounceIn 0.5s ease-out',
      pointerEvents: 'none'
    }}>
      💕 {message}
    </div>
  )
}

export const CompanionSystem = () => {
  const [dialogMessage, setDialogMessage] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const lastDialogTime = useRef(0)
  
  const companionMessages = [
    "Hey! Want to explore the city together?",
    "This place is amazing! Let's go on an adventure!",
    "I found a great spot for watching the sunset!",
    "Race you to the beach!",
    "Let's get some ice cream!",
    "You're my favorite person to hang out with!",
    "The city lights are so beautiful tonight!",
    "Want to go for a drive?",
    "I love spending time with you!",
    "Let's make some memories together!"
  ]

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const { playerPos } = useStore.getState()
    
    // Show dialog when player is near
    const companionPos = [5, 0, 5]
    const distance = Math.sqrt(
      Math.pow(playerPos[0] - companionPos[0], 2) +
      Math.pow(playerPos[2] - companionPos[2], 2)
    )
    
    if (distance < 5 && time - lastDialogTime.current > 8) {
      const randomMessage = companionMessages[Math.floor(Math.random() * companionMessages.length)]
      setDialogMessage(randomMessage)
      setShowDialog(true)
      lastDialogTime.current = time
      
      setTimeout(() => {
        setShowDialog(false)
      }, 4000)
    }
  })

  return (
    <group>
      <CompanionCharacter position={[5, 0, 5]} />
      <CompanionDialog isVisible={showDialog} message={dialogMessage} />
    </group>
  )
}
