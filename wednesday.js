// /\//\+/-//\/\/

var wednesday = {
  init: function(message, messageSize) {
    this.Message = message;
    this.MessageSize = messageSize;
    this.MessageOffset = 50;
    this.CanPlay = true;
    this.PlayChance = 2000;
    return this;
  },

  draw: function(ctx, duck) {
    var current = new Date();
    if (current.getDay() == 3) {
      ctx.fillStyle = duck.color;
      ctx.font = this.MessageSize + 'px monospace';
      ctx.fillText(this.Message, duck.x + this.MessageOffset, duck.y + duck.bob - this.MessageOffset);

      ctx.strokeStyle = duck.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(duck.x - 3, duck.y + duck.bob + 3);
      ctx.lineTo(duck.x + (this.MessageOffset - 5), duck.y + duck.bob - (this.MessageOffset - 5));
      ctx.stroke();
      if (duck.special != null && this.shouldPlay() && this.canPlay()) {
        this.play(duck);
      }
    }
  },

  measure: function(ctx, duck) {
    ctx.font = this.MessageSize + 'px monospace';
    return ctx.measureText(this.Message).width + this.MessageOffset;
  },

  shouldPlay() {
    return Math.floor(Math.random() * this.PlayChance) % this.PlayChance == 0;
  },

  canPlay() {
    if (this.CanPlay) {
      this.CanPlay = false;
      return true;
    }
    return false;
  },

  play(duck) {
    var audio = new Audio('It Is Wednesday My Dudes.mp3');
    var promise = audio.play();

    if (promise !== undefined) {
      promise.then(_ => {
        // Autoplay started!
      }).catch(error => {
        //autoplay policy prevented playback... fallback to changing the message I guess.
        this.Message = 'Quack!';
      });
    }
  },
};

var wednesdayDuck = {
  init: function(duckArray, normalDuck) {
    var current = new Date();
    return current.getDay() == 3 ? duckArray[Math.floor(Math.random()*duckArray.length)] : normalDuck;
  }
};