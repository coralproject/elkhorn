import preact from 'preact'
const { h, Component } = preact

class Header extends Component {
  getHeaderStyles () {
    return Object.assign({}, styles.base, {
      backgroundColor: this.props.theme.headerBackground
    })
  }

  render () {
    return (
      <header style={this.getHeaderStyles()} tabindex='0'>
        <h1
          tabindex='0'
          style={
            Object.assign({}, styles.title, { color: this.props.theme.headerText })
          }>{this.props.title}</h1>
        <h2
          tabindex='0'
          style={
            Object.assign({}, styles.description, { color: this.props.theme.headerIntroText })
          }>{this.props.description}</h2>
      </header>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    background: '#fff',
    padding: '40px'
  },
  title: {
    fontSize: '22pt',
    fontWeight: '700',
    color: '#222',
    textAlign: 'left',
    marginBottom: '20px'
  },
  description: {
    fontSize: '12pt',
    fontWeight: '400',
    color: '#444',
    textAlign: 'left'
  }
}

export default Header
