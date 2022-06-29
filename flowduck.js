// /\//\+/-//\/\/
// >o
//  (>)

const TotalDucks = 20;

var gbl = {};

function resize() {
  gbl.ctx.canvas.width = window.innerWidth - 20;
  gbl.ctx.canvas.height = window.innerHeight - 20;
  gbl.width = gbl.ctx.canvas.width;
  gbl.height = gbl.ctx.canvas.height;
}

function initAll() {
  const canvas = document.getElementById('clock');
  var ctx = canvas.getContext('2d');
  gbl = {
    ctx,
    ducks: [],
    lastUpdate: new Date(),
  };
  resize();
  window.addEventListener('resize', resize, false);
}

function getRemainingTime() {
  var date = new Date();
  var current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  var end = Date.UTC(2022, 7, 15, 6);
  var totalSeconds = Math.floor((end - current) / 1000);
  var seconds = totalSeconds % 60;
  var minutes = Math.floor(totalSeconds % (60 * 60) / 60);
  var hours = Math.floor(totalSeconds % (60 * 60 * 24) / (60 * 60));
  var days = Math.floor(totalSeconds / 60 / 60 / 24);
  return {
    finished: current >= end,
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
  };
}

function randomX() {
  return Math.floor(Math.random() * gbl.width);
}

function randomY() {
  return Math.floor(Math.random() * gbl.height);
}

function randomRate() {
  return -(Math.random() * 50 + 50);
}

function addDuck(ducks) {
  ducks.push({
    x: randomX(),
    y: randomY(),
    dx: randomRate(),
  });
}

function updateDuck(duck, dt) {
  duck.x = duck.x + dt * duck.dx;
  if (duck.x < -100) {
    duck.x = gbl.width;
    duck.y = randomY();
    duck.dx = randomRate();
  }
}

function drawDuck(ctx, x, y) {
  var lineheight = 15;
  ctx.fillText('>o', x, y + lineheight);
  ctx.fillText(' (>)', x, y + 2 * lineheight);
}

function drawDucks(ctx, ducks, dt) {
  ctx.fillStyle = '#888';
  ctx.font = '15px monospace';
  if (ducks.length < TotalDucks) {
    addDuck(ducks);
  }
  ducks.forEach((duck) => {
    updateDuck(duck, dt);
    drawDuck(ctx, duck.x, duck.y);
  });
}

setInterval(() => {
  var ctx = gbl.ctx;
  var width = gbl.width;
  var height = gbl.height;

  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, width, height);

  var current = new Date();
  var dt = (current - gbl.lastUpdate) / 1000;
  if (dt > 10) {
    dt = 0.01; // Pick up where you left off when javascript goes to sleep
  }
  drawDucks(ctx, gbl.ducks, dt);
  gbl.lastUpdate = current;

  var remaining = getRemainingTime();
  var secStr = 'flowduck eol ' + remaining.totalSeconds + 's';
  var hoursPad = remaining.hours < 10 ? '0' : '';
  var minutesPad = remaining.minutes < 10 ? '0' : '';
  var secondsPad = remaining.seconds < 10 ? '0' : '';
  var daysS = remaining.days == 1 ? ' ' : 's';
  var hoursS = remaining.hours == 1 ? ' ' : 's';
  var minutesS = remaining.minutes == 1 ? ' ' : 's';
  var secondsS = remaining.seconds == 1 ? ' ' : 's';
  var humanStr = remaining.days + ' day' + daysS + ' ' + hoursPad + remaining.hours + ' hour' + hoursS + ' ' + minutesPad + remaining.minutes + ' minute' + minutesS + ' ' + secondsPad + remaining.seconds + ' second' + secondsS;

  if (remaining.finished) {
    secStr = 'flowduck eol has arrived';
    humanStr = 'happy day';
  }

  var padding = 35;

  ctx.fillStyle = '#aaa';
  ctx.font = '50px monospace';
  var secStrDim = ctx.measureText(secStr);
  ctx.fillText(secStr, width - padding - secStrDim.width, 150);

  ctx.font = '15px monospace';
  var humanStrDim = ctx.measureText(humanStr);
  ctx.fillText(humanStr, width - padding - humanStrDim.width, 170);

}, 1000 / 60);

initAll();
