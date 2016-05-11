import preact from 'preact'
const { h, Component } = preact
import AskWidgetWrapper from './AskWidgetWrapper'

class AskComposer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentStep: 0,
      completedSteps: [],
      firstFocusable: -1,
      lastFocusable: -1,
      finished: false,
      ...this.props
    }

    this.state.page.children.map((child, index) => {
      if (child.type == 'field') {
        if (this.firstFocusable === -1) this.firstFocusable = index;
        this.lastFocusable = index;
      }
    });

    this.composerAnimationFrame = (function(){
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame;
    })().bind(window);
    this._widgetRefs = [];
    this.scrollingTo = -1;
  }

  componentDidMount() {
    this._composer.addEventListener('scroll', this.onScroll.bind(this));
  }

  componentWillUnMount() {
    this._composer.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll(e) {
    // pseudo fixed position, wouldn't be necessary on iframes
    this._footer.style.bottom = -e.target.scrollTop + "px";
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

  getFirstFocusable() {

  }

  getLastFocusable() {

  }

  nextStep() {
    this.setState({ currentStep: this.state.currentStep + 1 });
  }

  previousStep() {

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
    this.scrollToStep(newStep);
  }

  easeInOutQuad(t, b, c, d) {
    t /= d/2;
    if (t < 1) {
      return c/2*t*t + b
    }
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  };

  // from Gist: https://gist.github.com/james2doyle/5694700
  // (with some modifications)
  scrollTo(to, callback) {
    return;
    var self = this;
    // Early return if it is a repeat call
    function move(amount) {
      self._composer.scrollTop = amount;
      // don't rely on onScroll only, it will get jumpy
      self._footer.style.bottom = -self._composer.scrollTop + "px";
    }
    var start = self._composer.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20,
      duration = 500;
    var animateScroll = function() {
      // increment the time
      currentTime += increment;
      // find the value with the quadratic in-out easing function
      var val = self.easeInOutQuad(currentTime, start, change, duration);
      // move the document.body
      move(val);
      // do the animation unless its over
      if (currentTime < duration) {
        self.composerAnimationFrame(animateScroll);
      } else {
        if (callback && typeof(callback) === 'function') {
          // do we need a callback?
          // callback();
        }
      }
    };
    animateScroll();
  }

  scrollToStep(index) {
    var target = this._widgetRefs[index].base.offsetTop - (index > 0 ? 50 : 0);
    // Scroll only if needed
    if (target + this._composer.offsetHeight < this._composer.scrollHeight) {
      this.scrollTo(target);
    }
  }

  setFocus(index) {
    this.scrollToStep(index);
    this.setState({ currentStep: index });
  }

  onClick(index) {
    //this.setFocus(index);
  }

  onSendClick(index) {
    this.setState({ finished: true });
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

                      return <AskWidgetWrapper
                          key={ index }
                          ref={ (widgetWrapper) => this._widgetRefs[index] = widgetWrapper }
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
                <footer style={ styles.footer } ref={ (footer) => this._footer = footer }>
                  <div style={ styles.footerContent }>
                    <div style={ styles.answeredQuestions }>
                      <div style={ styles.answeredQuestionsBar }>
                        <span style={ this.getQuestionBarStyles(completedCount, fieldCount) }></span>
                      </div>
                      <span tabindex="0" style={ styles.answeredQuestionsText }>{ completedCount } of { fieldCount } questions answered.</span>
                    </div>
                    <div style={ styles.footerConditionsAndActions }>
                      <h4 tabindex="0" style={ styles.footerConditions }>
                        { this.props.footer.conditions }
                      </h4>
                      <div style={ styles.footerActions }>
                        <button style={ styles.submit } onClick={ this.onSendClick.bind(this) }>Submit</button>
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
