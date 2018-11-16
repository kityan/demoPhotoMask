import React, { Component } from 'react'
import APP_STAGES from 'constants/APP_STAGES'
import DEFAULT_IMAGE_MANIPULATION_PARAMS from 'constants/DEFAULT_IMAGE_MANIPULATION_PARAMS'
import DEFAULT_LIPS_POINTS from 'constants/DEFAULT_LIPS_POINTS'
import { Stage_LOAD_IMAGE, Stage_MANIPULATE_IMAGE, Stage_EDIT_LIPS_PATH } from './components/stages/'
//import face from 'images/face.jpg'

window.URL = window.URL || window.webkitURL

class App extends Component {

  state = {
    stage: APP_STAGES.LOAD_IMAGE,
    imageBlobURL: null,
    imageManipulationParams: DEFAULT_IMAGE_MANIPULATION_PARAMS,
    lipsPoints: DEFAULT_LIPS_POINTS
  }

  componentDidMount() {
    window.addEventListener('contextmenu', e => e.preventDefault())

    // for development, to skip open file dialog
    // _jumpInDevMode.call(this, face, APP_STAGES.EDIT_LIPS_PATH)

  }

  render() {
    return (
      (this.state.stage === APP_STAGES.LOAD_IMAGE && <Stage_LOAD_IMAGE
        setImageBlobURL={this.setImageBlobURL}
      />) ||
      (this.state.stage === APP_STAGES.MANIPULATE_IMAGE && <Stage_MANIPULATE_IMAGE
        imageBlobURL={this.state.imageBlobURL}
        imageManipulationParams={this.state.imageManipulationParams}
        updateImageManipulationParams={this.updateImageManipulationParams}
        back={this.back}
        next={this.next}
      />) ||
      (this.state.stage === APP_STAGES.EDIT_LIPS_PATH && <Stage_EDIT_LIPS_PATH
        imageBlobURL={this.state.imageBlobURL}
        imageManipulationParams={this.state.imageManipulationParams}
        lipsPoints={this.state.lipsPoints}
        updateLipsPoints={this.updateLipsPoints}
        back={this.back}
      />)
    )
  }

  setImageBlobURL = imageBlobURL => {
    // reset previous if exists
    if (this.state.imageBlobURL != null) {
      if (PIXI.utils.TextureCache[this.state.setImageBlobURL]) {
        PIXI.utils.TextureCache[this.state.setImageBlobURL].destroy()
      }
      if (PIXI.utils.BaseTextureCache[this.state.setImageBlobURL]) {
        PIXI.utils.BaseTextureCache[this.state.setImageBlobURL].destroy()
      }
      window.URL.revokeObjectURL(this.state.setImageBlobURL)
      this.setState(prevState => ({ imageManipulationParams: DEFAULT_IMAGE_MANIPULATION_PARAMS }))
      this.setState(prevState => ({ lipsPoints: DEFAULT_LIPS_POINTS }))
    }
    this.setState(prevState => ({ imageBlobURL }))
    this.toStage(APP_STAGES.MANIPULATE_IMAGE)
  }

  toStage = stage => {
    this.setState(prevState => ({ stage }))
  }

  next = () => {
    this.toStage(this.state.stage + 1)
  }

  back = () => {
    this.toStage(this.state.stage - 1)
  }

  updateImageManipulationParams = (imageManipulationParams) => {
    this.setState(prevState => ({ imageManipulationParams }))
  }
  updateLipsPoints = (lipsPoints) => {
    this.setState(prevState => ({ lipsPoints }))
  }

}


/**
 * Jump to stage in development mode after image is loaded
 * @param {*} img URL to load
 * @param {*} toStage App's stage to jump
 */
function _jumpInDevMode(img, toStage) {
  fetch(img)
    .then(res => res.blob())
    .then(blob => {
      this.setState(() => ({
        stage: toStage,
        imageBlobURL: window.URL.createObjectURL(blob),
        imageManipulationParams: {
          rotation: -0.1, scale: 0.8, position: { x: 226, y: 378 }
        },
        lipsPoints: DEFAULT_LIPS_POINTS
      }))
  })
}


export default App
