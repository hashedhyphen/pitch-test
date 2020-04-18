import { Component, h } from "preact"

import UI from "./ui"

if ((module as any).hot) {
  // tslint:disable-next-line:no-var-requires
  require("preact/debug")
}

type State = {
  oscillator: OscillatorNode | null
  isOscillatorStarted: boolean
  isOscillatorConnected: boolean
}

class App extends Component {
  state: State = {
    oscillator: null,
    isOscillatorStarted: false,
    isOscillatorConnected: false,
  }

  componentDidMount() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    const audioCtx = new AudioContext()
    this.setState({ oscillator: audioCtx.createOscillator() })
  }

  updateOscillator = (frequency: number, shouldPlay: boolean) => {
    if (!this.state.oscillator) {
      return
    }
    const theOscillator = this.state.oscillator

    if (!this.state.isOscillatorStarted) {
      theOscillator.start()
      this.setState({ isOscillatorStarted: true })
    }

    theOscillator.frequency.value = frequency

    const dest = theOscillator.context.destination
    if (shouldPlay && !this.state.isOscillatorConnected) {
      theOscillator.connect(dest)
      this.setState({ isOscillatorConnected: true })
    }
    if (!shouldPlay && this.state.isOscillatorConnected) {
      theOscillator.disconnect(dest)
      this.setState({ isOscillatorConnected: false })
    }
  }

  render() {
    return (
      <div id="app">
        <UI updateOscillator={this.updateOscillator} />
      </div>
    )
  }
}

export default App
