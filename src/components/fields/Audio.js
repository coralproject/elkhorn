import preact from 'preact'
const { h, Component } = preact;

class Audio extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      recording: false,
      initialized: false,
      recorded: false,
      recordedAudioURL: ''
    }
  }

  initAudio() {

    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
      {
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
            },
            "optional": []
        },
      }, 
      this.audioInitialized.bind(this), 
      function(e) {
          console.log('Error getting audio');
          console.log(e);
      }
    );
  }

  audioInitialized(stream) {

    this.setState({ recording: true });

    this.stream = stream;
    this.audioChunks = [];

    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.start();
    var chunks = this.audioChunks;
    this.mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }

    AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    var audioInput = null,
        realAudioInput = null,
        inputPoint = null,
        audioRecorder = null;
    this.rafID = null;
    this.analyserContext = null;
    this.canvasWidth = null;
    this.canvasHeight = null;
    var recIndex = 0;
    
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(this.stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

    this.analyserNode = audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;
    inputPoint.connect( this.analyserNode );

    //audioRecorder = new Recorder( inputPoint );

    this.zeroGain = audioContext.createGain();
    this.zeroGain.gain.value = 0.0;
    inputPoint.connect( this.zeroGain );
    this.zeroGain.connect( audioContext.destination );

    var a = this.updateAnalysers.bind(this);
    a();
      
  }

  updateAnalysers(time) {
    
    if (!this.analyserContext) {
        var canvas = document.querySelector("canvas");
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.analyserContext = canvas.getContext('2d');
    }

    var SPACING = 3;
    var BAR_WIDTH = 20;
    var numBars = Math.round(this.canvasWidth / (SPACING + BAR_WIDTH));
    var freqByteData = new Uint8Array(this.analyserNode.frequencyBinCount);

    this.analyserNode.getByteFrequencyData(freqByteData); 

    this.analyserContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.analyserContext.fillStyle = '#F6D565';
    this.analyserContext.lineCap = 'round';
    var multiplier = this.analyserNode.frequencyBinCount / numBars;

    // Draw rectangle for each frequency bin.
    for (var i = 0; i < numBars; ++i) {
        var magnitude = 0;
        var offset = Math.floor( i * multiplier );
        // gotta sum/average the block, or we miss narrow-bandwidth spikes
        for (var j = 0; j< multiplier; j++)
            magnitude += freqByteData[offset + j];
        magnitude = magnitude / multiplier;
        this.analyserContext.fillStyle = "hsl( " + Math.round(((i*90)/numBars) - 50) + ", 100%, 50%)";
        this.analyserContext.fillRect(i * (SPACING + BAR_WIDTH), this.canvasHeight, BAR_WIDTH, -magnitude);
    }
    
    if (this.state.recording) {
      this.rafID = window.requestAnimationFrame( this.updateAnalysers.bind(this) );
    } 

  }

  onRecordClick() {
    if (!this.state.recording) {
      this.setState({ recorded: false });
      this.initAudio();
    } else {
      this.setState({ recording: false });
      this.mediaRecorder.stop();
      var blob = new Blob(this.audioChunks, { 'type' : 'audio/ogg;' });
      var audioURL = window.URL.createObjectURL(blob);
      this.stream.getAudioTracks()[0].stop();     

      var arrayBuffer;
      var fileReader = new FileReader();
      var self=this;
      fileReader.onload = function() {
          arrayBuffer = this.result;
          var a = self.drawWaveform.bind(self);
          a(arrayBuffer);
      };
      fileReader.readAsArrayBuffer(blob);    
      this.setState({ recordedAudioURL: audioURL, recorded: true });
    }
  }

  drawWaveform(data) {
    var arrayBufferView = new Uint8Array(data);

    var canvas = document.querySelector("canvas");
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext('2d');

    var step = Math.ceil( arrayBufferView.length / width );
    var amp = height / 2;
    context.fillStyle = "#F77160";
    context.clearRect(0,0,width,height);
    for(var i=0; i < width; i++){
        var min = 1.0;
        var max = -1.0;
        for (var j=0; j<step; j++) {
            var datum = (arrayBufferView[(i*step)+j] - 127) / 127;
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    }
  }

  getButtonStyle() {
    return Object.assign({}, !this.state.recording ? styles.recButton : styles.stopButton);
  }

  onPlayClick() {
    // TODO: refs are not working in Storybook, due to a conflicting React dependency,
    // I need to find a workaround
    var audioElement = document.querySelector('audio');
    audioElement.play();
  }

  onFocus() {
    this.props.onFocus();
  }

  render() {
    return (
      <div style={ styles.base }>
        <div style={ styles.buttonAndSpectrum }>
          <button 
            style={ this.getButtonStyle() } 
            onFocus={ this.onFocus.bind(this) }
            onClick={ this.onRecordClick.bind(this) }>
            {
              this.state.recording ?
                'STOP'
              : 
                'REC'
            }
          </button>
          <canvas style={ styles.spectrumAnalyzer } width="1024" height="80"></canvas>
          {
            this.state.recorded ?
              <span onClick={ this.onPlayClick.bind(this) } style={ styles.playSymbol }>&#9654;</span>
            : null
          }
        </div>
        <audio src={ this.state.recordedAudioURL } />
        {
          this.state.recording ?
            <h2>Recording...</h2>
          : null
        }
      </div>
    )
  }
}

const styles = {
  base: {
    display: 'block',
    color: '#888',
    padding: '20px 5%',
    width: '90%',
    border: 'none',
    minHeight: '100px'
  },
  recButton: {
    width: '80px',
    height: '80px',
    background: '#C62828',
    color: 'white',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '40px',
    transition: 'all 1s',
    boxShadow: '0 7px 8px #CCC',
    flexShrink: '0',
    marginRight: '10px',
    border: 'none',
    outline: 'none'
  },
  stopButton: {
    width: '80px',
    height: '80px',
    background: '#37474F',
    color: 'white',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '3px',
    transition: 'all 1s',
    boxShadow: '0 7px 8px #CCC',
    flexShrink: '0',
    marginRight: '10px',
    border:'none',
    outline: 'none'
  },
  spectrumAnalyzer: {
    background: '#f0f0f0',
    flexGrow: '1',
    width: '10%'
  },
  buttonAndSpectrum: {
    display: 'flex',
    position: 'relative'
  },
  playSymbol: {
    color: 'white',
    background: 'rgba(0,0,0,.2)',
    position: 'absolute',
    top: '15px',
    right: '170px',
    fontSize: '35px',
    borderRadius: '40px',
    width: '50px',
    height: '50px',
    display: 'block',
    border: '2px solid white',
    textAlign: 'center',
    lineHeight: '46px',
    paddingLeft: '2px',
    cursor: 'pointer'
  }

}

export default Audio;
