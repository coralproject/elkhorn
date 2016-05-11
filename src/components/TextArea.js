import preact from 'preact'
const { h, Component } = preact

import AskWidget from './AskWidget';

class TextArea extends AskWidget {
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
      this.save({ moveForward: true });
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
    this.save({ moveForward: true });
  }

  onFocus() {
    this.setState({ focused: true });
    this.props.onFocus();
  }

  getStyles() {
    return Object.assign({},
      styles.base,
      this.props.isValid ? styles.valid : styles.error,
      this.state.focused ? styles.focused : {},
      { height: this.state.height }
    );
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
          onFocus={ this.onFocus.bind(this) }
          onKeyDown={this.onKeyDown.bind(this)}
          maxLength={ !!this.props.maxLength ? this.props.maxLength : 'auto' }
          ref={
            // Bind *this* to the ref callback
            // to use state in the condition
            (function(textarea) {
              // if focus has never been set
              //if (this.props.hasFocus) textarea.focus();
            }).bind(this)
          }
        ></textarea>
        {
          !!this.props.maxLength ?
            <div style={ styles.remaining }>{ this.props.maxLength - this.state.value.length } chars remaining.</div>
          :
            null
        }
        <div style={ styles.keyLegend }>
          <span style={ styles.keyTag }>ENTER</span> to save, <span style={ styles.keyTag }>SHIFT + ENTER</span> to start a new paragraph.
        </div>
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
  keyLegend: {
    fontSize: '9pt',
    color: '#999'
  },
  keyTag: {
    display: 'inline-block',
    padding: '4px 7px',
    margin: '0 4px',
    borderRadius: '3px',
    border: '1px solid #bbb',
    background: 'white',
    boxShadow: '0 2px 2px #bbb'
  }
}

export default TextArea;
