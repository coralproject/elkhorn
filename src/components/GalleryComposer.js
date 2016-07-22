import preact from 'preact'
const {h, Component} = preact

export default class GalleryComposer extends Component {

  renderAnswers () {
    const {answers} = this.props
    console.log('answers?', answers)
    return answers.map(a => {
      console.log('answer?', a.answer.answer)
      // is this answer multiple choice?

      let answerBody

      if (Array.isArray(a.answer.answer.options)) {
        answerBody = a.answer.answer.options.map(option => {
          return <div style={styles.multi.option}>{option.title}</div>
        })
      } else { // a regular text response
        console.log('answer styles', styles.answer)
        answerBody = a.answer.answer.text
      }

      return <div style={styles.answer}>{answerBody}</div>
    })
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
