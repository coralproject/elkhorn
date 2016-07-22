import preact from 'preact'
const {h, Component} = preact

export default class GalleryComposer extends Component {

  renderAnswers () {
    const {answers} = this.props
    console.log('answers?', answers)
    return answers.map(a => {
      // is this answer multiple choice?

      let answerBody

      if (Array.isArray(a.answer.answer.options)) {
        answerBody = a.answer.answer.options.map(option => {
          return <div style={styles.multi.option}>{option.title}</div>
        })
      } else { // a regular text response
        answerBody = a.answer.answer.text
      }

      return (
        <div style={styles.answer}>
          {
            this.props.galleryReaderInfoPlacement === 'above'
            ? this.renderIdentityInfo(a)
            : null
          }
          {answerBody}
          {
            this.props.galleryReaderInfoPlacement === 'below'
            ? this.renderIdentityInfo(a)
            : null
          }
        </div>
      )
    })
  }

  renderIdentityInfo (answer) {
    return answer.identity_answers && (
      <p style={styles.identityAnswers}>
        {answer.identity_answers.map(a => a.answer.text).join(' ')}
      </p>
    )
  }

  render () {
    console.log('GalleryComposer', this.props)

    return (
      <div style={styles.base}>
        <div style={styles.header}>Preview</div>
        <div style={styles.title}>{this.props.galleryTitle}</div>
        <div style={styles.description}>{this.props.galleryDescription}</div>
        <div style={styles.answerContainer}>
          {this.renderAnswers()}
        </div>
      </div>
    )
  }
}

const styles = {
  base: {
    position: 'relative'
  },
  header: {
    backgroundColor: 'rgb(246,125,111)',
    color: 'white',
    padding: 20
  },
  title: {
    fontWeight: 'bold',
    color: '#444',
    fontSize: 24,
    margin: '20px 20px 10px'
  },
  description: {
    color: '#444',
    lineHeight: '1.3em',
    fontSize: 18,
    margin: '10px 20px'
  },
  identityAnswers: {
    color: '#979B9F',
    fontStyle: 'italic',
    marginBottom: 10
  },
  answerContainer: {
    padding: 20
  },
  answer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    border: '1px solid #ddd',
    marginBottom: 10
  },
  multi: {
    option: {
      backgroundColor: '#444',
      fontSize: '16px',
      padding: 8,
      color: 'white'
    }
  },
  text: {
  }
}
