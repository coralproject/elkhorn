import preact from 'preact';
const {Component, h} = preact;

import AskWidget from './AskWidget';

class Rating extends AskWidget {
  constructor(props, context) {
    super(props, context)
    this.state = {
      rating: 0,
      hovering: 0,
      focused: -1,
      value: 0
    }
  }

  getStyles() {
    return Object.assign({}, styles.base, this.props.isValid ? styles.valid : styles.error);
  }

  onBlur() {
    this.setState({ focused: -1 });
  }

  onFocus(i, e) {
    this.setState({ focused: i });
    this.props.onFocus();
  }

  onHover(i, e) {
    this.setState({ hovering: i });
    // sets focus on hover! looks weird otherwise
    this.props.onFocus();
  }

  onClick(i, e) {
    this.setState({ value: i });
    if (this.state.value > 0) {
      this.setState({ focused: false, completed: true, isValid: true });
    } else {
      this.setState({ focused: false, completed: false });
    }
    this.save();
  }

  onMouseOut() {
    this.setState({ hovering: 0 });
  }

  getTokenStyle(i) {
    return Object.assign({}, 
      styles.token, 
      i == this.state.focused ? styles.focused : {},
      i < this.state.hovering ? styles.hovering : {},
      i < this.state.value ? styles.clicked : {}
    ); 
  }

  getTokens() {
    var tokens = [];
    var steps = this.props.steps || 5;
    for (var i = 0; i < steps; i++) {
      tokens.push(
        <button 
          onBlur={ this.onBlur.bind(this) }
          onFocus={ this.onFocus.bind(this, i) }
          onMouseOver={ this.onHover.bind(this, i + 1) } 
          onClick={ this.onClick.bind(this, i + 1) }
          style={ this.getTokenStyle(i) }
        >
          &#9733;
        </button>
      );
    }
    return tokens;
  }

  getTitleStyles() {
    return Object.assign({}, 
      this.props.hasFocus ? styles.focusedTitle : {}
    );
  }

  render() {

    return (
      <div style={ styles.base } onMouseOut={ this.onMouseOut.bind(this) }>
        {
          this.getTokens().map((token) => {
            return token
          })
        }
      </div>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    color: '#888',
    width: '90%',
    outline: 'none',
    border: 'none',
    minHeight: '100px'
  },
  token: {
    fontSize: '50px',
    cursor: 'pointer',
    color: '#777',
    lineHeight: '50px',
    transition: 'color .2s',
    background: 'none',
    border: 'none',
    outline: 'none'
  },
  hovering: {
    color: '#1E88E5'
  },
  clicked: {
    color: '#F57C00'
  },
  focused: {
    color: '#FF5722'
  },
  focusedTitle: {
    color: '#009688'
  }
}

export default Rating;
