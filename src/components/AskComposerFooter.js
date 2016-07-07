import preact from 'preact'
const { h, Component } = preact
import AskWidgetWrapper from './AskWidgetWrapper'
import AskComposerFooter from './AskComposerFooter'

class AskComposer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      currentStep: 0,
      completedSteps: [],
      page: this.props.steps[0],
      ...this.props
    }
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
    this.setState({ currentStep: index });
  }

  onSave(payload) {

    var pageCopy = Object.assign({}, this.state.page);
    pageCopy.widgets[payload.index] = Object.assign({},
      pageCopy.widgets[payload.index],
      payload
    );

    this.setState({ src: pageCopy });
  }

  render() {
    // field count is artificial, not the widget index
    var fieldCount = 0;
    var completedCount = 0;
    return (
      <div style={ styles.footer } ref={ (footer) => this._footer = footer }>
        <div style={ styles.footerContent }>
          <div style={ styles.footerActions }>
            <button onClick={ this.props.onSubmit } style={ styles.submit }>Send</button>
          </div>
        </div>
      </div>
    )
  }

}

const styles = {
  base: {
    background: '#eee',
    position: 'relative',
    paddingBottom: '150px',
    height: '700px',
    overflowY: 'auto'
  },
  footer: {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    height: '70px',
    background: '#eee',
    borderTop: '1px solid #ccc'
  },
  footerContent: {
    padding: '15px',
    display: 'flex'
  },
  footerActions: {
    flexGrow: '1'
  },
  submit: {
    background: '#F67D6E',
    padding: '10px 40px',
    borderRadius: '2px',
    border: 'none',
    color: 'white',
    textTransform: 'uppercase',
    cursor: 'pointer'
  }
}

export default AskComposer;
