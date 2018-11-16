import * as PIXI from 'pixi.js'
import visualMask from 'images/visual-mask.png'
import MOUSE_WHEEL_EVENT_NAME from 'constants/MOUSE_WHEEL_EVENT_NAME'
import ImageViewer from 'pixi/ImageViewer/'

const pointerDownModes = {
  ROTATE: 1,
  DRAG: 2,
}

class ImageManipulator extends ImageViewer {
  constructor(placeholder, imageBlobURL, imageManipulationParams, cb_updateImageManipulationParams) {
    super(placeholder, imageBlobURL, imageManipulationParams)
    this.cb_updateImageManipulationParams = cb_updateImageManipulationParams
  }

  getResources() {
    if (!PIXI.utils.TextureCache['visualMask']) {
      this.loader
        .add('visualMask', visualMask)
        .load(() => this.onResourcesReady())
    } else {
      setTimeout(() => this.onResourcesReady(), 0) // to be async in both cases
    }
  }

  onResourcesReady() {
    super.onResourcesReady()
    this.updateImageManipulationParams()
    this.visualMask = new PIXI.Sprite(PIXI.utils.TextureCache['visualMask'])
    this.visualMask.anchor.set(0.5, 0.5)
    this.visualMask.position.x = Math.ceil((this.renderer.width) / 2)
    this.visualMask.position.y = Math.ceil((this.renderer.height) / 2)
    this.stage.addChild(this.visualMask)
    this.initEventHandlers()
  }

  onDocumentKeyDown = e => {
    if (e.key === '0' && e.ctrlKey) {
      this.image.scale.x = this.image.scale.y = 1
    }
  }

  onPointerDown = e => {
    const obj = e.currentTarget
    const pointerPosition = e.data.getLocalPosition(obj.parent)
    obj.initialPointerOffset = {
      x: pointerPosition.x - obj.position.x,
      y: pointerPosition.y - obj.position.y
    }
    obj.initalPointerPosition = pointerPosition
    obj.initialRotationAngle = obj.rotation

    switch (e.data.button) {
      case 2:
        obj.pointerDown = pointerDownModes.ROTATE
        break
      case -1:
        obj.pointerDown = pointerDownModes.DRAG
        break
      default:
        obj.pointerDown = pointerDownModes.DRAG
    }
  }

  onPointerUp = e => {
    const obj = e.currentTarget
    delete obj.pointerDown
  }

  onPointerMove = e => {
    const obj = e.currentTarget
    if (obj.pointerDown === pointerDownModes.ROTATE) {
      // rotating
      const pInitial = obj.initalPointerPosition
      const pNew = e.data.getLocalPosition(obj.parent)
      const center = obj.position
      const angleNew = Math.atan2(center.y - pNew.y, center.x - pNew.x)
      const angleInitial = Math.atan2(center.y - pInitial.y, center.x - pInitial.x)
      obj.rotation = obj.initialRotationAngle - (angleInitial - angleNew)
      this.updateImageManipulationParams()
    } else if (obj.pointerDown === pointerDownModes.DRAG) {
      // dragging
      const newPosition = e.data.getLocalPosition(obj.parent)
      obj.x = newPosition.x - obj.initialPointerOffset.x
      obj.y = newPosition.y - obj.initialPointerOffset.y
      this.updateImageManipulationParams()
    }
  }

  onMouseWheel = e => {
    // prevent browser zoom
    e.preventDefault()

    let step = 0.05

    // modify step with pressed keys
    if (e.ctrlKey) {
      step = 0.5
    } else if (e.shiftKey) {
      step = 0.005
    }
    const propName = ('wheelDelta' in e) ? 'wheelDelta' : 'detail'
    step = e[propName] < 0 ? -step : step

    let newScale = this.image.scale.x + step
    // limit scale factor
    if (newScale > 10) {
      newScale = 10
    }
    if (newScale < 0.1) {
      newScale = 0.1
    }
    // do scale
    this.image.scale.x = this.image.scale.y = newScale
    this.updateImageManipulationParams()
  }


  initEventHandlers() {
    document.addEventListener('keydown', this.onDocumentKeyDown)
    this.placeholder.addEventListener(MOUSE_WHEEL_EVENT_NAME, this.onMouseWheel)
    this.image
      .on('pointerdown', this.onPointerDown)
      .on('pointerup', this.onPointerUp)
      .on('pointerupoutside', this.onPointerUp)
      .on('pointermove', this.onPointerMove)

  }

  destroy() {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
    this.placeholder.removeEventListener(MOUSE_WHEEL_EVENT_NAME, this.onMouseWheel)
    this.visualMask.destroy()
    this.image.removeAllListeners()
    super.destroy()
  }

  // send up to React
  updateImageManipulationParams() {
    this.cb_updateImageManipulationParams({
      scale: this.image.scale.x,
      rotation: this.image.rotation,
      position: {
        x: this.image.position.x,
        y: this.image.position.y,
      }
    })
  }

}

export default ImageManipulator
