import * as PIXI from 'pixi.js'


class ImageViewer {

  constructor(placeholder, imageBlobURL, imageManipulationParams) {
    this.imageBlobURL = imageBlobURL
    this.placeholder = placeholder
    this.imageManipulationParams = imageManipulationParams
    this.renderer = new PIXI.WebGLRenderer(placeholder.clientWidth, placeholder.clientHeight, {
      transparent: true,
      antialias: true,
      resolution: 1
    })
    this.stage = new PIXI.Container()
    placeholder.appendChild(this.renderer.view)
    this.ticker = PIXI.ticker.shared
    this.ticker.autoStart = true
    this.loader = new PIXI.loaders.Loader()

    setTimeout(this.init.bind(this), 0) // allow sync assignments in children's constructors
  }

  init() {
    this.getResources()
  }

  getResources() {
    setTimeout(() => this.onResourcesReady(), 0)
  }

  onResourcesReady() {
    if (!PIXI.utils.TextureCache[this.imageBlobURL]) {
      this.image = new PIXI.Sprite(PIXI.Texture.fromImage(this.imageBlobURL))
    } else {
      this.image = new PIXI.Sprite(PIXI.utils.TextureCache[this.imageBlobURL])
    }

    this.image.interactive = true
    this.image.addListener()
    this.image.anchor.set(0.5, 0.5)
    this.image.position.x = Math.ceil((this.renderer.width) / 2)
    this.image.position.y = Math.ceil((this.renderer.height) / 2)
    this.applyImageManipulationParams() // if we have saved
    this.stage.addChild(this.image)

    this.ticker.add(this.update.bind(this))
  }

  update() {
    this.renderer.render(this.stage)
  }

  destroy() {
    this.image.destroy()
    this.ticker.stop()
    this.ticker.destroy()
    this.stage.destroy()
    this.renderer.destroy()
  }

  applyImageManipulationParams() {
    const {
      scale,
      rotation
    } = this.imageManipulationParams
    const {
      x,
      y
    } = this.imageManipulationParams.position

    this.image.scale.x = this.image.scale.y = (scale != null) ? scale : this.image.scale.x
    this.image.rotation = (rotation != null) ? rotation : this.image.rotation
    this.image.position.x = (x != null) ? x : this.image.position.x
    this.image.position.y = (y != null) ? y : this.image.position.y
  }



}

export default ImageViewer
