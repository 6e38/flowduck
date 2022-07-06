// /\//\+/-//\/\/

const Message = 'It is Wednesday my dudes';
const MessageSize = 15;
const MessageOffset = 50;

function drawWednesday(ctx, duck) {
  var current = new Date();
  if (current.getDay() == 3) {
    ctx.fillStyle = duck.color;
    ctx.font = MessageSize + 'px monospace';
    ctx.fillText(Message, duck.x + MessageOffset, duck.y + duck.bob - MessageOffset);

    ctx.strokeStyle = duck.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(duck.x - 3, duck.y + duck.bob + 3);
    ctx.lineTo(duck.x + (MessageOffset - 5), duck.y + duck.bob - (MessageOffset - 5));
    ctx.stroke();
  }
}

function measureWednesday(ctx, duck) {
  ctx.font = MessageSize + 'px monospace';
  return ctx.measureText(Message).width + MessageOffset;
}
