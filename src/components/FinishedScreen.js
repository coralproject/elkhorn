import preact from 'preact'
const { h, Component } = preact

class FinishedScreen extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div
        className="final-screen"
        style={styles.finishedScreen}
      >
        <h1>{this.props.title}</h1>
        <p>{this.props.description}</p>
      </div>
    )
  }
}

const styles = {
  finishedScreen: {
    display: 'block',
    background: '#fff',
    padding: '40px',
    textAlign: 'center'
  }
}

export default FinishedScreen
