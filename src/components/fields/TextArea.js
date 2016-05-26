import preact from 'preact'
const { h, Component } = preact

import AskField from '../AskField';

class TextArea extends AskField {
  constructor(props, context) {
    super(props, context)
    this.state = {
      focused: false,
      value: this.props.text || '',
      height: '100px' // min textarea height,
    }
  }

  onKeyDown(e) {
    if (e.keyCode == 13 && !e.shiftKey) { // ENTER
      this.update({ moveForward: true });
    } else {
      var height = Math.max(parseInt(e.target.style.height), e.target.scrollHeight - 40);
      this.setState({ value: e.target.value, height: height });
    }
  }

  onBlur() {
    if (!!this.state.value.length) {
      this.setState({ focused: false, completed: true, isValid: true });
    } else {
      this.setState({ focused: false, completed: false });
    }
    this.update({ moveForward: true });
  }

  getStyles() {
    return Object.assign({},
      styles.base,
      this.props.isValid ? styles.valid : styles.error,
      this.state.focused ? styles.focused : {},
      { height: this.state.height },
      { backgroundColor: this.props.theme.inputBackground }
    );
  }

  // Interface methods

  validate() {

    let isValid = true, isCompleted = false;

    isCompleted = !!this.state.value.length;

    this.setState({ isValid: isValid, completed: isCompleted });

    return !!this.props.required ? isValid && isCompleted : isValid;

  }

  getValue() {
    return { text: this.state.value.length ? this.state.value : '' };
  }


  render() {
    return (
      <div>
        <textarea
          title={ this.props.title }
          style={ this.getStyles() }
          placeholder={this.props.placeholder}
          defaultValue={ this.state.value }
          onBlur={ this.onBlur.bind(this) }
          onKeyDown={this.onKeyDown.bind(this)}
          maxLength={ !!this.props.maxLength ? this.props.maxLength : 'auto' }
        ></textarea>
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
    textAlign: 'right',
    width: '100%',
    marginTop: '5px',
  },
}

export default TextArea;
