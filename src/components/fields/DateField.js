import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField';

import 'react-date-picker/index.css'

import DatePicker from 'react-date-picker'

let date = '2014-10-10' //or Date.now()

class DateField extends AskField {

  constructor(props, context) {
    super(props, context)
    // extend the state from AskWidget
    this.state = Object.assign(
      this.state,
      { selectedDate: Date.now() },
      {
        value: this.props.text || ''
      }
    );
  }

  // Event listeners

  onKeyDown(e) {
    switch (e.keyCode) {
      case 13: // Enter
        this.validateAndSave();
      break
      default:
        this.setState({ value: e.target.value });
      break;
    }
  }

  onChange(e) {
    this.setState({ value: e.target.value });
  }

  onBlur() {
    this.validateAndSave();
  }

  // Compute styles for different field states
  getStyles() {
    return Object.assign({},
      styles.base,
      this.props.isValid ? styles.valid : styles.error,
      this.state.focused ? styles.focused : {},
      { backgroundColor: this.props.theme.inputBackground }
    );
  }

  validateAndSave(options) {
    this.validate();
    this.update(options);
  }

  // Interface methods

  validate() {

    let isValid = true, isCompleted = false;

    isCompleted = !!this.state.value.length;

    this.setState({ isValid: isValid, completed: isCompleted });

    return !!this.props.required ?  isValid && isCompleted : isValid;

  }

  getValue() {
    return { text: this.state.value.length ? this.state.value : '' };
  }

  onChange(dateString, { dateMoment, timestamp }){
    this.setState({ selectedDate: dateString });
  }

  getStyles() {
    return Object.assign({},
      styles.textInput,
      this.props.isValid ? styles.valid : styles.error,
      this.state.focused ? styles.focused : {},
      { backgroundColor: this.props.theme.inputBackground }
    );
  }

  render() {
    return (
      <div style={ styles.base }>
        <input
          type="text"
          style={ this.getStyles() }
          value={ this.state.selectedDate } />
        <DatePicker
          minDate='2014-04-04'
          maxDate='2016-10-10'
          date={ this.state.selectedDate }
          onChange={ this.onChange.bind(this) }
        />
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
  },
}

export default DateField;
