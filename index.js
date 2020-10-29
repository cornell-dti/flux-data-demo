/** Simulation values */
let time = 0;
let queue = [];

/** Variable that holds the timer interval */
let timer = null;

/** Input values */
let speed = 1;
let incoming = 1;
let serving = 5;

/**
 * Generates a unique ID
 * Source: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
 * @param {number} length - length of ID
 */
function makeId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Updates speed data to match input
 * @param {string} value
 */
function updateSpeed(value) {
  speed = parseFloat(value);
  document.getElementById("speed-display").innerHTML = speed;
  pause();
  start();
}

/**
 * Updates incoming data to match input
 * @param {string} value
 */
function updateIncoming(value) {
  incoming = parseInt(value);
}

/**
 * Updates serving data to match input
 * @param {string} value
 */
function updateServing(value) {
  serving = parseInt(value);
}

/**
 * Returns color associated with counter
 * @param {number} counter - current value of box
 */
function getBoxColor(counter) {
  const value = counter / serving;
  if (value >= 0.75) return "#f56565";
  else if (value >= 0.5) return "#fc8181";
  else if (value >= 0.25) return "#feb2b2";
  else return "#fed7d7";
}

/**
 * Renders UI elements based on current data
 */
function render() {
  document.getElementById("time").innerHTML = time;
  document.getElementById("queue").innerHTML = JSON.stringify(queue, null, 2);
  document.getElementById("incoming").value = Math.ceil(incoming);

  const queueDisplay = document.getElementById("queue-display");
  queueDisplay.innerHTML = "";

  queue.forEach((q) => {
    if (document.getElementById(q.id) === null) {
      const elt = document.createElement("div");
      elt.id = q.id;
      elt.className = "queue-box";
      elt.style.background = getBoxColor(q.counter);
      queueDisplay.appendChild(elt);
    } else {
      const elt = document.getElementById(q.id);
      elt.style.background = getBoxColor(q.counter);
    }
  });
  document.getElementById("waiting").innerHTML = getWaitTime();
}

/**
 * Returns `f(x)` based on a Gaussian function with parameters a, b, c
 * Read more: https://en.wikipedia.org/wiki/Gaussian_function
 * Visualization: https://www.desmos.com/calculator/dxehrz5pe4
 * @param {number} x - input variable
 * @param {number} a - a in Gaussian function
 * @param {number} b - b in Gaussian function
 * @param {number} c - c in Gaussian function
 */
function gaussian(x, a = 33, b = 12, c = 1) {
  return a * Math.exp((-1 * (x - b) ** 2) / (2 * c ** 2));
}

/**
 * Called at each interval iteration
 */
function step() {
  // add to queue for each incoming person
  for (let i = 0; i < incoming; i++) {
    queue.push({ id: makeId(3), counter: serving });
  }

  // update incoming rate according to Gaussian function
  incoming = gaussian(time) >= 0.01 ? gaussian(time) : 0;
  // console.log(time, incoming);

  // update first person on queue by decrementing counter
  if (queue.length > 0) {
    // TODO: update to enable serving time to be function-based
    queue[0].counter -= 1;
    if (queue[0].counter === 0) queue = queue.slice(1);
  }

  // update time and rerender
  time += 1;
  render();
}

function getWaitTime() {
  let wait = 0;
  queue.forEach((q) => {
    wait += q.counter;
  });
  return wait;
}

/** Interval functions **/

function start() {
  clearInterval(timer);
  timer = setInterval(step, 1000 / speed);
}

function pause() {
  clearInterval(timer);
}

function reset() {
  pause();
  queue = [];
  time = 0;
  render();
}
