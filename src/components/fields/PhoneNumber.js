import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField';

class PhoneNumber extends AskField {

  constructor(props, context) {
    super(props, context)
    // extend the state from AskWidget
    this.state = Object.assign(
      this.state,
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

    if (isCompleted && this.props.validateAs) {
      switch (this.props.validateAs) {
        case "phonenumber":
        break;
      }
    }

    this.setState({ isValid: isValid, completed: isCompleted });

    return !!this.props.required ?  isValid && isCompleted : isValid;

  }

  getValue() {
    return { text: this.state.value.length ? this.state.value : '' };
  }

  render() {
    return (
      <div>
        <input type="text"
          title={ this.props.title }
          style={ this.getStyles() }
          placeholder={this.props.placeholder}
          defaultValue={ this.state.value }
          onBlur={ this.onBlur.bind(this) }
          onChange={this.onChange.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          maxLength={ !!this.props.maxLength ? this.props.maxLength : false }
        />
        {
          !!this.props.maxLength ?
            <div style={ styles.remaining }>{ this.props.maxLength - this.state.value.length } chars remaining.</div>
          :
            null
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
    transition: 'border .5s'
  },
  focused: {
    //borderBottom: '2px solid #009688'
  },
  remaining: {
    color: '#999',
    fontSize: '10pt',
    padding: '0px',
    textAlign: 'right',
    width: '100%',
    marginTop: '5px',
  }
}

export default PhoneNumber;
