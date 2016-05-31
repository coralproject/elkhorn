import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField';

class LocationDropdown extends AskField {

  constructor(props, context) {
    super(props, context)
    // extend the state from AskWidget

    this.state = Object.assign(
      this.state,
      {
        selectedState: false,
        zip: false,
        streetAddress: false,
        city: false
      }
    );

    // FIXME: hardcoded, should this come in props?
    this.stateHash = [
      "Alabama",
      "Alaska",
      "American Samoa",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "District Of Columbia",
      "Federated States Of Micronesia",
      "Florida",
      "Georgia",
      "Guam",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Marshall Islands",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Northern Mariana Islands",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Palau",
      "Pennsylvania",
      "Puerto Rico",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virgin Islands",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming"
    ];
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

  onStateChange(e) {
    this.setState({ selectedState: e.target.value });
    this.validateAndSave();
  }

  onStreetChange(e) {
    this.setState({ streetAddress: e.target.value });
    this.validateAndSave();
  }

  onCityChange(e) {
    this.setState({ city: e.target.value });
    this.validateAndSave();
  }

  onZipChange(e) {
    this.setState({ zip: e.target.value });
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

    isCompleted = !!this.state.streetAddress.length &&
      !!this.state.selectedState.length &&
      !!this.state.city.length &&
      !!this.state.zip.length;

    this.setState({ isValid: isValid, completed: isCompleted });

    return !!this.props.required ?  isValid && isCompleted : isValid;

  }

  getValue() {
    return {
      streetAddress: this.state.streetAddress,
      city: this.state.city,
      selectedState: this.state.selectedState,
      zip: this.state.zip
    };
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
        <div>
          <input
            style={ styles.textInput }
            onChange={ this.onStreetChange.bind(this) }
            onBlur={ this.onStreetChange.bind(this) }
            placeholder="Street Address"
            value={ this.state.streetAddress }
            type="text" />
        </div>
        <div>
          <input
            onChange={ this.onCityChange.bind(this) }
            onBlur={ this.onCityChange.bind(this) }
            style={ Object.assign({}, styles.textInput, styles.city) }
            value={ this.state.city }
            type="text"
            placeholder="City" />
          <select
            style={ Object.assign({}, styles.textInput, styles.state) }
            onChange={ this.onStateChange.bind(this) }
            onBlur={ this.onStateChange.bind(this) }
            >
              <option disabled selected>State</option>
              {
                this.stateHash.map((state) => {
                    return <option value={state} selected={ this.state.selectedState == state }>{state}</option>;
                })
              }
          </select>
          <input
            onChange={ this.onZipChange.bind(this) }
            onBlur={ this.onZipChange.bind(this) }
            value={ this.state.zip }
            style={ Object.assign({}, styles.textInput, styles.zip) }
            type="text"
            placeholder="Zip code" />
        </div>
        <div style={ styles.clearBoth }></div>
      </div>
    )
  }
}

const styles = {
  base: {
    maxWidth: '600px'
  },
  city: {
    width: '20%',
    'float': 'left',
    margin: '0'
  },
  zip: {
    width: '20%',
    margin: '0',
    'float': 'right'
  },
  state: {
    width: '58%',
    margin: '0 1%',
    'float': 'left'
  },
  textInput: {
    display: 'block',
    fontSize: '14pt',
    color: 'black',
    padding: '2%',
    width: '100%',
    outline: 'none',
    resize: 'none',
    border: '1px solid #ccc',
    transition: 'border .5s',
    margin: '0 0 5px 0',
  },
  clearBoth: {
    'clear': 'both'
  }
}

export default LocationDropdown;
