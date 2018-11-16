import React from 'react'
import ReactDOM from 'react-dom'
import * as PIXI from 'pixi.js'

PIXI.utils.skipHello()

import 'normalize.css/normalize.css?global'
import './styles/main.scss?global'

import App from './App';

ReactDOM.render(<App />, document.getElementById('app'))
