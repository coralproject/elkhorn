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

  onChange(e) {
    var height = Math.max(parseInt(e.target.style.height), e.target.scrollHeight - 40);
    this.setState({ value: e.target.value, height: height });
  }

  onBlur() {
    if (!!this.state.value.length) {
      this.setState({ focused: false, completed: true, isValid: true });
    } else {
      this.setState({ focused: false, completed: false });
    }
    this.save();
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
          style={ this.getStyles() }
          placeholder={this.props.placeholder}
          defaultValue={ this.state.value }
          onBlur={ this.onBlur.bind(this) }
          onFocus={ this.onFocus.bind(this) }
          onChange={this.onChange.bind(this)}
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
    padding: '0 0 10px 0',
    width: '100%',
    outline: 'none',
    resize: 'none',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '2px solid #999',
    transition: 'border .5s'
  },
  focused: {
    borderBottom: '2px solid #009688'  
  },
  remaining: {
    color: '#999',
    fontSize: '10pt',
    textAlign: 'right',
    width: '100%',
    marginTop: '20px',
  }
}

export default TextArea;
