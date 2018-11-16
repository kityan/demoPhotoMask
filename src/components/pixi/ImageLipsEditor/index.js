import * as PIXI from 'pixi.js'
import ImageViewerMasked from 'pixi/ImageViewerMasked/'
import computeControlPoints from './../../../misc/computeControlPoints'

class ImageLipsEditor extends ImageViewerMasked {

  constructor(placeholder, imageBlobURL, imageManipulationParams, lipsPoints, cb_updateLipsPoints) {
    super(placeholder, imageBlobURL, imageManipulationParams)
    this.cb_updateLipsPoints = cb_updateLipsPoints
    this.lips = {
      points: lipsPoints
    }
  }

  onResourcesReady() {
    super.onResourcesReady()
    this.createLips()
  }

  destroy() {
    super.destroy()
    this.lips.graphics.circles.forEach(circle => {
      circle.removeAllListeners()
      circle.destroy()
    })
    this.lips.graphics.lipsLines.destroy()
  }

  createLips() {
    this.lips.graphics = {
      circles: [],
      lipsLines: new PIXI.Graphics(),
      lipsMask: new PIXI.Graphics()
    }
    this.lips.graphics.lipsMask.visible = false
    for (let index in this.lips.points) {
      let {
        x,
        y
      } = this.lips.points[index]
      let circle = new PIXI.Graphics()
        .beginFill(0x06abec, 1)
        .drawCircle(0, 0, 8)
        .endFill()
      circle.x = x
      circle.y = y
      circle.pointIndex = +index
      this.lips.graphics.circles.push(circle)
    }

    this.stage.addChild(this.lips.graphics.lipsLines)
    this.stage.addChild(this.lips.graphics.lipsMask)

    this.lips.graphics.circles.forEach(circle => {
      this.stage.addChild(circle)
      createDragAndDropFor(circle, this)
    })

    this.lips.shouldRedrawLipsLines = true
  }

  redrawLipsLines() {
    if (!this.lips.shouldRedrawLipsLines) {
      return
    }

    let {
      points
    } = this.lips

    let virtualPoint1 = {
      x: points[0].x,
      y: points[3].y - (points[1].y - points[0].y),
    }
    let virtualPoint2 = {
      x: points[2].x,
      y: points[3].y - (points[1].y - points[2].y),
    }


    let pxTop = computeControlPoints(
      [points[0].x, points[1].x, points[2].x]
    )
    let pyTop = computeControlPoints(
      [points[0].y, points[1].y, points[2].y]
    )

    let pxBottom = computeControlPoints(
      [virtualPoint2.x, points[3].x, virtualPoint1.x]
    )
    let pyBottom = computeControlPoints(
      [virtualPoint2.y, points[3].y, virtualPoint1.y]
    )

    this.lips.graphics.lipsLines
      .clear()
      .lineStyle(3, 0x06abec, 1)
      .moveTo(points[0].x, points[0].y)
      .bezierCurveTo(pxTop.p1[0], pyTop.p1[0], pxTop.p2[0], pyTop.p2[0], points[1].x, points[1].y)
      .bezierCurveTo(pxTop.p1[1], pyTop.p1[1], pxTop.p2[1], pyTop.p2[1], points[2].x, points[2].y)
      .lineTo(virtualPoint2.x, virtualPoint2.y)
      .bezierCurveTo(pxBottom.p1[0], pyBottom.p1[0], pxBottom.p2[0], pyBottom.p2[0], points[3].x, points[3].y)
      .bezierCurveTo(pxBottom.p1[1], pyBottom.p1[1], pxBottom.p2[1], pyBottom.p2[1], virtualPoint1.x, virtualPoint1.y)
      .lineTo(points[0].x, points[0].y)

    this.lips.graphics.lipsMask
      .clear()
      .beginFill(0xFFFFFF)
      .moveTo(points[0].x, points[0].y)
      .bezierCurveTo(pxTop.p1[0], pyTop.p1[0], pxTop.p2[0], pyTop.p2[0], points[1].x, points[1].y)
      .bezierCurveTo(pxTop.p1[1], pyTop.p1[1], pxTop.p2[1], pyTop.p2[1], points[2].x, points[2].y)
      .lineTo(virtualPoint2.x, virtualPoint2.y)
      .bezierCurveTo(pxBottom.p1[0], pyBottom.p1[0], pxBottom.p2[0], pyBottom.p2[0], points[3].x, points[3].y)
      .bezierCurveTo(pxBottom.p1[1], pyBottom.p1[1], pxBottom.p2[1], pyBottom.p2[1], virtualPoint1.x, virtualPoint1.y)
      .lineTo(points[0].x, points[0].y)
      .endFill()

    this.lips.shouldRedrawLipsLines = false
  }

  update() {
    this.redrawLipsLines()
    super.update()
  }

  // send up to React
  updateLipsPoints() {
    this.cb_updateLipsPoints(this.lips.points)
  }

  getFaceImage() {
    // [?] anchor and mask fails if Canvas?
    // [?] faceMask fails if Canvas?
    this.lips.graphics.circles.forEach(circle => circle.visible = false)
    this.lips.graphics.lipsLines.visible = false
    const face = this.renderer.plugins.extract.image(this.stage)
    this.lips.graphics.circles.forEach(circle => circle.visible = true)
    this.lips.graphics.lipsLines.visible = true
    return face
  }

  getLipsImage() {
    // [?] mask of mask? multiple masks?
    // [?] antialiasing extract fails if WebGL?
    this.lips.graphics.circles.forEach(circle => circle.visible = false)
    this.lips.graphics.lipsLines.visible = false
    this.lips.graphics.lipsMask.visible = true
    this.image.mask = this.lips.graphics.lipsMask
    this.faceMask.visible = false
    const lips = this.renderer.plugins.extract.image(this.stage)
    this.faceMask.visible = true
    this.image.mask = this.faceMask
    this.lips.graphics.lipsMask.visible = false
    this.lips.graphics.circles.forEach(circle => circle.visible = true)
    this.lips.graphics.lipsLines.visible = true
    return lips
  }


}

function createDragAndDropFor(target, that) {
  target.interactive = true;
  target.on('pointerdown', function (e) {
    e.currentTarget.pointerDown = true
  })
  let up = (e) => {
    delete e.currentTarget.pointerDown
  }
  target.on('pointerup', up)
  target.on('pointerup', up)
  target.on('pointermove', function (e) {
    const obj = e.currentTarget
    if (obj.pointerDown) {
      let {
        x,
        y
      } = e.data.getLocalPosition(obj.parent)
      obj.x = x
      obj.y = y
      that.lips.points = [...that.lips.points]
      that.lips.points[obj.pointIndex] = {
        x,
        y
      }
      that.updateLipsPoints()
      that.lips.shouldRedrawLipsLines = true
    }
  })
}

function avg(a, b) {
  return (a + b) / 2
}

export default ImageLipsEditor
