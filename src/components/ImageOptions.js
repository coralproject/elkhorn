import preact from 'preact';
const {Component, h} = preact;

import AskWidget from './AskWidget';

class ImageOptions extends AskWidget {
  constructor(props, context) {
    super(props, context)
    this.state = {
      rating: 0,
      focused: -1,
      value: -1
    }
  }

  getStyles() {
    return Object.assign({}, styles.base, this.props.isValid ? styles.valid : styles.error);
  }

  onBlur() {
    this.setState({ focused: -1 });
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
    this.setState({ focused: i, value: i });
    if (this.state.value >= 0) {
      this.setState({ completed: true, isValid: true });
    } else {
      this.setState({ completed: false });
    }
    this.save({ moveForward: true });
  }

  onMouseOut() {
    this.setState({ hovering: -1 });
  }

  onKeyDown(e) {
    if (e.keyCode == 13) return; // skip on Enter
    var newFocus = this.state.focused;
    switch (e.keyCode) {
      case 39: // Right arrow
      newFocus = Math.min(this.props.steps - 1, newFocus + 1);
      break; 
      case 37: // Left arrow
        newFocus = Math.max(0, newFocus - 1);
      break;
    }
    this.setState({ focused: newFocus });
  }

  getOptionStyle(i) {
    return Object.assign({}, 
      styles.option, 
      i === this.state.value ? styles.clicked : {},
      i === this.state.focused ? styles.focused : {}
    ); 
  }

  getOptions() {
    var options = [];
    var steps = this.props.steps || 5;
    for (var i = 0; i < steps; i++) {
      options.push(
        <button 
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
              //if (this.props.hasFocus && button.key === this.state.focused) button.focus();
              // if focus has never been set
              //if (this.state.focused === -1 && this.props.hasFocus) button.focus();
            }).bind(this)
          }
        >
          <img src={ "http://lorempixel.com/100/150/?random" + i } />
        </button>
      );
    }
    return options;
  }

  render() {
    console.log("ImageOptions render");
    return (
      <div 
        style={ styles.base } 
        onMouseOut={ this.onMouseOut.bind(this) }
        onKeyDown={ this.onKeyDown.bind(this) }>
        {
          this.getOptions().map((option) => option)
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
    fontSize: '50px',
    cursor: 'pointer',
    color: '#777',
    lineHeight: '50px',
    transition: 'background .2s',
    background: 'white',
    border: '1px solid #ccc',
    padding: '10px',
    outline: 'none',
    margin: '0 10px 10px 0'
  },
  clicked: {
    background: '#F57C00'
  },
  focused: {
    background: '#FF5722'
  },
  focusedTitle: {
    color: '#009688'
  }
}

export default ImageOptions;
