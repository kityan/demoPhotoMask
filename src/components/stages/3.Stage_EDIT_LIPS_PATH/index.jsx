import React, { Component } from 'react'
import * as classes from './styles.scss'
import ImageLipsEditor from 'pixi/ImageLipsEditor/'
import saveAs from 'file-saver'

class Stage_EDIT_LIPS_PATH extends Component {

  pixiPlaceholderRef = React.createRef()

  componentDidMount() {
    this.imageViewer = new ImageLipsEditor(
      this.pixiPlaceholderRef.current,
      this.props.imageBlobURL,
      this.props.imageManipulationParams,
      this.props.lipsPoints,
      this.props.updateLipsPoints
    )
  }

  downloadPhoto = () => {
    const img = this.imageViewer.getFaceImage()
    saveAs(img.src, 'face.png')
  }

  downloadLips = () => {
    const img = this.imageViewer.getLipsImage()
    saveAs(img.src, 'lips.png')
  }

  downloadData = () => {
    const jsonString = JSON.stringify({ imageManipulationParams: this.props.imageManipulationParams, lipsPoints: this.props.lipsPoints })
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' })
    saveAs(blob, 'data.json')
  }

  componentWillUnmount() {
    this.imageViewer.destroy()
  }

  render() {
    return (
      <React.Fragment>
        <div className={classes.pixiPlacehodler} ref={this.pixiPlaceholderRef}></div>
        <div className={classes.buttonsPanel}>
          <button className="back" onClick={this.props.back}>back</button>
          <button onClick={this.downloadPhoto}>download photo</button>
          <button onClick={this.downloadLips}>download lips</button>
          <button onClick={this.downloadData}>download data</button>

        </div>
      </React.Fragment>
    )
  }

}

export default Stage_EDIT_LIPS_PATH
