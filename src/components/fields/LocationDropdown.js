import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField';

class LocationDropdown extends AskField {

  constructor(props, context) {
    super(props, context)
    // extend the state from AskWidget

    var now = new Date();
    var dateString = (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getFullYear();

    this.state = Object.assign(
      this.state,
      {
        selectedDate: Date.now(),
        selectedDateString: dateString,
        dateSelected: false, // a date has manually been selected
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

  onCountryChange() {

  }

  onStateChange() {

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

    isCompleted = !!this.state.selectedDate.length && !!this.state.dateSelected;

    this.setState({ isValid: isValid, completed: isCompleted });

    return !!this.props.required ?  isValid && isCompleted : isValid;

  }

  getValue() {
    return { value: this.state.selectedDate.length ? this.state.selectedDate : '' };
  }

  onDatePickerChange(dateString, { dateMoment, timestamp }){
    this.setState({ selectedDate: dateString, selectedDateString: dateString, dateSelected: true });
    this.validateAndSave();
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
        <select onChange={ this.onCountryChange.bind(this) }>
          <option>United States</option>
          <option>Germany</option>
          <option>Argentina</option>
          <option>Brazil</option>
        </select>
        <select onChange={ this.onStateChange.bind(this) }>
          <option>Texas</option>
          <option>Florida</option>
        </select>
        <input type="text" />
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

export default LocationDropdown;
