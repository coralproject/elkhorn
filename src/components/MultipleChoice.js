import preact from 'preact';
const {Component, h} = preact;

import AskWidget from './AskWidget';

class MultipleChoice extends AskWidget {
  constructor(props, context) {
    super(props, context)
    this.state = {
      rating: 0,
      focused: -1,
      value: []
    }
  }

  getStyles() {
    return Object.assign({}, styles.base, this.props.isValid ? styles.valid : styles.error);
  }

  onBlur() {
    this.setState({ focused: -1, hovering: -1 });
  }

  onFocus(i, e) {
    this.setState({ focused: i });
    this.props.onFocus();
  }

  onHover(i, e) {
    this.setState({ focused: i });
    e.target.focus();
    // sets focus on hover! looks weird otherwise
    this.props.onFocus();
  }

  onClick(i, e) {
    var newValue = this.state.value.slice();
    if (newValue.indexOf(i) === -1) {
      if (newValue.length < this.props.pickUpTo) {
        newValue.push(i);  
      }
    } else {
      newValue.splice(newValue.indexOf(i), 1);
    }
    var newState = { focused: i, value: newValue };
    if (this.state.value.length >= 0) {
      newState = Object.assign({}, newState, { completed: true, isValid: true });
    } else {
      newState = Object.assign({}, newState, { completed: false });
    }
    this.setState(newState);
    this.save({ moveForward: true });
  }

  onMouseOut() {
    this.setState({ focused: -1 });
  }

  onKeyDown(e) {
    if (e.keyCode == 13) return; // skip on Enter
    var newFocus = this.state.focused;
    switch (e.keyCode) {
      case 40: // Down arrow
        newFocus = Math.min(this.props.options.length - 1, newFocus + 1);
        e.stopPropagation();
      break; 
      case 38: // Up arrow
        newFocus = Math.max(0, newFocus - 1);
        e.stopPropagation();
      break;
    }
    this.setState({ focused: newFocus });
  }

  getOptionStyle(i) {
    return Object.assign({}, 
      styles.option, 
      this.state.value.indexOf(i) > -1 ? styles.clicked : {},
      i === this.state.focused ? styles.focused : {}
    ); 
  }

  getOptions() {
    return this.props.options.map((option, i) => {
      return <button 
          onBlur={ this.onBlur.bind(this) }
          onFocus={ this.onFocus.bind(this, i) }
          onMouseOver={ this.onHover.bind(this, i) } 
          onClick={ this.onClick.bind(this, i) }
          style={ this.getOptionStyle(i) }
          key={ i }
          ref={ 
            // Bind *this* to the ref callback
            // to use state in the condition
            (function(button) {
              // set native focus
              if (this.props.hasFocus && button.key === this.state.focused) button.focus();
              // if focus has never been set
              if (this.state.focused === -1 && this.props.hasFocus) button.focus();
            }).bind(this)
          }
        >
          <h2 style={ styles.optionTitle }>{ option.title }</h2>
          <p style={ styles.optionDescription }>{ option.description }</p>
        </button>;
    });
  }

  render() {
    return (
      <div 
        style={ styles.base } 
        onMouseOut={ this.onMouseOut.bind(this) }
        onKeyDown={ this.onKeyDown.bind(this) }>
        {
          this.getOptions()
        }
      </div>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    color: '#888',
    width: '90%',
    outline: 'none',
    border: 'none',
    minHeight: '100px'
  },
  option: {
    display: 'block',
    fontSize: '12pt',
    cursor: 'pointer',
    color: '#777',
    lineHeight: '50px',
    transition: 'background .2s',
    background: 'white',
    border: '1px solid #ccc',
    padding: '20px',
    outline: 'none',
    margin: '0 10px 10px 0',
    textAlign: 'left'
  },
  clicked: {
    background: '#F57C00',
    color: 'white',
  },
  focused: {
    background: '#FF5722',
    color: 'white'
  },
  optionTitle: {
    fontSize: '15pt',
    margin: '0',
    padding: '0',
    lineHeight: '1'
  },
  optionDescription: {
    margin: '0',
    padding: '0',
    lineHeight: '1'
  }
}

export default MultipleChoice;