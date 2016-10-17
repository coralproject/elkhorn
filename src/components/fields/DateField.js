import preact from 'preact'
const { h, Component } = preact
import { Helpers } from '../../helpers'

import AskField from '../AskField';
import CalendarIcon from '../CalendarIcon';

import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

class DateField extends AskField {

  constructor (props, context) {
    super(props, context)
    // extend the state from AskWidget

    this.state = {
      value: '',
      isValid: false,
      completed: false,
      year: '',
      month: '',
      day: ''
    };

    this.onDateChange = this.onDateChange.bind(this);
  }

  componentDidMount() {
    this.datepicker = flatpickr(this._calendarGroup, { utc: true })
    this.datepicker.set('onChange', d => this.onFlatPickrChange(d))
  }

  onFlatPickrChange(timestamp) {
    var flatPickrDate = new Date(timestamp);

    this.setState({
      value: timestamp,
      day: flatPickrDate.getDate(),
      month: (flatPickrDate.getMonth() + 1),
      year: flatPickrDate.getFullYear()
    });

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
      this.setState({
        value: this.buildValue()
      });
    } else {
      this.setState({
        value: '--'
      });
    }
    this.update(options);
  }

  validate() {
    const isValid = this.isDateValid(),
          completed = this.isCompleted();

    this.setState({
      isValid,
      completed
    });

    // If it's required: I'll check if it's valid and completed. If not, just needs to be valid.
    return this.props.wrapper.required ? isValid && completed : isValid;
  }

  buildValue() {
    const { month, day, year } = this.state;
    return `${month}-${day}-${year}`;
  }

  getValue() {
    return { value: this.buildValue() };
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  onDateChange() {
    const year = this._year.value
    const month = this._month.value
    const day = this._day.value

    this.setState({
      year,
      month,
      day
    })

    this.validateAndSave()
  }

  isCompleted() {
    return !!(this._year.value && this._month.value && this._day.value)
  }

  isDateValid() {
    let isValid = true;
    const { year, month, day } = this.state;

    if (year && (year < 1916 || year > 2056)) {
      isValid = false;
    }

    if (month && (month < 1 || month > 12)) {
      isValid = false;
    }

    if (day && (day < 1 || day > this.daysInMonth(month, year))) {
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
    const { title } = this.props

    return (
      <div style={ styles.base }>
        <div style={ styles.dateFields }>
          <fieldset id={Helpers.toCamelCase(title)}>
            <label for={`${Helpers.toCamelCase(title)}_month`} class="offset">Month</label>
            <input
              id={`${Helpers.toCamelCase(title)}_month`}
              ref={el => this._month = el}
              type="number"
              step="1"
              placeholder="MM"
              min="1"
              max="12"
              value={ this.state.month }
              onChange={ this.onDateChange }
              style={ this.getDateInputStyles('month') }
            />

            <label for={`${Helpers.toCamelCase(title)}_day`} class="offset">Day</label>
            <input
              id={`${Helpers.toCamelCase(title)}_day`}
              min="1"
              max={this.daysInMonth()}
              ref={el => this._day = el}
              type="number"
              step="1"
              placeholder="DD"
              value={ this.state.day }
              onChange={ this.onDateChange }
              style={ this.getDateInputStyles('day') }
            />

            <label for={`${Helpers.toCamelCase(title)}_year`} class="offset">Year</label>
            <input
              id={`${Helpers.toCamelCase(title)}_year`}
              ref={el => this._year = el}
              type="number"
              step="1"
              placeholder="YYYY"
              value={ this.state.year }
              onChange={ this.onDateChange }
              style={ this.getDateInputStyles('year') }
            />
          </fieldset>
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
