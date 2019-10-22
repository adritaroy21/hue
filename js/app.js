const colour = document.getElementById('colour');
const generate = document.getElementById('generate');
const hex = document.getElementById('hex');
const copy = document.getElementById('primaryCopyBtn');
const message = document.getElementById('message');
const historyContent = document.getElementById('history-content');
const search = document.getElementById('search');

const name = document.getElementById('name');
const rgb = document.getElementById('rgb');
const cmyk = document.getElementById('cmyk');
const hsv = document.getElementById('hsv');
const hsl = document.getElementById('hsl');
const xyz = document.getElementById('xyz');
const status = document.getElementById('status');
const fields = [name, rgb, cmyk, hsv, hsl, xyz];

let hexHistoryQueue = [];

// Get existing history from LS if any
function getHistoryFromStorage() {
  if (localStorage.getItem('colors')) {
    hexHistoryQueue = JSON.parse(localStorage.getItem('colors'));
  } else {
    localStorage.setItem('colors', '');
  }
}

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

// Update info area
function updateInfoArea(data) {
  if (data) {
    status.innerHTML = `(online)`;
    status.setAttribute('class', 'text-success');
    name.innerHTML = `${data.name.value}`;
    rgb.innerHTML = `${data.rgb.r}, ${data.rgb.g}, ${data.rgb.b}`;
    cmyk.innerHTML = `${data.cmyk.c}, ${data.cmyk.m}, ${data.cmyk.y}, ${data.cmyk.k}`;
    hsv.innerHTML = `${data.hsv.h}, ${data.hsv.s}%, ${data.hsv.v}%`;
    hsl.innerHTML = `${data.hsl.h}, ${data.hsl.s}%, ${data.hsl.l}%`;
    xyz.innerHTML = `${data.XYZ.X}, ${data.XYZ.Y}, ${data.XYZ.Z}`;
  } else {
    status.innerHTML = `(offline)`;
    status.setAttribute('class', 'text-danger');
  }
}

// Fetch color info from The Color API
function fetchColorInfo(hexVal) {
  // Update info area as fetching..
  status.innerHTML = `(fetching)`;
  status.setAttribute('class', 'text-warning');
  fields.forEach((item, index) => {
    item.innerHTML = `<i class="far fa-clock"></i>`;
  });

  // fetch data
  fetch(`https://www.thecolorapi.com/id?hex=${hexVal}`)
    .then(res => res.json())
    .then(data => {
      updateInfoArea(data);
    })
    .catch(err => {
      console.error(err);
      updateInfoArea(null);
    });
}

// Update hexHistoryQueue
function updateHistory(hexValue) {
  if (hexHistoryQueue.length < 11) {
    hexHistoryQueue.push(hexValue);
  } else {
    hexHistoryQueue.shift();
    hexHistoryQueue.push(hexValue);
  }
}

// Update history in localstorage
function updateStorage() {
  localStorage.setItem('colors', JSON.stringify(hexHistoryQueue));
}

// Update the history area
function updateHistoryArea() {
  // Remove existing items from UI
  while (historyContent.firstChild) {
    historyContent.removeChild(historyContent.firstChild);
  }
  // Add contents of hexHistoryQueue to UI
  hexHistoryQueue.forEach(item => {
    const historyItem = document.createElement('div');
    historyItem.setAttribute(
      'class',
      'history-item d-flex justify-content-between align-items-center'
    );
    historyItem.innerHTML = `
      <div class="history-hex p-2">${item}</div>
      <div
        class="hex-preview mx-1 flex-grow-1 px-2"
        style="background: ${item};"
      ></div>
      <div class="copy p-2" id="copy">
        <i class="fa fa-copy"></i> Copy
      </div>
    `;
    historyContent.appendChild(historyItem);
  });
}

// Sets a random colour to the background
function randomColour() {
  let red = randomNumber();
  let green = randomNumber();
  let blue = randomNumber();

  colour.style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
  hex.value = '#' + rgbToHex(red) + rgbToHex(green) + rgbToHex(blue);

  fetchColorInfo(hex.value.substring(1, 7));
  updateHistory(hex.value);
  updateStorage();
  updateHistoryArea();
}

// Attaching event listeners

// Sets the colour on load
document.addEventListener('DOMContentLoaded', function() {
  getHistoryFromStorage();
  randomColour();
});

// Generate new colour
generate.addEventListener('click', randomColour);

// Primary copy button event listener
copy.addEventListener('click', () => {
  hex.select();
  document.execCommand('copy');
  hex.blur();
  let temp = hex.value;
  hex.value = 'Copied!';
  copy.disabled = true;
  setTimeout(() => {
    hex.value = temp;
    copy.disabled = false;
  }, 1000);
});

// History area copy button event listener
historyContent.addEventListener('click', e => {
  if (e.target.id === 'copy') {
    let hexNode = e.target.parentNode.childNodes[1];
    let temp = hex.value;
    hex.value = hexNode.innerHTML;
    hex.select();
    document.execCommand('copy');
    hex.blur();
    hex.value = temp;
    e.target.innerHTML = 'Copied!';
    setTimeout(() => {
      e.target.innerHTML = '<i class="fa fa-copy"></i> Copy';
    }, 1000);
  }
});

// Search button event listener
search.addEventListener('click', () => {
  if (hex.value.match(/^#[0-9A-F]{6}$/i) === hex.value) {
    searchHex = hex.value;
    colour.style.backgroundColor = searchHex;
    fetchColorInfo(searchHex.substring(1, 7));
    updateHistory(searchHex);
    updateStorage();
    updateHistoryArea();
  } else {
    hex.value = 'Invalid Hex';
  }
});

// Register Service Worker
// Check that service workers are supported
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js');
  });
}
