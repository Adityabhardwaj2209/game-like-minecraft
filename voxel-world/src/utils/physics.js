export const checkVoxelCollision = (nx, ny, nz, map, height = 1.6, treatWaterAsSolid = false) => {
  const rX = Math.round(nx)
  const rZ = Math.round(nz)
  const feetY = Math.round(ny - height)
  const bodyY = Math.round(ny - (height / 2))
  const headY = Math.round(ny)
  
  const isSolid = (yLevel) => {
    const block = map[`${rX},${yLevel},${rZ}`]
    if (!block) return false
    if (block.type === 'leaves') return false
    if (block.type === 'water') return treatWaterAsSolid
    return true
  }
  
  return isSolid(feetY) || isSolid(bodyY) || isSolid(headY)
}

export const getHighestBlockY = (x, z, map) => {
  const rX = Math.round(x)
  const rZ = Math.round(z)
  for (let y = 30; y >= -10; y--) {
    if (map[`${rX},${y},${rZ}`]) {
      return y
    }
  }
  return 0 // Fallback
}

export const getHighestWalkableBlockY = (x, z, map) => {
  const rX = Math.round(x)
  const rZ = Math.round(z)
  for (let y = 30; y >= -10; y--) {
    const block = map[`${rX},${y},${rZ}`]
    if (!block) continue
    if (block.type === 'water' || block.type === 'leaves') continue
    return y
  }
  return 0
}
