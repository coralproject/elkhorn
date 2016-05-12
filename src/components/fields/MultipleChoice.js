import preact from 'preact';
const {Component, h} = preact;

import AskField from '../AskField';

class MultipleChoice extends AskField {
  constructor(props, context) {
    super(props, context)
    this.state = {
      rating: 0,
      focused: -1,
      value: []
    }
  }

  componentWillUpdate() {
    //console.log("will update");
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
    //this.props.onFocus();
  }

  onClick(i, e) {
    var newValue = this.state.value.slice();
    if (newValue.indexOf(i) === -1) {
      if (this.props.pickUpTo) {
        if (newValue.length < this.props.pickUpTo) {
          newValue.push(i);
        } else {
          e.preventDefault();
        }
      } else {
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
    this.save({ moveForward: false });
    //this.props.onFocus();
  }

  onMouseOut() {
    this.setState({ focused: -1 });
  }

  onKeyDown(e) {
    if (e.keyCode == 13) return; // skip on Enter
    var newFocus = this.state.focused;
    switch (e.keyCode) {
      case 40: // Down arrow
        e.preventDefault();
        /*newFocus++;
        if (newFocus < this.props.options.length) {
          e.stopPropagation();
        }
        newFocus = Math.min(this.props.options.length - 1, newFocus + 1);
        e.stopPropagation();*/
      break;
      case 38: // Up arrow
        e.preventDefault();
        /*newFocus--;
        if (newFocus >= 0) {
          e.stopPropagation();
        }
        newFocus = Math.max(0, newFocus - 1);*/
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
      return <label
          //onMouseOver={ this.onHover.bind(this, i) }
          style={ this.getOptionStyle(i) }
          key={ i }
        ><input
            style={ styles.optionCheck }
            onBlur={ this.onBlur.bind(this) }
            onFocus={ this.onFocus.bind(this, i) }
            onClick={ this.onClick.bind(this, i) }
            tabindex="0"
            type="checkbox"
            key={ i }
            ref={
              // Bind *this* to the ref callback
              // to use state in the condition
              (function(checkbox) {
                // set native focus
                //if (this.props.hasFocus && checkbox.key === this.state.focused) checkbox.focus();
                // if focus has never been set
                //if (this.state.focused === -1 && this.props.hasFocus) checkbox.focus();
              }).bind(this)
            }
          />{ option.title }</label>});
  }

  render() {
    return (
      <div>
        <fieldset
          style={ styles.base }
          onMouseOut={ this.onMouseOut.bind(this) }
          onKeyDown={ this.onKeyDown.bind(this) }
          >
          <legend style={ styles.accesibleLegend }>{ this.props.title }</legend>
          { this.getOptions() }
        </fieldset>
        {
          !!this.props.pickUpTo ?
            <div style={ styles.bottomLegend }>{ this.state.value.length } of { this.props.pickUpTo } selected.</div>
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
    color: '#888',
    width: '90%',
    outline: 'none',
    border: 'none',
    minHeight: '100px'
  },
  accesibleLegend: {
    position: 'fixed',
    left: '-5000px'
  },
  option: {
    display: 'inline-block',
    fontSize: '14pt',
    cursor: 'pointer',
    color: '#777',
    lineHeight: '50px',
    transition: 'background .2s',
    background: 'white',
    border: '1px solid #ccc',
    padding: '0px 20px 0px 50px',
    outline: 'none',
    margin: '0 10px 10px 0',
    textAlign: 'left',
    position: 'relative',
    fontWeight: 'bold'
  },
  clicked: {
    background: '#222',
    color: 'white',
  },
  focused: {
    border: '1px solid #47a',
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
  },
  optionCheck: {
    position: 'absolute',
    top: '18px',
    left: '20px'
  },
  bottomLegend: {
    color: '#999',
    fontSize: '10pt',
    padding: '0px',
    textAlign: 'right',
    width: '100%',
    marginTop: '5px',
  }
}

export default MultipleChoice;
