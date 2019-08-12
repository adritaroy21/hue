const colour = document.getElementById('colour');
const generate = document.getElementById('generate');
const hex = document.getElementById('hex');
const copy = document.getElementById('copy');
const message = document.getElementById('message');

hex.readOnly = true;
generate.addEventListener('click', generateNew);
copy.addEventListener('click', copyHex);

// Returns a number between 0 and 255
function randomNumber() {
  return Math.floor(Math.random() * 256);
}

// RGB to Hex
function rgbToHex(value) {
  let hex = Number(value).toString(16);
  if (hex.length < 2) {
    hex = '0' + hex;
  }
  return hex;
}

// Sets a random colour to the background
function randomColour() {
  let red = randomNumber();
  let green = randomNumber();
  let blue = randomNumber();

  colour.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';

  hex.value = rgbToHex(red) + rgbToHex(green) + rgbToHex(blue);
}

// Sets the colour on load
document.addEventListener('DOMContentLoaded', function() {
  randomColour();
});

// Reloads the page
function generateNew() {
  randomColour();
}

//Copy Hex to clipboard
function copyHex() {
  hex.focus();
  hex.select();
  document.execCommand('copy');

  message.style.display = 'block';
  setTimeout(function() {
    message.style.display = 'none';
  }, 500);
}
