/*global location */

import preact from 'preact'
const { h, Component } = preact
import AskFieldWrapper from './AskFieldWrapper'
import Header from './Header'
import Footer from './Footer'
import FinishedScreen from './FinishedScreen'
import xhr from '../xhr'

const defaultTheme = {
  'headerBackground': '#448899',
  'headerText': '#FFFFFF',
  'headerIntroText': '#EEEEEE',
  'formBackground': '#EEEEEE',
  'footerBackground': '#DDDDDD',
  'requiredAsterisk': '#FF44FF',
  'inputBackground': '#F0F0F0',
  'inputText': '#222222',
  'footerText': '#222222',
  'fieldTitleText': '#222222',
  'progressBar': '#44AA44',
  'progressBarBackground': '#CCCCCC',
  'submitButtonBackground': '#444499',
  'submitButtonText': '#FFFFFF',
  'selectedItemBackground': '#111111',
  'selectedItemText': '#FAFAFA'
}

class AskComposer extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      currentStep: 0,
      completedSteps: [],
      finished: false,
      page: this.props.steps[0],
      ...this.props
    }

    this._fieldRefs = []
  }

  onUpdate (payload) {
    var pageCopy = Object.assign({}, this.state.page)
    pageCopy.widgets[payload.index] = Object.assign({},
      pageCopy.widgets[payload.index],
      payload
    )
    var nextStep = payload.moveForward ? this.state.currentStep + 1 : this.state.currentStep
    this.setState({ page: pageCopy, currentStep: nextStep })
  }

  validate () {
    // Assume valid until proven otherwise
    let askIsValid = true
    var fieldIsValid = true

    this.state.page.widgets.map((child, index) => {
      // Type checking before calling
      if (typeof this._fieldRefs[index]._field.validate === 'function') {
        // We delegate validation to the components
        fieldIsValid = this._fieldRefs[index]._field.validate(true)
        // If any of the fields is invalid, the form is invalid
        if (fieldIsValid === false) askIsValid = false
      }
    })

    return askIsValid
  }

  nextStep () {
    this.setState({ currentStep: this.state.currentStep + 1 })
  }

  setFocus (index) {
    this.setState({ currentStep: index })
  }

  onSubmit (index) {
    this.setState({ submitted: true })
    if (this.validate()) {
      this.send()
    }
  }

  send () {
    var payload = []
    var field
    var fieldValue
    this.state.page.widgets.map((child, index) => {
      field = this._fieldRefs[index]._field
      if (typeof field.getValue === 'function') {
        fieldValue = field.getValue()
        payload.push({
          widget_id: field.props.id,
          answer: fieldValue
        })
      }
    })
    console.info('Payload to be sent to the server', payload)
    // FIXME: UGLY hack, for demoing purposes.
    var formId = location.href.indexOf('/iframe/') ? location.href.split('iframe/')[1] : this.props.id
    xhr(
      `${this.props.settings.saveDestination}${formId}`,
      'POST',
      JSON.stringify({ replies: payload }),
      (err, data, xhr) => {
        if (xhr.status === 200) {
          this.setState({ finished: true })
        }
      }
    )
  }

  renderForm () {
    // field count is artificial, not the widget index
    let fieldCount = 0
    let completedCount = 0
    let theme = this.props.theme || defaultTheme

    return !this.state.finished ? (
      <div>
        <ul style={styles.fieldList}>
          {
            this.state.page.widgets.map((child, index) => {
              if (child.type === 'field') {
                fieldCount++
              }
              if (child.completed && child.isValid) completedCount++

              return <AskFieldWrapper
                key={index}
                ref={(widgetWrapper) => { this._fieldRefs[index] = widgetWrapper }}
                index={index}
                fieldNumber={fieldCount}
                hasFocus={this.state.currentStep === index}
                onUpdate={this.onUpdate.bind(this)}
                settings={this.state.settings}
                submitted={this.state.submitted}
                theme={theme}
                {...child} />
            })
          }
        </ul>

        <Footer
          theme={theme}
          completedCount={completedCount}
          fieldCount={fieldCount}
          conditions={this.props.footer.conditions}
          onSubmit={this.onSubmit.bind(this)} />
      </div>
    )
    : <FinishedScreen
      title={this.state.finishedScreen.title}
      description={this.state.finishedScreen.description}
      />
  }

  renderInactive () {
    return <p style={styles.inactiveMessage}>{this.props.settings.inactiveMessage}</p>
  }

  render () {
    const isInactive = this.props.status === 'closed' && !this.props.preview
    let theme = this.props.theme || defaultTheme

    return (
      <div style={styles.base} ref={(composer) => { this._composer = composer }}>
        <Header
          title={this.props.header.title}
          description={this.props.header.description}
          theme={theme} />
        {isInactive ? this.renderInactive() : this.renderForm()}
      </div>
    )
  }

}

const styles = {
  base: {
    position: 'relative'
  },
  fieldList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0'
  },
  inactiveMessage: {
    fontSize: '15pt',
    textAlign: 'center'
  }
}

export default AskComposer
