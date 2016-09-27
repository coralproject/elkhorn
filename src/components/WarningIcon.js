import preact from 'preact'
const { h, Component } = preact

class WarningIcon extends Component {
  render () {
    return (
      <svg width='20' height='20' x='0px' y='0px' viewBox='128 128 256 256'>
        <path fill="#D0021B" d="M256.5,136C193.263,136,142,187.263,142,250.5c0,63.236,51.263,114.5,114.5,114.5c63.236,0,114.5-51.264,114.5-114.5  C371,187.263,319.736,136,256.5,136z M271,311.411h-26.55v-26.55H271V311.411z M271,275.035h-26.55v-88.362H271V275.035z"></path>
      </svg>
    )
  }
}

export default WarningIcon
