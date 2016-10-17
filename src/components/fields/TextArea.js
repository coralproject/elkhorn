import preact from 'preact'
const { h, Component } = preact
import { Helpers } from '../../helpers'

import AskField from '../AskField'

class TextArea extends AskField {
  constructor (props, context) {
    super(props, context)

    this.state = {
      focused: false,
      value: this.props.text || '',
      isValid: true,
      height: '100px'
    }

    this.onBlur = this.onBlur.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
  }

  onKeyUp (e) {
    if (e.keyCode === 13 && !e.shiftKey) { // ENTER
      this.update({ moveForward: true })
    } else {
      var height = Math.max(parseInt(e.target.style.height), e.target.scrollHeight - 40)
      this.setState({
        value: e.target.value,
        height: height
      })
    }
  }

  onBlur () {
    if (this.state.value.length) {
      this.setState({
        focused: false,
        completed: true,
        isValid: true
      })
    } else {
      this.setState({
        focused: false,
        completed: false
      })
    }
    this.update({
      moveForward: true
    })
  }

  getStyles () {
    return Object.assign({},
      styles.base,
      this.state.isValid ? styles.valid : styles.error,
      this.props.submitted && (this.props.wrapper.required && !this.state.isCompleted) ? styles.error : styles.valid,
      this.state.focused ? styles.focused : {},
      { height: this.state.height },
      { backgroundColor: this.props.theme.inputBackground }
    )
  }

  // Interface methods

  validate () {
    let isValid = true
    let isCompleted = this.state.value.length

    if (this.props.maxLength) {
      isValid = (this.state.value.length <= this.props.maxLength)
    }

    if (this.props.minLength) {
      isValid = (this.state.value.length >= this.props.minLength)
    }

    this.setState({
      isValid: isValid,
      completed: isCompleted
    })

    return this.props.wrapper.required ? isValid && isCompleted : isValid
  }

  getValue () {
    return {
      text: this.state.value.length ? this.state.value : ''
    }
  }

  render () {
    const { title, placeholder, maxLength, minLength } = this.props;
    const { value } = this.state;

    return (
      <div>
        <textarea
          id={Helpers.toCamelCase(title)}
          style={this.getStyles()}
          placeholder={placeholder}
          defaultValue={value}
          onBlur={this.onBlur}
          onKeyUp={this.onKeyUp}
          maxLength={maxLength ? maxLength : false}
        ></textarea>
        {
          maxLength
          ? <div style={styles.remaining}>{maxLength - value.length} chars remaining.</div>
          : null
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
    transition: 'border .5s',
    borderRadius: '4px'
  },
  focused: {
    // borderBottom: '2px solid #009688'
  },
  remaining: {
    color: '#999',
    fontSize: '10pt',
    textAlign: 'right',
    width: '100%',
    marginTop: '5px'
  },
  error: {
    border: '1px solid red'
  }
}

export default TextArea
