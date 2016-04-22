import preact from 'preact'
const { h, Component } = preact

class AskWidget extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: null,
      isValid: false,
      completed: false,
      focused: false
    }
  }

  save(options = { moveForward: false }) {
    // whitelist state properties for save
    this.props.onSave({
      index: this.props.index,
      value: this.state.value,
      isValid: this.state.isValid,
      completed: this.state.completed,
      validationMessage: this.props.validationMessage || 'Please check this field',
      moveForward: options.moveForward || false
    });
  }
}

export default AskWidget;
