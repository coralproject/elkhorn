import preact from 'preact'
const { h, Component } = preact
import AskFieldWrapper from './AskFieldWrapper'

class AskComposer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentStep: 0,
      completedSteps: [],
      finished: false,
      ...this.props
    }

    this._fieldRefs = [];
  }

  onFocus(index) {
    if (index != this.state.currentStep) {
      this.setFocus(index);
    }
  }

  onSave(payload) {

    var pageCopy = Object.assign({}, this.state.page);
    pageCopy.children[payload.index] = Object.assign({},
      pageCopy.children[payload.index],
      payload
    );

    var nextStep = payload.moveForward ? this.state.currentStep + 1 : this.state.currentStep;
    this.setState({ page: pageCopy, currentStep: nextStep });

  }

  validate() {
    let askIsValid = false;

    var pageCopy = Object.assign({}, this.state.page);
    pageCopy.children.map((child, index) => {
      if (typeof this._fieldRefs[index]._field.validate == "function") {
        this._fieldRefs[index]._field.validate(true);
      }
    });
    return false;
  }

  nextStep() {
    this.setState({ currentStep: this.state.currentStep + 1 });
  }

  onKeyDown(e) {
    var newStep = this.state.currentStep;
    switch (e.keyCode) {
      case 40: // Down arrow
        newStep = Math.min(this.state.page.children.length, newStep + 1);
      break;
      case 38: // Up arrow
        newStep = Math.max(0, newStep - 1);
      break;
    }
    this.setState({ currentStep: newStep });
  }

  setFocus(index) {
    this.setState({ currentStep: index });
  }

  onClick(index) {
    //this.setFocus(index);
  }

  onSubmit(index) {
    if (this.validate()) {
      this.setState({ finished: true });
    }
  }

  getQuestionBarStyles(completedCount, fieldCount) {
    var widthPercent = Math.ceil(completedCount / fieldCount * 100);
    return Object.assign({},
      styles.answeredQuestionsBarComplete,
      { width: widthPercent + '%' }
    );
  }

  render() {
    // field count is artificial, not the widget index
    var fieldCount = 0;
    var completedCount = 0;
    return (
      <div style={ styles.base } ref={ (composer) => this._composer = composer }>
        {
          !this.state.finished ?
            <div
              //onKeyDown={ this.onKeyDown.bind(this) }
              >
                <ul style={ styles.fieldList }>
                  {
                    this.state.page.children.map((child, index) => {

                      if (child.type == 'field') {
                        fieldCount++;
                      }
                      if (child.completed && child.isValid) completedCount++;

                      return <AskFieldWrapper
                          key={ index }
                          ref={ (widgetWrapper) => this._fieldRefs[index] = widgetWrapper }
                          index={ index }
                          fieldNumber={ fieldCount }
                          hasFocus={ this.state.currentStep == index }
                          onFocus={ this.onFocus.bind(this, index) }
                          onSave={ this.onSave.bind(this) }
                          onClick={ this.onClick.bind(this, index) }
                          settings={ this.state.settings }
                          { ...child } />;
                    })
                  }
                </ul>

                { /* TODO: move the footer into a component */ }
                <footer style={ styles.footer } ref={ (footer) => this._footer = footer }>
                  <div style={ styles.footerContent }>
                    <div style={ styles.answeredQuestions }>
                      <div style={ styles.answeredQuestionsBar }>
                        <span style={ this.getQuestionBarStyles(completedCount, fieldCount) }></span>
                      </div>
                      <span role="progressbar" aria-valuenow={ completedCount } aria-valuemin="0" aria-valuemax={ fieldCount } tabindex="0" style={ styles.answeredQuestionsText }>{ completedCount } of { fieldCount } questions answered.</span>
                    </div>
                    <div style={ styles.footerConditionsAndActions }>
                      <h4 tabindex="0" style={ styles.footerConditions }>
                        { this.props.footer.conditions }
                      </h4>
                      <div style={ styles.footerActions }>
                        <button style={ styles.submit } onClick={ this.onSubmit.bind(this) }>Submit</button>
                      </div>
                    </div>
                  </div>
                </footer>
            </div>
          :
            <div style={ styles.finishedScreen }>
              <h1>{ this.state.finishedScreen.title }</h1>
              <p>{ this.state.finishedScreen.description }</p>
            </div>
        }
      </div>
    )
  }

}

const styles = {
  base: {
    background: '#eee',
    position: 'relative',
    paddingBottom: '200px'
  },
  footer: {
    width: '100%',
    background: '#eee',
    borderTop: '1px solid #ccc'
  },
  footerContent: {
    padding: '30px',
  },
  answeredQuestions: {
    color: '#222',
  },
  answeredQuestionsBar: {
    background: '#999',
    height: '15px',
    width: '100%',
    position: 'relative',
    marginBottom: '5px',
    borderRadius: '3px'
  },
  answeredQuestionsBarComplete: {
    background: 'linear-gradient(to left, #414d0b , #727a17)',
    height: '15px',
    position: 'absolute',
    top: '0',
    left: '0',
    transition: 'width .5s'
  },
  answeredQuestionsText: {
    fontSize: '10pt'
  },
  footerConditionsAndActions: {
    display: 'flex',
    width: '100%',
    paddingTop: '10px',
    marginTop: '10px',
    borderTop: '1px solid #999'
  },
  footerActions: {
    textAlign: 'right',
    width: '30%'
  },
  footerConditions: {
    width: '70%',
    fontSize: '9pt',
    paddingRight: '20px'
  },
  submit: {
    background: '#00897B',
    width: '200px',
    padding: '10px 40px',
    boxShadow: '0 2px 2px #555',
    borderRadius: '2px',
    border: 'none',
    color: 'white',
    textTransform: 'uppercase',
    cursor: 'pointer'
  },
  fieldList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0'
  }
}

export default AskComposer;
