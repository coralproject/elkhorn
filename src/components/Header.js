import preact from 'preact'
const { h, Component } = preact

class Header extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      text: this.props.text || ''
    }
  }

  render() {
    return (
      <header style={ styles.base }>
        <h1 style={ styles.h1 }>{ this.props.text }</h1>
      </header>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    background: '#1565C0',
    padding: '40px 20px',
  },
  h1: {
    fontSize: '18pt',
    fontWeight: '600',
    color: 'white'
  }
}

export default Header;
