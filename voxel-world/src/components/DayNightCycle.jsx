import { useFrame, useThree } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { useRef } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Color } from 'three'

export function DayNightCycle() {
  const { scene, gl } = useThree()
  const ambientRef = useRef()
  const dirLightRef = useRef()
  const skyRef = useRef()

  useFrame((_, delta) => {
    useGameStore.getState().tickTime(delta)
    useGameStore.getState().tickWeather(delta)

    const t = useGameStore.getState().timeOfDay
    const weather = useGameStore.getState().weather

    // 0=midnight, 0.25=sunrise, 0.5=noon, 0.75=sunset
    const isNight = t < 0.2 || t > 0.8
    const sunAngle = t * Math.PI * 2

    // Sun position
    const sunX = Math.cos(sunAngle) * 100
    const sunY = Math.sin(sunAngle) * 100
    const sunZ = 20

    // Ambient & directional light intensity
    const baseIntensity = isNight ? 0.05 : Math.max(0.05, Math.sin(sunAngle))
    if (ambientRef.current) ambientRef.current.intensity = baseIntensity * 0.5
    if (dirLightRef.current) {
      dirLightRef.current.intensity = Math.max(0, baseIntensity * 1.5)
      dirLightRef.current.position.set(sunX, sunY, sunZ)
    }

    // Fog & sky color
    const dayFog = new Color('#87CEEB')
    const nightFog = new Color('#050720')
    const sunsetFog = new Color('#FF6347')
    
    let fogColor
    if (t > 0.7 && t < 0.85) fogColor = sunsetFog.lerp(nightFog, (t - 0.7) / 0.15)
    else if (t > 0.2 && t < 0.35) fogColor = nightFog.clone().lerp(dayFog, (t - 0.2) / 0.15)
    else if (isNight) fogColor = nightFog
    else fogColor = dayFog

    if (weather === 'rain') fogColor.multiplyScalar(0.6)

    scene.fog.color.copy(fogColor)
    scene.background = fogColor

    // Star visibility at night via material opacity — handled via sky component
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight
        ref={dirLightRef}
        position={[100, 100, 20]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <Sky
        ref={skyRef}
        sunPosition={[
          Math.cos(useGameStore.getState().timeOfDay * Math.PI * 2) * 100,
          Math.sin(useGameStore.getState().timeOfDay * Math.PI * 2) * 100,
          20
        ]}
      />
    </>
  )
}
