import preact from 'preact'
const { h, Component } = preact

class Footer extends Component {

  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (
      <footer style={ styles.footer }>
        <div style={ styles.footerContent }>
          <h4 tabindex="0" style={ styles.footerConditions }>
            { this.props.conditions }
          </h4>
          <div style={ styles.footerActions }>
            <button
              style={ Object.assign({},
                styles.submit,
                {
                  background: this.props.theme.submitButtonBackground,
                  text: this.props.theme.submitButtonText
                }
              )}
              onClick={ this.props.onSubmit }>Submit</button>
          </div>
        </div>
      </footer>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    background: '#fff',
    padding: '40px'
  },
  h1: {
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
  },
  footer: {
    width: '100%'
  },
  footerContent: {
    padding: '30px 40px',
  },
  footerActions: {
    textAlign: 'right'
  },
  footerConditions: {
    fontSize: '9pt',
    margin: '0 0 20px 0'
  },
  submit: {
    background: '#F67D6E',
    fontSize: '11pt',
    display: 'block',
    width: '100%',
    padding: '0px 20px',
    lineHeight: '40px',
    fontWeight: 'bold',
    borderRadius: '2px',
    border: 'none',
    color: 'white',
    textTransform: 'uppercase',
    cursor: 'pointer'
  }
}

export default Footer
