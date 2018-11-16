import React, { Component } from 'react'
import * as classes from './styles.scss'

class Stage_LOAD_IMAGE extends Component {

  inputFileRef = React.createRef()

  render() {
    return (
      <React.Fragment>
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          className={classes.file}
          ref={this.inputFileRef}
          onChange={(e) => this.handleChange(e.target.files)}
        />
        <button onClick={this.openFileDialog}>open file</button>
      </React.Fragment>
    )
  }

  openFileDialog = () => {
    this.inputFileRef.current.click()
  }

  handleChange = files => {

    let url = window.URL.createObjectURL(files[0])
    this.props.setImageBlobURL(url)
    /*
      let reader = new FileReader()
      reader.onload = () => console.log(reader)
      reader.readAsDataURL(files[0])
    */
  }





}

export default Stage_LOAD_IMAGE

