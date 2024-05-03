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
  
  void main() {
     gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
     vTexCoord = aTexCoord;
  }
  
`;

const frag = `
  precision mediump float;
  
  uniform sampler2D sTexture;
  
  // Fog color
  uniform vec4 u_fogColor;
  // Fog density (higher value means denser fog)
  uniform float u_fogAmount;
  
  // Cordenadas de la textura que estamos importando
  varying vec2 vTexCoord;
  
  void main() {
     vec4 originalColor = texture2D(sTexture, vTexCoord); 
    
     // Completely discard fragments when fogAmount is 0 (no fog)
  
     // Mix between texture color and fog color based on fog factor
     vec4 fogColor = mix(u_fogColor, vec4(originalColor.rgb, 100), u_fogAmount);
     
     gl_FragColor = fogColor;
  }
`;

let obj, img, shaderProgram;
let fogColor = [1, 1, 1, 1];// Adjust fog color as desired (RGBA)
let fogAmount = 0.5; // Adjust fog density (higher for denser fog)
const xOffset = 15 ;
const zOffset = 25 ;

let fogAmountSlider;

function preload(){
  obj = loadModel('assets/feline/feline.obj', true);
  img = loadImage('assets/feline/feline-atlas.jpg');
}

function setup(){
  createCanvas(800, 600, WEBGL);
  currentShader = createShader(vert, frag);
  noStroke();
  // Create a slider for fog density
  fogAmountSlider = createSlider(0, 1, fogAmount, 0.01);
  fogAmountSlider.position(20, 20);
  fogAmountSlider.input(updateFogAmount);
}

function updateFogAmount() {
  fogAmount = fogAmountSlider.value();
}

function draw(){
  background(255)
  orbitControl();

  rotateX(PI);

  shader(currentShader);

  // Set texture uniform


  // Set fog color and amount uniforms
  currentShader.setUniform("u_fogColor", fogColor);
  currentShader.setUniform("u_fogAmount", fogAmount);

  // Loop to draw multiple figures with translatio2n
  for (let i = 0; i < 5; i++) {
    // Create a model matrix with translation
    let modelMatrix = translate(-2 + i * xOffset, 0, -i * zOffset);

    currentShader.setUniform("sTexture", img);
    // Draw the model
    model(obj);
  }
}
