import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField';

import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

class DateField extends AskField {

  constructor (props, context) {
    super(props, context)
    // extend the state from AskWidget

    this.state = Object.assign(
      this.state,
      { value: '' }
    )
  }

  componentDidMount () {
    this.datepicker = flatpickr(this._el, { utc: true })
    this.datepicker.set('onChange', d => this.onChange(d))
  }

  onChange (timestamp) {
    this.setState({ value: timestamp })
    this.validateAndSave()
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
    let isCompleted = false
    isCompleted = !!this.state.value.length
    this.setState({ isValid: isValid, completed: isCompleted })
    return this.props.wrapper.required ? isValid && isCompleted : isValid
  }

  getValue () {
    return { value: +this.state.value }
  }

  render () {
    return (
      <div style={styles.base}>
        <input type='text'
          ref={el => { this._el = el }}
          onBlur={this.onBlur.bind(this)}
          style={this.getStyles()} />
      </div>
    )
  }
}

const styles = {
  base: {
    maxWidth: '600px'
  },
  textInput: {
    display: 'block',
    fontSize: '14pt',
    color: 'black',
    padding: '10px',
    width: '100%',
    outline: 'none',
    resize: 'none',
    border: '1px solid #ccc',
    transition: 'border .5s'
  }
}

export default DateField
