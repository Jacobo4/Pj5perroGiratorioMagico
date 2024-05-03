const vert = `
  precision mediump float;
  
  attribute vec4 aPosition;
  attribute vec2 aTexCoord;
  
  // Matriz del espacio
  uniform mat4 uModelViewMatrix;
  // Matriz de projección del renderizado
  uniform mat4 uProjectionMatrix;
  
  // Cordenadas de la textura que estamos importando
  varying vec2 vTexCoord;
  varying vec3 v_position;
  
  void main() {
     gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
     vTexCoord = aTexCoord;
     v_position = (uModelViewMatrix * aPosition).xyz;
  }
  
`;

const frag = `
  precision mediump float;
  
  uniform sampler2D sTexture;
  
  // Fog color
  uniform vec4 u_fogColor;
  // Fog density (higher value means denser fog)
  uniform float u_fogDensity;
  
  // Cordenadas de la textura que estamos importando
  varying vec2 vTexCoord;
  varying vec3 v_position;
  
  void main() {
     vec4 originalColor = texture2D(sTexture, vTexCoord); 
    
     
     
     #define LOG2 1.442695

     float fogDistance = length(v_position);
     float fogAmount = 1. - exp2(-u_fogDensity * u_fogDensity * fogDistance * fogDistance * LOG2);
     fogAmount = clamp(fogAmount, 0., 1.);
     
     if (fogDistance < 0.0017){
      discard;
     }

     vec4 fogColor = mix(originalColor, u_fogColor, fogAmount); 

     gl_FragColor = fogColor; 
  }
`;

let obj, img, shaderProgram;
let fogColor = [1, 1, 1, 1];// Adjust fog color as desired (RGBA)
let fogDensity =0.001; // Adjust fog density (higher for denser fog)
const xOffset = 10 ;
const zOffset = 150 ;
let frameCount = 0;
let fogDensitySlider;

function preload(){
  obj = loadModel('assets/feline/feline.obj', true);
  img = loadImage('assets/feline/feline-atlas.jpg');
}

function setup(){
  createCanvas(800, 600, WEBGL);
  currentShader = createShader(vert, frag);
  noStroke();
  // Create a slider for fog density
  fogDensitySlider = createSlider(0, 0.003, fogDensity,0.0001);
  fogDensitySlider.position(20, 20);
  fogDensitySlider.input(updateFogDensity);
}

function updateFogDensity() {
  fogDensity = fogDensitySlider.value();
}

function draw(){
  background(255)
  orbitControl();

  rotateX(PI - 0.2);
  rotateY(3.7);

  shader(currentShader);

  // Set texture uniform


  // Set fog color and amount uniforms
  currentShader.setUniform("u_fogColor", fogColor);
  currentShader.setUniform("u_fogDensity", fogDensity);


  // Loop to draw multiple figures with translatio2n
  for (let i = 0; i < 40; i++) {
    push();
    // Create a model matrix with translation
    let modelMatrix = translate(-2 + i * xOffset, 0, -i * zOffset);
     currentShader.setUniform("sTexture", img);
     applyMatrix(
      cos(frameCount), -sin(frameCount), 0, 0,
      sin(frameCount), cos(frameCount), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );

    // Draw the model
    model(obj);
    pop();
  }

  frameCount += 0.003;
}
