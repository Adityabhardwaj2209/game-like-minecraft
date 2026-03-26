import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { glassTexture, concreteTexture, woodTexture, stoneTexture } from '../textures'

const OfficeBuilding = ({ position, height = 20 }) => {
  const buildingGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Main structure
    const structureGeometry = new THREE.BoxGeometry(12, height, 10)
    const structureMaterial = new THREE.MeshStandardMaterial({
      color: '#ecf0f1',
      roughness: 0.6
    })
    const structure = new THREE.Mesh(structureGeometry, structureMaterial)
    structure.position.set(0, height/2, 0)
    group.add(structure)
    
    // Windows grid
    const windowMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7
    })
    
    const windowGeometry = new THREE.BoxGeometry(1.5, 2, 0.2)
    
    // Front and back windows
    for (let floor = 0; floor < Math.floor(height / 3); floor++) {
      for (let col = 0; col < 5; col++) {
        // Front windows
        const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial)
        frontWindow.position.set(-4 + col * 2, 2 + floor * 3, 5.1)
        group.add(frontWindow)
        
        // Back windows
        const backWindow = new THREE.Mesh(windowGeometry, windowMaterial)
        backWindow.position.set(-4 + col * 2, 2 + floor * 3, -5.1)
        group.add(backWindow)
      }
    }
    
    // Side windows
    for (let floor = 0; floor < Math.floor(height / 3); floor++) {
      for (let col = 0; col < 3; col++) {
        // Left side
        const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial)
        leftWindow.position.set(-6.1, 2 + floor * 3, -3 + col * 3)
        leftWindow.rotation.y = Math.PI / 2
        group.add(leftWindow)
        
        // Right side
        const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial)
        rightWindow.position.set(6.1, 2 + floor * 3, -3 + col * 3)
        rightWindow.rotation.y = Math.PI / 2
        group.add(rightWindow)
      }
    }
    
    // Entrance
    const entranceGeometry = new THREE.BoxGeometry(3, 4, 0.5)
    const entranceMaterial = new THREE.MeshStandardMaterial({
      color: '#34495e',
      roughness: 0.7
    })
    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial)
    entrance.position.set(0, 2, 5.25)
    group.add(entrance)
    
    // Glass entrance doors
    const doorGeometry = new THREE.BoxGeometry(2.5, 3, 0.2)
    const doorMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    })
    const doors = new THREE.Mesh(doorGeometry, doorMaterial)
    doors.position.set(0, 1.5, 5.3)
    group.add(doors)
    
    // Roof details
    const roofDetailGeometry = new THREE.BoxGeometry(14, 0.5, 12)
    const roofDetailMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.5
    })
    const roofDetail = new THREE.Mesh(roofDetailGeometry, roofDetailMaterial)
    roofDetail.position.set(0, height + 0.25, 0)
    group.add(roofDetail)
    
    return group
  }, [height])

  return (
    <group position={position}>
      <primitive object={buildingGeometry} />
    </group>
  )
}

const ApartmentBuilding = ({ position, floors = 8 }) => {
  const buildingGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Main structure
    const structureGeometry = new THREE.BoxGeometry(8, floors * 3, 8)
    const structureMaterial = new THREE.MeshStandardMaterial({
      color: '#e8daef',
      roughness: 0.6
    })
    const structure = new THREE.Mesh(structureGeometry, structureMaterial)
    structure.position.set(0, (floors * 3) / 2, 0)
    group.add(structure)
    
    // Balconies
    const balconyMaterial = new THREE.MeshStandardMaterial({
      color: '#95a5a6',
      roughness: 0.7,
      metalness: 0.3
    })
    
    for (let floor = 1; floor < floors; floor++) {
      for (let unit = 0; unit < 2; unit++) {
        const balconyGeometry = new THREE.BoxGeometry(3, 0.2, 2)
        const balcony = new THREE.Mesh(balconyGeometry, balconyMaterial)
        balcony.position.set(unit === 0 ? -5.5 : 5.5, floor * 3, 0)
        group.add(balcony)
        
        // Balcony railing
        const railingGeometry = new THREE.BoxGeometry(3, 1, 0.1)
        const railing = new THREE.Mesh(railingGeometry, balconyMaterial)
        railing.position.set(unit === 0 ? -5.5 : 5.5, floor * 3 + 0.6, 1)
        group.add(railing)
      }
    }
    
    // Windows
    const windowMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.7
    })
    
    const windowGeometry = new THREE.BoxGeometry(2, 1.5, 0.2)
    
    for (let floor = 0; floor < floors; floor++) {
      for (let unit = 0; unit < 2; unit++) {
        for (let room = 0; room < 2; room++) {
          const window = new THREE.Mesh(windowGeometry, windowMaterial)
          window.position.set(
            unit === 0 ? -4.1 : 4.1, 
            floor * 3 + 1.5, 
            -2 + room * 4
          )
          group.add(window)
        }
      }
    }
    
    // Entrance
    const entranceGeometry = new THREE.BoxGeometry(2, 3, 0.5)
    const entranceMaterial = new THREE.MeshStandardMaterial({
      color: '#34495e',
      roughness: 0.7
    })
    const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial)
    entrance.position.set(0, 1.5, 4.25)
    group.add(entrance)
    
    return group
  }, [floors])

  return (
    <group position={position}>
      <primitive object={buildingGeometry} />
    </group>
  )
}

const Shop = ({ position, type = 'general' }) => {
  const shopGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Building base
    const baseGeometry = new THREE.BoxGeometry(6, 4, 5)
    let baseMaterial = new THREE.MeshStandardMaterial({
      color: '#f39c12',
      roughness: 0.6
    })
    
    if (type === 'cafe') {
      baseMaterial = new THREE.MeshStandardMaterial({
        color: '#8b4513',
        roughness: 0.7
      })
    } else if (type === 'electronics') {
      baseMaterial = new THREE.MeshStandardMaterial({
        color: '#3498db',
        roughness: 0.5
      })
    }
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.position.set(0, 2, 0)
    group.add(base)
    
    // Shop window
    const shopWindowMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    })
    
    const shopWindowGeometry = new THREE.BoxGeometry(4, 2.5, 0.2)
    const shopWindow = new THREE.Mesh(shopWindowGeometry, shopWindowMaterial)
    shopWindow.position.set(0, 2.5, 2.6)
    group.add(shopWindow)
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.3)
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.8
    })
    const door = new THREE.Mesh(doorGeometry, doorMaterial)
    door.position.set(0, 1.25, 2.65)
    group.add(door)
    
    // Sign
    const signGeometry = new THREE.BoxGeometry(5, 0.8, 0.3)
    let signMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.5
    })
    
    if (type === 'cafe') {
      signMaterial = new THREE.MeshStandardMaterial({
        color: '#27ae60',
        roughness: 0.5
      })
    } else if (type === 'electronics') {
      signMaterial = new THREE.MeshStandardMaterial({
        color: '#9b59b6',
        roughness: 0.5
      })
    }
    
    const sign = new THREE.Mesh(signGeometry, signMaterial)
    sign.position.set(0, 4.2, 2.65)
    group.add(sign)
    
    // Shop details based on type
    if (type === 'cafe') {
      // Outdoor tables
      const tableGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 8)
      const tableMaterial = new THREE.MeshStandardMaterial({
        map: woodTexture,
        roughness: 0.8
      })
      
      for (let i = 0; i < 2; i++) {
        const table = new THREE.Mesh(tableGeometry, tableMaterial)
        table.position.set(-2 + i * 4, 0.1, -1)
        group.add(table)
        
        // Chairs
        const chairGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.4)
        const chairMaterial = new THREE.MeshStandardMaterial({
          color: '#8b4513',
          roughness: 0.7
        })
        
        for (let j = 0; j < 2; j++) {
          const chair = new THREE.Mesh(chairGeometry, chairMaterial)
          chair.position.set(-2.5 + i * 4 + j * 1, 0.4, -1)
          group.add(chair)
        }
      }
    } else if (type === 'electronics') {
      // Display shelves inside (visible through window)
      const shelfGeometry = new THREE.BoxGeometry(3, 0.2, 0.8)
      const shelfMaterial = new THREE.MeshStandardMaterial({
        color: '#34495e',
        roughness: 0.6
      })
      
      for (let i = 0; i < 3; i++) {
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial)
        shelf.position.set(0, 1 + i * 0.8, 2.2)
        group.add(shelf)
      }
    }
    
    return group
  }, [type])

  return (
    <group position={position}>
      <primitive object={shopGeometry} />
    </group>
  )
}

const Skyscraper = ({ position, height = 40 }) => {
  const skyscraperGeometry = useMemo(() => {
    const group = new THREE.Group()
    
    // Main tower
    const towerGeometry = new THREE.BoxGeometry(10, height, 10)
    const towerMaterial = new THREE.MeshStandardMaterial({
      color: '#bdc3c7',
      roughness: 0.5,
      metalness: 0.3
    })
    const tower = new THREE.Mesh(towerGeometry, towerMaterial)
    tower.position.set(0, height/2, 0)
    group.add(tower)
    
    // Glass facade
    const glassMaterial = new THREE.MeshStandardMaterial({
      map: glassTexture,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.6
    })
    
    const glassGeometry = new THREE.BoxGeometry(9.8, height - 2, 9.8)
    const glassFacade = new THREE.Mesh(glassGeometry, glassMaterial)
    glassFacade.position.set(0, height/2, 0)
    group.add(glassFacade)
    
    // Spire
    const spireGeometry = new THREE.ConeGeometry(1, 8, 8)
    const spireMaterial = new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.4,
      metalness: 0.6
    })
    const spire = new THREE.Mesh(spireGeometry, spireMaterial)
    spire.position.set(0, height + 4, 0)
    group.add(spire)
    
    // Antenna
    const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 6)
    const antennaMaterial = new THREE.MeshStandardMaterial({
      color: '#2c3e50',
      roughness: 0.6,
      metalness: 0.4
    })
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial)
    antenna.position.set(0, height + 11, 0)
    group.add(antenna)
    
    return group
  }, [height])

  return (
    <group position={position}>
      <primitive object={skyscraperGeometry} />
    </group>
  )
}

export const Buildings = () => {
  return (
    <group>
      {/* Office buildings */}
      <OfficeBuilding position={[40, 0, 20]} height={25} />
      <OfficeBuilding position={[-40, 0, 20]} height={18} />
      <OfficeBuilding position={[40, 0, -20]} height={22} />
      
      {/* Apartment buildings */}
      <ApartmentBuilding position={[-40, 0, -20]} floors={10} />
      <ApartmentBuilding position={[25, 0, 35]} floors={8} />
      <ApartmentBuilding position={[-25, 0, 35]} floors={6} />
      
      {/* Shops */}
      <Shop position={[15, 0, 15]} type="general" />
      <Shop position={[-15, 0, 15]} type="cafe" />
      <Shop position={[15, 0, -15]} type="electronics" />
      <Shop position={[-15, 0, -15]} type="general" />
      <Shop position={[0, 0, 25]} type="cafe" />
      <Shop position={[0, 0, -25]} type="electronics" />
      
      {/* Skyscrapers */}
      <Skyscraper position={[60, 0, 0]} height={45} />
      <Skyscraper position={[-60, 0, 0]} height={35} />
    </group>
  )
}
