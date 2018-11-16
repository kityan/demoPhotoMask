import React, { Component } from 'react'
import * as classes from './styles.scss'
import ImageManipulator from 'pixi/ImageManipulator/'
import mouse from 'images/mouse.png'
//import _cloneDeep from 'lodash.cloneDeep'

class Stage_MANIPULATE_IMAGE extends Component {

  pixiPlaceholderRef = React.createRef()

  componentDidMount() {
    this.imageManipulator = new ImageManipulator(
      this.pixiPlaceholderRef.current,
      this.props.imageBlobURL,
      this.props.imageManipulationParams,
      this.props.updateImageManipulationParams
    )
  }

  componentWillUnmount() {
    this.imageManipulator.destroy()
  }

  render() {
    return (
      <React.Fragment>
        <div className={classes.pixiPlacehodler} ref={this.pixiPlaceholderRef}></div>
        <div className={classes.buttonsPanel}>
          <img src={mouse} className={classes.mouse}/>
          <button className="back" onClick={this.props.back}>back</button>
          <button onClick={this.props.next}>next</button>
        </div>
      </React.Fragment>
    )
  }

}

export default Stage_MANIPULATE_IMAGE

