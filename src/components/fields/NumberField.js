import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField'

class NumberField extends AskField {

  constructor (props, context) {
    super(props, context)
    // extend the state from AskWidget
    this.state = Object.assign(
      this.state,
      {
        value: this.props.text || ''
      }
    )

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  // Event listeners

  onKeyDown (e) {
    switch (e.keyCode) {
      case 13: // Enter
        this.validateAndSave()
        break
      default:
        this.setState({ value: e.target.value })
        break
    }
  }

  onChange (e) {
    this.setState({ value: e.target.value })
  }

  onBlur () {
    this.validateAndSave()
  }

  // Compute styles for different field states
  getStyles () {
    return Object.assign({},
      styles.base,
      this.props.isValid ? styles.valid : styles.error,
      this.state.focused ? styles.focused : {},
      { backgroundColor: this.props.theme.inputBackground }
    )
  }

  validateAndSave (options) {
    this.validate()
    this.update(options)
  }

  // Interface methods

  validate () {
    let isValid = true
    let isCompleted = !!this.state.value.length
    const num = parseFloat(this.state.value.replace(',', '.'))

    if (isCompleted && this.props.validateAs) {
      switch (this.props.validateAs) {
        case 'number':
          isValid = !isNaN(num) && isFinite(num) && !!this.state.value.match(/^\d+$/)

          if (!isValid) {
            this.props.setValidationMessage('Please, type a valid number.')
          }

          break
      }
    }

    if (typeof this.props.minValue !== 'undefined' || typeof this.props.maxValue !== 'undefined') {
      if ((num < this.props.minValue) || (num > this.props.maxValue)) {
        isValid = false
        this.props.setValidationMessage(this.getHelpMessage())
      }
    }

    this.setState({ isValid: isValid, completed: isCompleted })

    return this.props.wrapper.required ? isValid && isCompleted : isValid
  }

  getValue () {
    return { text: this.state.value.length ? this.state.value : '' }
  }

  getHelpMessage () {
    var helpMessage = this.props.placeholder
    if (this.props.minValue && this.props.maxValue) {
      helpMessage = `This number cannot be higher than ${this.props.maxValue} or lower than ${this.props.minValue}.`
    } else {
      if (this.props.maxValue) {
        helpMessage = `Please type a number below ${ this.props.maxValue + 1 }`
      }
      if (this.props.minValue) {
        helpMessage = `Please type a number above ${ this.props.minValue - 1 }`
      }
    }
    return helpMessage
  }

  render () {
    return (
      <div>
        <input
          type='text'
          title={this.props.title}
          style={this.getStyles()}
          placeholder={this.props.placeholder}
          defaultValue={this.state.value}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
      </div>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    fontSize: '14pt',
    color: 'black',
    padding: '10px',
    width: '100%',
    outline: 'none',
    resize: 'none',
    border: '1px solid #ccc',
    transition: 'border .5s',
    borderRadius: '4px'
  },
  focused: {
    // borderBottom: '2px solid #009688'
  },
  remaining: {
    color: '#999',
    fontSize: '10pt',
    padding: '0px',
    textAlign: 'right',
    width: '100%',
    marginTop: '5px'
  }
}

export default NumberField
