import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField';
import CalendarIcon from '../CalendarIcon';

import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

class DateField extends AskField {

  constructor (props, context) {
    super(props, context)
    // extend the state from AskWidget

    this.state = {
      value: ''
    };

  }
  componentDidMount() {
    this.datepicker = flatpickr(this._calendarGroup, { utc: true })
    this.datepicker.set('onChange', d => this.onFlatPickrChange(d))
  }
  onFlatPickrChange(timestamp) {
    var flatPickrDate = new Date(timestamp);
    this.setState({ value: timestamp, day: flatPickrDate.getDate(), month: (flatPickrDate.getMonth() + 1), year: flatPickrDate.getFullYear() });
    this.validateAndSave();
  }
  getStyles () {
    return Object.assign({},
      styles.base,
      this.props.isValid ? styles.valid : styles.error,
      this.state.focused ? styles.focused : {},
      { backgroundColor: this.props.theme.inputBackground }
    )
  }
  validateAndSave(options) {
    if (this.validate()) {
      this.setState({ value: this.buildValue() });
    } else {
      this.setState({ value: '--' });
    }
    this.update(options);
  }
  validate() {
    let isValid = true, isCompleted = false;
    isValid = this.dateIsValid();
    isCompleted = !!this.state.value.length;
    this.setState({ isValid: isValid, completed: isCompleted });
    return !!this.props.wrapper.required ? isValid && isCompleted : isValid;
  }
  buildValue() {
    return this.state.month + "-" + this.state.day + "-" + this.state.year;
  }
  getValue() {
    return { value: this.buildValue() };
  }


  daysInMonth(month, year) {
    // Using 1-based months with 0
    return new Date(year, month, 0).getDate();
  }

  onDateChange() {
    var year = this._year.value
    var month = this._month.value
    var day = this._day.value
    this.setState({ year: year, month: month, day: day })
    this.validateAndSave()
  }

  dateIsValid() {
    var isValid = true;
    var { year, month, day } = this.state;

    if (year < 1916 || year > 2056) {
      isValid = false;
    }

    if (month < 1 || month > 12) {
      isValid = false;
    }

    var daysInMonth = this.daysInMonth(month, year);

    if (day < 1 || day > daysInMonth) {
      isValid = false;
    }

    return isValid;
  }

  getDateInputStyles(part) {
    return Object.assign({},
      styles.dateInput,
      styles[part]
    )
  }

  render() {
    return (
      <div style={ styles.base }>
        <div style={ styles.dateFields }>
          <input
            ref={el => this._month = el}
            type="text"
            placeholder="MM"
            value={ this.state.month }
            onChange={ this.onDateChange.bind(this) }
            style={ this.getDateInputStyles('month') } />
          <input
            ref={el => this._day = el}
            type="text"
            placeholder="DD"
            value={ this.state.day }
            onChange={ this.onDateChange.bind(this) }
            style={ this.getDateInputStyles('day') } />
          <input
            ref={el => this._year = el}
            type="text"
            placeholder="YYYY"
            value={ this.state.year }
            onChange={ this.onDateChange.bind(this) }
            style={ this.getDateInputStyles('year') } />
        </div>
        <div style={ styles.calendarButton } ref={el => this._calendarGroup = el} data-wrap data-clickOpens="false">
          {/* This input needs to be displayed, not hidden, due to a flatpickr bug */}
          <input type="text" data-input style={ styles.hideInput } />
          <a data-toggle><CalendarIcon /></a>
        </div>
        <div style={ styles.clear }></div>
      </div>
    )
  }
}

const styles = {
  base: {
    maxWidth: '600px',
    position: 'relative'
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
  dateInput: {
    display: 'inline-block',
    fontSize: '14pt',
    color: 'black',
    padding: '10px',
    width: '60px',
    outline: 'none',
    resize: 'none',
    border: '1px solid #ccc',
    transition: 'border .5s',
    marginRight: '5px',
    marginBottom: '10px',
    textAlign: 'center'
  },
  month: {
    borderRadius: '4px 0 0 4px'
  },
  day: {
  },
  year: {
    width: '120px',
    borderRadius: '0 4px 4px 0'
  },
  calendarButton: {
    display: 'inline-block',
    width: '40px',
    height: '50px',
    background: 'none',
    border: 'none',
    padding: '5px 0 0 0',
    margin: '0',
    'float': 'left',
    position: 'relative',
    cursor: 'pointer'
  },
  dateFields: {
    'float': 'left'
  },
  clear: {
    clear: 'both'
  },
  hideInput: {
    border: 'none',
    visibility: 'hidden',
    height: '0',
    width: '0',
    margin: '0',
    padding: '0'
  }
}

export default DateField
