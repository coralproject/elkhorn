import preact from 'preact'
const { h, Component } = preact

class Footer extends Component {

  getQuestionBarStyles (completedCount, fieldCount) {
    var widthPercent = Math.ceil(completedCount / fieldCount * 100)
    return Object.assign({},
      styles.answeredQuestionsBarComplete,
      { width: widthPercent + '%' },
      { background: this.props.theme.progressBar }
    )
  }

  render () {
    return (
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.answeredQuestions}>
            <div style={Object.assign({},
              styles.answeredQuestionsBar,
              { background: this.props.theme.progressBarBackground }
            )}>
              <span style={this.getQuestionBarStyles(this.props.completedCount, this.props.fieldCount)}></span>
            </div>
            <span
              role='progressbar'
              aria-valuenow={this.props.completedCount}
              aria-valuemin='0'
              aria-valuemax={this.props.fieldCount}
              tabindex='0'
              style={styles.answeredQuestionsText}>{this.props.completedCount} of {this.props.fieldCount} questions answered.</span>
          </div>
          <div style={styles.footerConditionsAndActions}>
            <h4 tabindex='0' style={styles.footerConditions}>
              {this.props.conditions}
            </h4>
            <div style={styles.footerActions}>
              <button
                style={Object.assign({},
                  styles.submit,
                  {
                    background: this.props.theme.submitButtonBackground,
                    text: this.props.theme.submitButtonText
                  }
                )}
                onClick={this.props.onSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    background: '#fff',
    padding: '40px'
  },
  h1: {
    fontFamily: 'Martel',
    fontSize: '22pt',
    fontWeight: '700',
    color: '#222',
    textAlign: 'center'
  },
  description: {
    fontFamily: 'Martel',
    fontSize: '12pt',
    fontWeight: '400',
    color: '#444',
    textAlign: 'center'
  },
  footer: {
    width: '100%',
    background: '#eee',
    borderTop: '1px solid #ccc'
  },
  footerContent: {
    padding: '30px'
  },
  answeredQuestions: {
    color: '#222'
  },
  answeredQuestionsBar: {
    height: '15px',
    width: '100%',
    position: 'relative',
    marginBottom: '5px',
    borderRadius: '3px'
  },
  answeredQuestionsBarComplete: {
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
    width: '100%',
    paddingTop: '10px',
    marginTop: '10px',
    borderTop: '1px solid #999'
  },
  footerActions: {
    textAlign: 'right'
  },
  footerConditions: {
    fontSize: '9pt'
  },
  submit: {
    background: '#00897B',
    fontSize: '11pt',
    width: '200px',
    padding: '10px 20px',
    fontWeight: 'bold',
    boxShadow: '0 2px 2px #555',
    borderRadius: '2px',
    border: 'none',
    color: 'white',
    textTransform: 'uppercase',
    cursor: 'pointer'
  }
}

export default Footer
