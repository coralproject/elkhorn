
import preact from 'preact';
const { h, Component } = preact;

class Drawer extends Component {

  constructor(props, context) {
    super(props, context)
    this.dragging = false
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d')
    this.ctx.strokeStyle = '#F06A75'
    this.ctx.lineWidth = 3
    this.ctx.lineCap = 'round'
  }

  onMouseDown({ clientX, clientY }) {
    const { left, top } = this.canvas.getBoundingClientRect()
    this.ctx.beginPath()
    this.ctx.moveTo(clientX - left, clientY - top)
    this.dragging = true
  }

  onMouseUp() {
    this.dragging = false
  }

  onMouseMove({ clientX, clientY }) {
    if (this.dragging) {
      const { left, top } = this.canvas.getBoundingClientRect()
      this.draw(clientX - left, clientY - top)
    }
  }

  draw(x, y) {
    this.ctx.lineTo(x, y)
    this.ctx.stroke()
  }

  onColorSelected(color) {
    this.ctx.strokeStyle = color
  }

  render () {
    const { width, height, onFocus } = this.props
    return (
      <div onClick={onFocus}>
        <canvas
          width='500'
          height='300'
          ref={canvas => this.canvas = canvas}
          onMouseDown={::this.onMouseDown}
          onMouseup={::this.onMouseUp}
          onMouseMove={::this.onMouseMove}></canvas>
        <Controls onColorSelected={::this.onColorSelected} />
      </div>
    )
  }
}

const Controls = (props) => (
  <div>
    {['#F06A75', '#DBE374', '#A9EFA7', '#4CE1E8', '#2B80D3'].map(color => (
      <div style={{display: 'inline-block',
            backgroundColor: color,
            width: 20,
            height: 20,
            cursor: 'pointer',
            }}
            onClick={() => props.onColorSelected(color)}></div>
    ))}
  </div>
)


export default Drawer
