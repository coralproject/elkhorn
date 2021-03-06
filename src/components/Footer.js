import preact from 'preact'
const { h, Component } = preact

import WarningIcon from './WarningIcon'

class Footer extends Component {

  render () {
    return (
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          { this.props.recaptcha ? <Recaptcha recaptcha={this.props.recaptcha} /> : '' }
          <div tabindex='0' style={styles.footerConditions} dangerouslySetInnerHTML={{ __html: this.props.conditions }}></div>
          <div style={styles.footerActions}>
            <button
              className="submit-button"
              style={Object.assign({},
                styles.submit,
                {
                  background: this.props.theme.submitButtonBackground,
                  text: this.props.theme.submitButtonText
                }
              )}
              onClick={this.props.onSubmit}>{this.props.cta}</button>
            {
              this.props.hasErrors ?
                <div style={styles.footerError}><WarningIcon /> There are one or more errors with your responses. Please see above.</div>
              : null
            }
          </div>
        </div>
      </footer>
    )
  }
}

class Recaptcha extends Component {

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div>
        <script src='https://www.google.com/recaptcha/api.js'></script>
        <div class="g-recaptcha" data-sitekey={this.props.recaptcha}></div>
      </div>
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
    padding: '30px 40px'
  },
  footerActions: {
    textAlign: 'right'
  },
  footerConditions: {
    margin: '0 0 20px 0'
  },
  footerError: {
    color: '#D0021B',
    fontSize: '.9em',
    textAlign: 'left',
    marginTop: '10px'
  },
  submit: {
    background: '#F67D6E',
    fontSize: '11pt',
    display: 'block',
    width: '100%',
    padding: '0px 20px',
    lineHeight: '40px',
    fontWeight: 'bold',
    borderRadius: '4px',
    border: 'none',
    color: 'white',
    textTransform: 'uppercase',
    cursor: 'pointer'
  }
}

export default Footer
