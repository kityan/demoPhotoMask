import * as PIXI from 'pixi.js'
import mask from 'images/mask.png'
import ImageViewer from 'pixi/ImageViewer/'

class ImageViewerMasked extends ImageViewer {

  getResources() {
    if (!PIXI.utils.TextureCache['mask']) {
      this.loader
        .add('mask', mask)
        .load(() => this.onResourcesReady())
    } else {
      setTimeout(() => this.onResourcesReady(), 0) // to be async in both cases
    }
  }

  onResourcesReady() {
    super.onResourcesReady()
    this.faceMask = new PIXI.Sprite(PIXI.utils.TextureCache['mask'])
    this.faceMask.anchor.set(0.5, 0.5)
    this.faceMask.position.x = Math.ceil((this.renderer.width) / 2)
    this.faceMask.position.y = Math.ceil((this.renderer.height) / 2)
    this.stage.addChild(this.faceMask)
    this.image.mask = this.faceMask
  }

  destroy() {
    this.faceMask.destroy()
    super.destroy()
  }

}

export default ImageViewerMasked
