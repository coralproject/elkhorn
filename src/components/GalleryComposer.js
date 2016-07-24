import preact from 'preact'
const {h, Component} = preact

export default class GalleryComposer extends Component {

  renderAnswers () {
    const {answers} = this.props
    return answers.map(a => {
      // is this answer multiple choice?

      let answerBody

      if (Array.isArray(a.answer.answer.options)) {
        answerBody = a.answer.answer.options.map(option => {
          return <div style={styles.multi.option}>{option.title}</div>
        })
      } else { // a regular text response
        const text = a.answer.edited ? a.answer.edited : a.answer.answer.text
        answerBody = <span style={styles.text}>{text}</span>
      }

      return (
        <div style={styles.answer}>
          {
            this.props.galleryReaderInfoPlacement === 'above'
            ? this.renderIdentityInfo(a, 'above')
            : null
          }
          {answerBody}
          {
            this.props.galleryReaderInfoPlacement === 'below'
            ? this.renderIdentityInfo(a, 'below')
            : null
          }
        </div>
      )
    })
  }

  renderIdentityInfo (answer, placement) {
    console.log('this.props.identifiableIds.length', this.props.identifiableIds, this.props.identifiableIds.length, answer.identity_answers)
    const placementStyles = Object.assign({}, styles.identityAnswers, styles.identityAnswers[placement])
    return answer.identity_answers && this.props.identifiableIds.length
    ? <p style={placementStyles}>
      {answer.identity_answers.map(idAnswer => {
        const displayable = this.props.identifiableIds.indexOf(idAnswer.widget_id) !== -1
        return displayable ? idAnswer.answer.text : ''
      }).join(' ')}
    </p>
    : null
  }

  render () {
    return (
      <div style={styles.base}>
        {
          this.props.galleryTitle
          ? <div style={styles.title}>{this.props.galleryTitle}</div>
          : null
        }
        {
          this.props.galleryDescription
          ? <div style={styles.description}>{this.props.galleryDescription}</div>
          : null
        }
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
    above: {
      marginBottom: 10
    },
    below: {
      marginTop: 10
    }
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
    lineHeight: '1.3em'
  }
}
