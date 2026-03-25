import { create } from 'zustand'
import { createNoise2D } from 'simplex-noise'

const noise2D = createNoise2D()
const CHUNK_SIZE = 64
const WATER_LEVEL = 0 // Adjusted water level

const getElevation = (x, z) => {
  // Combine multiple frequencies (octaves) for dramatic, mountain-like terrain
  let e = noise2D(x / 60, z / 60) * 15   // Macro mountains
  e += noise2D(x / 20, z / 20) * 5       // Mid-level hills
  e += noise2D(x / 8, z / 8) * 1.5       // Micro details
  return Math.floor(e)
}

const spawnTree = (x, y, z, cubes) => {
  const treeHeight = Math.floor(Math.random() * 3) + 3 // 3 to 5
  // Trunk
  for (let i = 0; i < treeHeight; i++) {
    cubes.push({ pos: [x, y + i, z], type: 'wood', built: false })
  }
  // Leaves
  const leafTop = y + treeHeight
  for (let lx = -2; lx <= 2; lx++) {
    for (let ly = -2; ly <= 1; ly++) {
      for (let lz = -2; lz <= 2; lz++) {
        // Create a spherical-ish canopy
        if (Math.abs(lx) + Math.abs(ly) + Math.abs(lz) <= 3) {
           // don't overwrite the trunk
           if (lx !== 0 || lz !== 0 || ly >= 0) {
             cubes.push({ pos: [x + lx, leafTop + ly, z + lz], type: 'leaves', built: false })
           }
        }
      }
    }
  }
}

const generateChunk = () => {
  const cubes = []
  for (let x = -CHUNK_SIZE / 2; x < CHUNK_SIZE / 2; x++) {
    for (let z = -CHUNK_SIZE / 2; z < CHUNK_SIZE / 2; z++) {
      let y = getElevation(x, z)
      
      // If below water level, it's underwater (sand/dirt) and water on top
      if (y <= WATER_LEVEL) {
        // Fill up to water level with water
        for (let wy = y + 1; wy <= WATER_LEVEL; wy++) {
          cubes.push({ pos: [x, wy, z], type: 'water', built: false })
        }
        cubes.push({ pos: [x, y, z], type: 'dirt', built: false }) // riverbed
        cubes.push({ pos: [x, y - 1, z], type: 'stone', built: false })
      } else {
        // Land
        cubes.push({ pos: [x, y, z], type: 'grass', built: false })
        cubes.push({ pos: [x, y - 1, z], type: 'dirt', built: false })
        cubes.push({ pos: [x, y - 2, z], type: 'dirt', built: false })
        
        // Chance to spawn tree on land
        if (Math.random() < 0.02) {
          spawnTree(x, y + 1, z, cubes)
        }
      }

      for (let dy = 3; dy < 6; dy++) {
        cubes.push({ pos: [x, y - dy, z], type: 'stone', built: false })
      }
    }
  }
  return cubes
}

const initialCubes = generateChunk()
const initialMap = {}
initialCubes.forEach(c => initialMap[`${c.pos[0]},${c.pos[1]},${c.pos[2]}`] = c)

export const useStore = create((set) => ({
  cubes: initialCubes,
  cubesMap: initialMap,
  playerPosRef: { current: [0, 20, 0] },
  selectedBlockType: 'grass',
  setBlockType: (type) => set({ selectedBlockType: type }),
  addCube: (x, y, z) => {
    set((state) => {
      const newCube = { pos: [x, y, z], type: state.selectedBlockType, built: true }
      return {
        cubes: [...state.cubes, newCube],
        cubesMap: { ...state.cubesMap, [`${x},${y},${z}`]: newCube }
      }
    })
  },
  removeCube: (x, y, z) => {
    set((state) => {
      const newMap = { ...state.cubesMap }
      delete newMap[`${x},${y},${z}`]
      return {
        cubes: state.cubes.filter(cube => cube.pos[0] !== x || cube.pos[1] !== y || cube.pos[2] !== z),
        cubesMap: newMap
      }
    })
  }
}))
