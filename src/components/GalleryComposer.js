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
    return answer.identity_answers && this.props.identifiableIds.length
    ? <p className={`askGallery__pii askGallery__pii-${placement}`}>
      {answer.identity_answers.map(idAnswer => {
        const displayable = this.props.identifiableIds.indexOf(idAnswer.widget_id) !== -1
        return displayable ? idAnswer.answer.text : ''
      }).join(' ')}
    </p>
    : null
  }

  render () {
    return (
      <div className='askGallery'>
        {
          this.props.galleryTitle
          ? <div className='askGallery__title'>{this.props.galleryTitle}</div>
          : null
        }
        {
          this.props.galleryDescription
          ? <div className='askgallery__description'>{this.props.galleryDescription}</div>
          : null
        }
        <div className='askGallery__answers'>
          {this.renderAnswers()}
        </div>
      </div>
    )
  }
}
