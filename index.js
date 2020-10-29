let time = 0;
let maxStep = 7;

let timer = null;
let queue = [];

let speed = 1;
let incoming = 1;
let serving = 5;

// source: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
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

function updateSpeed(value) {
  speed = parseFloat(value);
  document.getElementById("speed-display").innerHTML = speed;
  pause();
  start();
}

function updateIncoming(value) {
  incoming = parseInt(value);
}

function updateServing(value) {
  serving = parseInt(value);
}

function getBoxColor(counter) {
  const value = counter / serving;
  if (value >= 0.75) return "#f56565";
  else if (value >= 0.5) return "#fc8181";
  else if (value >= 0.25) return "#feb2b2";
  else return "#fed7d7";
}

/**
 * Renders all the elements to reflect the current data
 **/
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

// https://www.desmos.com/calculator/dxehrz5pe4
function gaussian(x, a = 33, b = 12, c = 1) {
  return a * Math.exp((-1 * (x - b) ** 2) / (2 * c ** 2));
}

function step() {
  // add to queue
  for (let i = 0; i < incoming; i++) {
    queue.push({ id: makeId(3), counter: serving });
  }
  incoming = gaussian(time) >= 0.01 ? gaussian(time) : 0;
  // console.log(time, incoming);
  if (queue.length > 0) {
    // TODO: update to enable serving time to be function-based
    queue[0].counter -= 1;
    if (queue[0].counter === 0) queue = queue.slice(1);
  }
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
