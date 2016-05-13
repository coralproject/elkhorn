import preact from 'preact'
const { h, Component } = preact

class FinishedScreen extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <div style={ styles.finishedScreen }>
        <h1>{ this.props.title }</h1>
        <p>{ this.props.description }</p>
      </div>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    background: '#fff',
    padding: '40px',
  },
  h1: {
    fontFamily: 'Martel',
    fontSize: '22pt',
    fontWeight: '700',
    color: '#222',
    textAlign: 'center'
  },
  description: {
    fontFamily: 'Martel',
    fontSize: '12pt',
    fontWeight: '400',
    color: '#444',
    textAlign: 'center'
  }
}

export default FinishedScreen;
