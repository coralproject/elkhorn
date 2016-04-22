import preact from 'preact'
import * as Types from './Types'
const { h, Component } = preact

class AskWidgetWrapper extends Component {

  constructor(props, context) {
    super(props, context)
  }

  getStyles() {
    var fieldStyles = {};
    if (this.props.type == 'field') {
      fieldStyles = Object.assign(
        fieldStyles,
        this.props.hasFocus ? styles.focused : styles.blurred,
        this.props.settings.showFieldNumbers ? styles.withNumber : ''
      )  
    }

    return Object.assign({}, 
      styles.formFieldWrapper, 
      fieldStyles
    );
  }

  getTitleStyles() {
    return Object.assign({}, 
      styles.fieldTitle,
      this.props.hasFocus ? styles.focusedTitle : {},
      this.state.completed && !this.state.isValid ? styles.invalidTitle : {},
    );
  }

  render() {
    var widgetSpec = this.props;
    return (
      <div 
        style={ this.getStyles() }
        onClick={ this.props.onClick.bind(this, this.props.index) }>
          { 
            this.props.type == 'field' && this.props.settings.showFieldNumbers ?
              <span style={ styles.fieldNumber }>{ this.props.fieldNumber }.</span>
            : null
          }
          { 
            this.props.completed && this.props.isValid ?
              <span style={ styles.completedValid }>&#x2714;</span>
            : null
          }
          { 
            this.props.completed && !this.props.isValid ?
              <span style={ styles.completedInvalid }>&#x2718;</span>
            : null
          }
          { 
            this.props.type == 'field' && !!this.props.title ? 
              <h3 style={ this.getTitleStyles() }>{ this.props.title }</h3>
            : null
          }
          {
            h(
              Types[widgetSpec.component],
              Object.assign({}, 
                widgetSpec.props,
                this.props
              )
            )
          }
          {
            this.props.completed && !this.props.isValid ?
              <div style={ styles.validation }>
                { this.props.validationMessage }
              </div>
            : null
          }
      </div>
    )
  }

}

const styles = {
  formFieldWrapper: {
    borderBottom: '1px solid #999',
    transition: 'opacity .5s',
    position: 'relative',
    background: 'white'
  },
  withNumber: {
    padding: '15px 15px 15px 40px',
  },
  fieldNumber: {
    color: '#777',
    position: 'absolute',
    top: '15px',
    left: '0px',
    width: '30px',
    textAlign: 'right',
    fontSize: '14pt'
  },
  fieldTitle: {
    fontSize: '14pt'
  },
  completedValid: {
    color: 'green',
    position: 'absolute',
    top: '45px',
    left: '0px',
    width: '30px',
    textAlign: 'right',
    fontSize: '16pt'
  },
  completedInvalid: {
    color: '#900',
    position: 'absolute',
    top: '45px',
    left: '0px',
    width: '30px',
    textAlign: 'right',
    fontSize: '16pt'
  },
  blurred: {
    opacity: .4
  },
  focused: {
    opacity: 1
  },
  focusedTitle: {
    color: '#009688'
  },
  invalidTitle: {
    color: '#900'
  },
  validation: {
    color: 'red',
    padding: '10px 0'
  }
}

export default AskWidgetWrapper;
