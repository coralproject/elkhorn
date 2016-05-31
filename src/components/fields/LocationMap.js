import preact from 'preact'
const { h, Component } = preact

import {Gmaps, Marker} from 'react-gmaps';

import AskField from '../AskField';

class LocationMap extends AskField {

  constructor(props, context) {
    super(props, context)
    // extend the state from AskWidget

    this.state = Object.assign(
      this.state,
      {
        selectedCoords: false
      }
    );
  }

  // Event listeners

  validateAndSave(options) {
    this.validate();
    this.update(options);
  }

  // Interface methods

  validate() {

    let isValid = true, isCompleted = false;

    isCompleted = !!this.state.streetAddress.length;

    this.setState({ isValid: isValid, completed: isCompleted });

    return !!this.props.required ?  isValid && isCompleted : isValid;

  }

  getValue() {
    return {
      selectedCoords: this.state.selectedCoords
    };
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: false
    });
  }

  onDragEnd(e) {
    console.log('onDragEnd', e);
    // this.setState({ selectedCoords: ? })
  }

  render() {
    return (
      <div style={ styles.base }>
        <p>Drag the marker to set the location.</p>
        <Gmaps
          width={'600px'}
          height={'400px'}
          lat={ this.props.startCoords.lat }
          lng={ this.props.startCoords.lng }
          zoom={12}
          loadingMessage={'Loading!'}
          params={{v: '3.exp', key: 'AIzaSyCn1rKb9S8djUux4OkEVUC4Sr6UJVLQaCU'}}
          onMapCreated={this.onMapCreated}>
          <Marker
            lat={ this.props.startCoords.lat }
            lng={ this.props.startCoords.lng }
            draggable={true}
            onDragEnd={ this.onDragEnd.bind(this) } />
        </Gmaps>
      </div>
    )
  }
}

const styles = {
  base: {
    maxWidth: '600px'
  }
}

export default LocationMap;
