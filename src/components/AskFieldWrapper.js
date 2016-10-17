import preact from 'preact'

// Trick for static analysis
import __WIDGETS__ from './fields/Types'
const Types = __WIDGETS__

import WarningIcon from './WarningIcon'

const { h, Component } = preact

class AskFieldWrapper extends Component {

  constructor (props, context) {
    super(props, context)
    this._field = null
    this.state = { validationMessage: props.props.validationMessage }
  }

  getStyles () {
    var fieldStyles = {}
    if (this.props.type === 'field') {
      fieldStyles = Object.assign(
        fieldStyles,
        this.props.hasFocus ? styles.focused : styles.blurred,
        this.props.settings.showFieldNumbers ? styles.withNumber : ''
      )
    }

    return Object.assign({},
      styles.formFieldWrapper,
      fieldStyles,
      { backgroundColor: this.props.theme.formBackground }
    )
  }

  getTitleStyles () {
    return Object.assign({},
      styles.fieldTitle,
      this.state.showOutline ? {} : styles.noOutline,
      this.props.hasFocus ? styles.focusedTitle : {},
      this.state.completed && !this.state.isValid ? styles.invalidTitle : {},
      { color: this.props.theme.fieldTitleText }
    )
  }

  saveRef (component) {
    this._field = component
  }

  setValidationMessage (message) {
    this.setState({ validationMessage: message })
  }

  onMouseDown (e) {
    // as recommended by The Paciello Group:
    // https://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
    this.setState({ showOutline: false })
  }

  onKeyDown (e) {
    this.setState({ showOutline: true })
  }

  render () {
    var widgetSpec = this.props
    var wrappedField = h(
      Types[widgetSpec.component],
      Object.assign({},
        widgetSpec.props,
        this.props,
        // Ref takes a callback and passes the component as an argument.
        // What? See: https://github.com/developit/preact/blob/4de2fb9be5201b84f281d0f9d2fcef1017bedd11/src/vdom/component.js#L65
        //    ...and: https://github.com/developit/preact/blob/master/src/hooks.js
        {
          ref: this.saveRef.bind(this),
          setValidationMessage: this.setValidationMessage.bind(this)
        }
      )
    )

    const { title, component, fieldNumber } = this.props

    return (
      <li
        key={this.props.index}
        style={this.getStyles()}
        >
          {
            this.props.type === 'field'
            ? <label
                for={`${component}--${fieldNumber}`}
                style={styles.label}
              >
              <h3
                onMouseDown={this.onMouseDown.bind(this)}
                onKeyDown={this.onKeyDown.bind(this)}
                title={'Field number ' + this.props.fieldNumber}
                tabindex='0'
                style={this.getTitleStyles()}
              >
                  {
                    this.props.type === 'field' && this.props.settings.showFieldNumbers
                    ? <span style={styles.fieldNumber}>{this.props.fieldNumber}.</span>
                    : null
                  }
                  {this.props.title}
                  {
                    this.props.wrapper.required
                    ? <span
                      aria-label='This field is required.'
                      style={
                          Object.assign({},
                            styles.requiredAsterisk,
                            { color: this.props.theme.requiredAsterisk }
                          )
                      }> *</span>
                    : null
                  }
              </h3>
              {
                this.props.description
                ? <p>{this.props.description}</p>
                : null
              }
              {wrappedField}
            </label>
            : wrappedField
          }
          {/* TODO: move this alerts into a component */}
        <div role='alert' aria-atomic='true'>
          {
            this.props.completed && !this.props.isValid
            ? <div
              tabindex='0'
              style={styles.validation}>
              <WarningIcon /> {this.state.validationMessage}
            </div>
            : null
          }
        </div>

        <div role='alert' aria-atomic='true'>
          {
            this.props.wrapper.required && !this.props.completed && this.props.submitted
            ? <div
              tabindex='0'
              style={styles.validation}>
              <WarningIcon /> This question is required.
            </div>
            : null
          }
        </div>
      </li>
    )
  }
}

const styles = {
  label: {
    display: 'block'
  },
  formFieldWrapper: {
    position: 'relative',
    background: 'white'
  },
  withNumber: {
    padding: '15px 40px 20px 40px'
  },
  fieldNumber: {
    color: 'black',
    marginRight: '5px',
    fontWeight: 'bold',
    fontSize: '14pt'
  },
  fieldTitle: {
    display: 'block',
    fontSize: '14pt',
    color: 'black',
    fontWeight: '700',
    marginBottom: '10px'
  },
  focusedTitle: {
    color: 'black'
  },
  invalidTitle: {
    color: '#900'
  },
  validation: {
    color: '#D0021B',
    padding: '10px 0',
    fontSize: '.9em'
  },
  fieldsetReset: {
    border: '0',
    padding: '0.01em 0 0 0',
    margin: '0',
    minWidth: '0',
    display: 'table-cell'
  },
  requiredAsterisk: {
    color: '#939393',
    fontSize: '20pt',
    lineHeight: '10px'
  },
  requiredAsteriskBottom: {
    color: '#E55',
    textAlign: 'right',
    fontSize: '10pt',
    lineHeight: '10px',
    marginTop: 10
  },
  noOutline: {
    outline: 'none'
  }
}

export default AskFieldWrapper
