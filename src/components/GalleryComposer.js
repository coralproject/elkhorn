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
          return <div className='askGallery__answerMultiOption'>{option.title}</div>
        })
      } else { // a regular text response
        const text = a.answer.edited ? a.answer.edited : a.answer.answer.text
        answerBody = <span className='askGallery__answerText'>{text}</span>
      }

      return (
        <div className='askGallery__answer'>
          {
            this.props.config.placement === 'above'
            ? this.renderIdentityInfo(a, 'above')
            : null
          }
          {answerBody}
          {
            this.props.config.placement === 'below'
            ? this.renderIdentityInfo(a, 'below')
            : null
          }
        </div>
      )
    })
  }

  renderIdentityInfo (answer, placement) {
    console.log('renderIdentityInfo', this.props)
    return answer.identity_answers && this.props.config.identifiableIds.length
    ? <p className={`askGallery__pii askGallery__pii-${placement}`}>
      {answer.identity_answers.map(idAnswer => {
        const displayable = this.props.config.identifiableIds.indexOf(idAnswer.widget_id) !== -1
        return displayable ? idAnswer.answer.text : ''
      }).join(' ')}
    </p>
    : null
  }

  render () {
    console.log('render elkhorn', this.props)
    return (
      <div className='askGallery'>
        {
          this.props.headline
          ? <div className='askGallery__title'>{this.props.headline}</div>
          : null
        }
        {
          this.props.description
          ? <div className='askGallery__description'>{this.props.description}</div>
          : null
        }
        <div className='askGallery__answers'>
          {this.renderAnswers()}
        </div>
      </div>
    )
  }
}
