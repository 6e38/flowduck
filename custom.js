// /\//\+/-//\/\/

var custom = {
  init: function(message, messageSize) {
    this.Message = message;
    this.MessageSize = messageSize;
    this.MessageOffset = 50;
    return this;
  },

  draw: function(ctx, duck) {
    ctx.fillStyle = duck.color;
    ctx.font = this.MessageSize + 'px monospace';
    ctx.fillText(this.Message, duck.x + this.MessageOffset, duck.y + duck.bob - this.MessageOffset);

    ctx.strokeStyle = duck.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(duck.x - 3, duck.y + duck.bob + 3);
    ctx.lineTo(duck.x + (this.MessageOffset - 5), duck.y + duck.bob - (this.MessageOffset - 5));
    ctx.stroke();
  },

  measure: function(ctx, duck) {
    ctx.font = this.MessageSize + 'px monospace';
    return ctx.measureText(this.Message).width + this.MessageOffset;
  },
};
