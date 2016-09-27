import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField'

class TextField extends AskField {

  constructor (props, context) {
    super(props, context)
    // extend the state from AskWidget
    this.state = Object.assign(
      this.state,
      {
        value: this.props.text || '',
        isValid: true,
        error: {}
      }
    )

    this.onBlur = this.onBlur.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  // Event listeners

  onKeyUp (e) {
    switch (e.keyCode) {
      case 13: // Enter
        this.validateAndSave()
        break
      default:
        break
    }
  }

  onChange (e) {
    this.setState({
      value: (e.target.value).trim()
    })
  }

  onBlur () {
    this.validateAndSave()
  }

  // Compute styles for different field states
  getStyles () {
    return Object.assign({},
      styles.base,
      this.state.isValid ? styles.valid : styles.error,
      this.props.submitted && (this.props.wrapper.required && !this.state.isCompleted) ? styles.error : styles.valid,
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
    let isCompleted = false

    // This is very unlikely
    if (this.state.value.length > this.props.maxLength) {
      this.props.setValidationMessage(`Your response should have no more than ${this.props.maxLength} characters.`)
    }

    // This condition would override the previous message
    if (this.state.value.length < this.props.minLength) {
      this.props.setValidationMessage(`Your response should have at least ${this.props.minLength} characters.`)
    }

    if (this.props.maxLength) {
      isValid = (this.state.value.length <= this.props.maxLength)
    }

    if (this.state.value.length && this.props.minLength) {
      isValid = (this.state.value.length >= this.props.minLength)
    }

    isCompleted = !!this.state.value.length

    this.setState({
      isValid: isValid,
      completed: isCompleted
    })

    return this.props.wrapper.required ? isValid && isCompleted : isValid
  }

  getValue () {
    return { text: this.state.value.length ? this.state.value : '' }
  }

  render () {
    const { title, placeholder, maxLength, minLength } = this.props;
    const { value } = this.state;

    return (
      <div>
        <input
          className="text-field"
          type="text"
          title={title}
          style={this.getStyles()}
          placeholder={placeholder}
          defaultValue={value}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
          maxLength={maxLength ? maxLength : false}
        />

        {
          maxLength
          ? <div style={styles.remaining}>{maxLength - value.length} chars remaining.</div>
          : null
        }

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
  },
  error: {
    border: '1px solid red'
  }
}

export default TextField
