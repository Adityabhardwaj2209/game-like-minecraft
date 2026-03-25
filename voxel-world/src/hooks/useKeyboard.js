import { useState, useEffect } from 'react'

const keys = {
  KeyW: 'moveForward',
  KeyS: 'moveBackward',
  KeyA: 'moveLeft',
  KeyD: 'moveRight',
  Space: 'jump',
}

export const useKeyboard = () => {
  const [actions, setActions] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (keys[e.code]) {
        setActions((prev) => ({ ...prev, [keys[e.code]]: true }))
      }
    }
    const handleKeyUp = (e) => {
      if (keys[e.code]) {
        setActions((prev) => ({ ...prev, [keys[e.code]]: false }))
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return actions
}
