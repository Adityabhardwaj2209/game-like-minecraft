import { CanvasTexture, NearestFilter, RepeatWrapping } from 'three'

const createTexture = (baseColor, pixelColor, probability = 0.5) => {
  const canvas = document.createElement('canvas')
  canvas.width = 16
  canvas.height = 16
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = baseColor
  ctx.fillRect(0, 0, 16, 16)

  for(let i=0; i<16; i++){
      for(let j=0; j<16; j++){
          if (Math.random() < probability) {
              ctx.fillStyle = pixelColor
              ctx.fillRect(i, j, 1, 1)
          }
      }
  }

  const texture = new CanvasTexture(canvas)
  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  return texture
}

export const dirtTexture = createTexture('#5c3a21', '#4a2f1a', 0.5)
export const grassTexture = createTexture('#51853a', '#447031', 0.5)
export const stoneTexture = createTexture('#808080', '#696969', 0.5)
export const woodTexture = createTexture('#8B4513', '#6b3610', 0.3)
export const glassTexture = createTexture('#ADD8E6', '#87CEFA', 0.1)
export const waterTexture = createTexture('#1E90FF', '#00BFFF', 0.2)
export const leavesTexture = createTexture('#228B22', '#006400', 0.4)
export const asphaltTexture = createTexture('#2c2c2c', '#1a1a1a', 0.3)
export const concreteTexture = createTexture('#a9a9a9', '#808080', 0.2)
export const roadLineTexture = createTexture('#f4f4f4', '#ffffff', 0.8)
