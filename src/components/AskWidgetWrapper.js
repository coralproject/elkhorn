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
    var innerWidget = h(
      Types[widgetSpec.component],
      Object.assign({},
        widgetSpec.props,
        this.props
      )
    );
    return (
      <li
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
              false && this.props.pseudoLabel ?
                <fieldset tabindex="0" style={ styles.fieldsetReset }>
                  <legend style={ this.getTitleStyles() }>{ this.props.title }</legend>
                  { innerWidget }
                </fieldset>
              :
                <div>
                  <h3 tabindex="0" style={ this.getTitleStyles() }>{ this.props.title }</h3>
                  { innerWidget }
                </div>
            :
              innerWidget
          }

          {
            this.props.completed && !this.props.isValid ?
              <div style={ styles.validation }>
                { this.props.validationMessage }
              </div>
            : null
          }
      </li>
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
    padding: '15px 30px 20px 40px',
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
    display: 'block',
    fontSize: '14pt',
    color: '#444',
    fontWeight: '700',
    marginBottom: '10px'
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
    color: 'black'
  },
  invalidTitle: {
    color: '#900'
  },
  validation: {
    color: 'red',
    padding: '10px 0'
  },
  fieldsetReset: {
    border: '0',
    padding: '0.01em 0 0 0',
    margin: '0',
    minWidth: '0',
    display: 'table-cell'
  }
}

export default AskWidgetWrapper;
