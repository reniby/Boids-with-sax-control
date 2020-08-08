const flock = [];
let bb;
let temp = 0;
let synth;
let env;
let feedbackDelay;
let ns = 0.1;


let bool = 0;

class blu {
    constructor() {
      this.position = createVector(0, 0);
      this.leader = 0;
    }
}

let alignSlider, cohesionSlider, separationSlider;
let tom;

function setup() {
  createCanvas(300, 800);
  
  
  alignSlider = createSlider(0, 2, 1.5, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 2, 0.1);
  
  feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toMaster();
  tom = new Tone.PolySynth().connect(feedbackDelay);
  
  for (let i = 0; i < 100; i++) {
    if (i % 20 == 0)
      flock.push(new Boid(1));
    else
      flock.push(new Boid(0));
  }

  bb = new blu();
  
  synth = new Tone.DuoSynth().toMaster();
  
  
  feed = createSlider(25, 100, 40);
  feed.position(0, height+20);
  
  //////////

  
  source = new p5.AudioIn();
  source.start();

  lowPass = new p5.LowPass();
  lowPass.disconnect();
  source.connect(lowPass);

  fft = new p5.FFT();
  fft.setInput(lowPass);
  
  button1 = createButton("delay up", 0.1);
  button2 = createButton("delay down", 0.1);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    ns = ns - 0.1;
  } else if (keyCode === RIGHT_ARROW) {
    ns = ns + 0.1;
  }
  }

function draw() {
  background(220);
  
  feedbackDelay.set({
	feedback: ns
  });
  
  let leader = 0;
  
  var timeDomain = fft.waveform(1024, 'float32');
  var corrBuff = autoCorrelate(timeDomain);
  
  let vol = source.getLevel();
  let xaxis = map(vol, 0, 1, 0, width*2 + 50);
  

  var freq = findFrequency(corrBuff);
  let pitch = freq.toFixed(2);
  text (pitch, 20, 50); 
  
  if (abs(pitch - temp) < 5)
    count++;
  else
    count = 0;
  
  if (count > 3) {
    bb.position.x = xaxis;
    bb.position.y = height - pitch;
    bb.leader = 1;
  }
  else
    bb.leader = 0;
  
  temp = pitch;

  
  ///////////////////////////
  
  for (let i = 0; i < flock.length; i++) { 
    
    let boid = flock[i];
    
    if (boid.type == 1 && bool == 0) {
      let freq = height - boid.position.y + 100;      
      //synth.triggerAttackRelease(freq, "8n");
    
      tom.triggerAttackRelease(freq, "32n");
    }
    
    bool++;
    
    if (bool > feed.value())
      bool = 0;
    
    boid.edges();
    boid.flock(flock, bb);
    boid.update();
    boid.show(); 
  }  
  
  
  stroke('black');
  fill('blue');
  if (bb.leader > 0)
    ellipse(bb.position.x, bb.position.y, 10);
  
}
