import preact from 'preact'
const { h, Component } = preact

class AskField extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: null,
      isValid: false,
      completed: false,
      focused: false
    }
    this.checkInterface();
  }

  checkInterface() {
    let interfaceMethods = ['validate', 'getValue'];
    interfaceMethods.map((method) => {
      if ((typeof this[method]) != 'function') {
        console.warn(`Warning: [${this.constructor.name}] has no [${method}] method. See: https://github.com/coralproject/elkhorn/blob/master/docs/warnings/askfieldinterface.md`);
      }
    });
  }

  update(options = { moveForward: false }) {
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

export default AskField;
