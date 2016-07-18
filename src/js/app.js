import 'aframe';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Sky from './components/Sky';

class BoilerplateScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red',
      speed: 0.005,
      posX: 0,
      posY: 0,
      posZ: 0,
      dir: null
    }
  }

  changeColor = () => {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  };

  componentDidMount (){
    setInterval(() => {
      let {posX, posY, posZ, speed} = this.state
      switch(this.state.dir){
        case "f":
          this.setState({posZ: posZ - speed})
          break;
        case "b":
          this.setState({posZ: posZ + speed})
          break;
        case "u":
          this.setState({posY: posY + speed})
          break;
        case "d":
          this.setState({posY: posY - speed})
          break;
        case "r":
          this.setState({posX: posX + speed})
          break;
        case "l":
          this.setState({posX: posX - speed})
          break;
      }
    },1000/60)
    let recognition = new webkitSpeechRecognition()
    recognition.lang = "ja-JP"
    recognition.continuous = true
    recognition.onresult = (event)=> {
      let results = event.results
      let text = results[results.length-1][0].transcript
      console.log(text)
      switch(true){
        case /前|全身/.test(text):
          this.setState({dir:"f"})
          break;
        case /後ろ|交代|止まれ/.test(text):
          this.setState({dir:"b"})
          break;
        case /右/.test(text):
          this.setState({dir:"r"})
          break;
        case /左/.test(text):
          this.setState({dir:"l"})
          break;
        case /上|上昇/.test(text):
          this.setState({dir:"u"})
          break;
        case /下|加工/.test(text):
          this.setState({dir:"d"})
          break;
        case /停止|ストップ/.test(text):
          this.setState({dir:null})
          break;
      }
    }
    recognition.start()
  }

  render () {
    let pos = `${this.state.posX} ${this.state.posY} ${this.state.posZ}`
    return (
      <Scene>
        <Camera position={pos}><Cursor fuse={true}/></Camera>

        <Sky/>

        <Entity light={{type: 'ambient', color: '#888'}}/>
        <Entity light={{type: 'directional', intensity: 0.5}} position={[-1, 1, 0]}/>
        <Entity light={{type: 'directional', intensity: 1}} position={[1, 1, 0]}/>

        <Entity geometry="primitive: box" material={{color: this.state.color}}
                onClick={this.changeColor}
                position="0 0 -5">
          <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>
        </Entity>
      </Scene>
    );
  }
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));
