import preact from 'preact'
const { h, Component } = preact

class Header extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <header style={ styles.base } tabindex="0">
        <h1 tabindex="0" style={ styles.h1 }>{ this.props.text }</h1>
        <h4 tabindex="0" style={ styles.description }>{ this.props.description }</h4>
      </header>
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

export default Header;
