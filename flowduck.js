// /\//\+/-//\/\/
// >o
//  (>)

document.title = EventName;

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
  var totalSeconds = Math.floor((EndDate - current) / 1000);
  var seconds = totalSeconds % 60;
  var minutes = Math.floor(totalSeconds % (60 * 60) / 60);
  var hours = Math.floor(totalSeconds % (60 * 60 * 24) / (60 * 60));
  var days = Math.floor(totalSeconds / 60 / 60 / 24);
  return {
    finished: current >= EndDate,
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
  return Math.floor(Math.random() * (gbl.height - MaxDuckSize));
}

function randomRate() {
  return -(Math.random() * (MaxDuckRate - MinDuckRate) + MinDuckRate);
}

function randomDuckSize() {
  return Math.random() * (MaxDuckSize - MinDuckSize) + MinDuckSize;
}

function addDuck(ducks) {
  var isSpecial = ducks.length == TotalDucks - 1;
  ducks.push({
    x: randomX(),
    y: randomY(),
    bob: 0,
    dx: randomRate(),
    size: randomDuckSize(),
    width: 0,
    color: isSpecial ? SpecialDuckColor : DuckColor,
    special: isSpecial ? Special : null,
  });
}

function updateDuck(duck, dt) {
  duck.x = duck.x + dt * duck.dx;
  duck.bob = DuckBob * Math.sin(duck.x / 50);
  if (duck.x < -duck.width * 1.1) {
    duck.x = gbl.width;
    duck.y = randomY();
    duck.dx = randomRate();
    duck.size = randomDuckSize();
  }
}

function measureDuck(ctx, duck) {
  var width = 0;
  if (duck.special != null) {
    width = duck.special.measure(ctx, duck);
  }
  var lineheight = Math.floor(duck.size / 2);
  ctx.font = lineheight + 'px monospace';
  Duck.split("\n").forEach((line, i) => {
    var dim = ctx.measureText(line);
    if (dim.width > width) {
      width = dim.width;
    }
  });
  duck.width = width;
}

function drawDuck(ctx, duck) {
  var lineheight = Math.floor(duck.size / 2);
  ctx.font = lineheight + 'px monospace';
  ctx.fillStyle = duck.color;
  Duck.split("\n").forEach((line, i) => {
    ctx.fillText(line, duck.x, duck.y + lineheight * (i + 1) + duck.bob);
  });
  if (duck.width == 0) {
    measureDuck(ctx, duck);
  }
  if (duck.special != null) {
    duck.special.draw(ctx, duck);
  }
}

function drawDucks(ctx, ducks, dt) {
  if (ducks.length < TotalDucks) {
    addDuck(ducks);
  }
  ducks.forEach((duck) => {
    updateDuck(duck, dt);
    drawDuck(ctx, duck);
  });
}

setInterval(() => {
  var ctx = gbl.ctx;
  var width = gbl.width;
  var height = gbl.height;

  ctx.fillStyle = BackgroundColor;
  ctx.fillRect(0, 0, width, height);

  var current = new Date();
  var dt = (current - gbl.lastUpdate) / 1000;
  if (dt > 10) {
    dt = 0.01; // Pick up where you left off when javascript goes to sleep
  }
  drawDucks(ctx, gbl.ducks, dt);
  gbl.lastUpdate = current;

  var remaining = getRemainingTime();
  var secStr = EventName + ' ' + remaining.totalSeconds + 's';
  var hoursPad = remaining.hours < 10 ? '0' : '';
  var minutesPad = remaining.minutes < 10 ? '0' : '';
  var secondsPad = remaining.seconds < 10 ? '0' : '';
  var daysS = remaining.days == 1 ? ' ' : 's';
  var hoursS = remaining.hours == 1 ? ' ' : 's';
  var minutesS = remaining.minutes == 1 ? ' ' : 's';
  var secondsS = remaining.seconds == 1 ? ' ' : 's';
  var humanStr = remaining.days + ' day' + daysS + ' ' + hoursPad + remaining.hours + ' hour' + hoursS + ' ' + minutesPad + remaining.minutes + ' minute' + minutesS + ' ' + secondsPad + remaining.seconds + ' second' + secondsS;

  if (remaining.finished) {
    secStr = EventName + ' has arrived';
    humanStr = FinalMessage;
  }

  ctx.fillStyle = TextColor;
  ctx.font = TitleSize + 'px monospace';
  var secStrDim = ctx.measureText(secStr);
  ctx.fillText(secStr, width - WordPadding - secStrDim.width, TitleBaseline);

  ctx.font = SubtitleSize + 'px monospace';
  var humanStrDim = ctx.measureText(humanStr);
  ctx.fillText(humanStr, width - WordPadding - humanStrDim.width, SubtitleBaseline);

}, 1000 / 60);

initAll();
