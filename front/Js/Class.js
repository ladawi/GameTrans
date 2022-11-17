class Sprite {
	constructor({
	  position,
	  imageSrc,
	  scale = { x: 1, y: 1 },
	  framesMax = 1,
	  offset = { x: 0, y: 0 },
	  height,
	  width,
	  coord = { top: 0, left: 0, right: 0, bottom: 0, center: { x: 0, y: 0 } },
	  display = true,
	}) {
	  this.width = width;
	  this.height = height;
	  this.position = position;
	  this.image = new Image();
	  this.image.src = imageSrc;
	  this.scale = scale;
	  this.framesMax = framesMax;
	  this.framesCurrent = 0;
	  this.framesElapsed = 0;
	  this.framesHold = 5;
	  this.offset = offset;
	  this.coord = coord;
	  this.display = display;
	  if (!this.width) this.width = this.image.width * scale.x;
	  else scale.x = (this.width / this.image.width) * framesMax;
	  if (!this.height) this.height = this.image.height * scale.y;
	  else scale.y = this.height / this.image.height;
	  this.coord.top = this.position.y;
	  this.coord.right = this.position.x + this.width;
	  this.coord.bottom = this.position.y + this.height;
	  this.coord.left = this.position.x;
	  this.coord.center = {
		x: this.position.x + this.width / 2,
		y: this.position.y + this.height / 2,
	  };
	}
  
	draw(ctx) {
	  ctx.drawImage(
		this.image,
		this.framesCurrent * (this.image.width / this.framesMax),
		0,
		this.image.width / this.framesMax,
		this.image.height,
		this.position.x - this.offset.x,
		this.position.y - this.offset.y,
		(this.image.width / this.framesMax) * this.scale.x,
		this.image.height * this.scale.y
	  );
	}
  
	animateFrames() {
	  this.framesElapsed++;
  
	  if (this.framesElapsed % this.framesHold === 0) {
		if (this.framesCurrent < this.framesMax - 1) {
		  this.framesCurrent++;
		} else {
		  this.framesCurrent = 0;
		}
	  }
	}
  
	getCoord() {
	  this.coord.top = this.position.y;
	  this.coord.right = this.position.x + this.width;
	  this.coord.bottom = this.position.y + this.height;
	  this.coord.left = this.position.x;
	  this.coord.center = {
		x: this.position.x + this.width / 2,
		y: this.position.y + this.height / 2,
	  };
	}
  
	update(ctx) {
	  // this.getCoord(); maybe i need this
	  this.draw(ctx);
	  this.animateFrames();
	}

	updateScale() {
		this.scale.x = (this.width / this.image.width) * this.framesMax;
		this.scale.y = this.height / this.image.height;
	}
  }

class paddle extends Sprite {
	constructor({
	position,
	velocity = { x: 0, y: 0 },
	imageSrc,
	GoalSoundSrc,
	scale = { x: 1, y: 1 },
	framesMax = 1,
	offset = { x: 0, y: 0 },
	speed = 9,
	GoalAnimSrc,
	GoalAnimFrame,
	height = 0,
	width = 0,
	canvas,
	}) {
	super({
		position,
		imageSrc,
		scale,
		framesMax,
		offset,
		height,
		width,
	});
	this.velocity = velocity;
	this.framesCurrent = 0;
	this.framesElapsed = 0;
	this.framesHold = 5;
	this.speed = speed;
	this.GoalSound = new Audio();
	this.GoalSound.volume = 0.1;
	this.GoalSound.src = GoalSoundSrc;
	this.GoalAnimSrc = GoalAnimSrc;
	this.GoalAnim = new Sprite({
		position: {
		x: 0,
		y: 0,
		},
		imageSrc: GoalAnimSrc,
		height: canvas.height,
		framesMax: GoalAnimFrame,
		width: canvas.width,
		display: false,
	});
	// this.GoalAnim.imageSrc = GoalAnimSrc;
	}
	update(ctx, canvas) {
	this.draw(ctx);
	// movement paddle
	if (
		!(this.position.y + this.velocity.y + this.height > canvas.height) &&
		this.position.y + this.velocity.y >= 0
	)
		this.position.y += this.velocity.y;

	this.velocity.y = 0;
	}
	reset() {
		this.speed = 9;
	}
}

class ball extends Sprite {
	constructor({
	  position,
	  velocity,
	  imageSrc,
	  scale = { x: 1, y: 1 },
	  framesMax = 1,
	  offset = { x: 0, y: 0 },
	  width,
	  height,
	  speed,
	}) {
	  super({
		position,
		imageSrc,
		scale,
		framesMax,
		offset,
		width,
		height,
	  });
	  this.width = width;
	  this.height = height;
	  this.velocity = velocity;
	  this.framesCurrent = 0;
	  this.framesElapsed = 0;
	  this.framesHold = 5;
	  this.radius = this.height / 2;
	  this.speed = speed;
	}
  
	collision(paddle) {
	  this.getCoord();
	  paddle.getCoord();
	  return (
		this.coord.right > paddle.coord.left &&
		this.coord.top < paddle.coord.bottom &&
		this.coord.left < paddle.coord.right &&
		this.coord.bottom > paddle.coord.top
	  );
	}
	reset() {
	  this.position.x = (canvas.width - 40) / 2;
	  this.position.y = (canvas.height - 40) / 2;
	  this.speed = 5;
	  this.velocity.y = 0;
	}
  
	update(paddle1, paddle2, ctx) {
	  this.draw(ctx);
	  if (this.velocity.x !== 0 || this.velocity.y !== 0) this.animateFrames();
	  this.position.x += this.velocity.x;
	  this.position.y += this.velocity.y;
	  if (
		this.position.y + this.height > background.coord.bottom ||
		this.position.y < 0
	  ) {
		this.velocity.y = -this.velocity.y;
	  }
  
	  let paddle =
		this.coord.center.x < background.coord.center.x ? paddle1 : paddle2;
  
	  if (this.collision(paddle)) {
		let collidePoint =
		  (this.coord.center.y - paddle.coord.center.y) / (paddle.height / 2);
		let angleRad = (Math.PI / 8) * collidePoint;
  
		let direction = this.coord.center.x < background.coord.center.x ? 1 : -1;
  
		this.velocity.x = this.speed * Math.cos(angleRad) * direction;
		this.velocity.y = this.speed * Math.sin(angleRad);
  
		this.speed += 0.5;
		paddle1.speed += 0.25;
		paddle2.speed += 0.25;
	  }
	  if (ballon.coord.left <= background.coord.left) {
		if (gameState === "On") {
		  score_2++;
		  document.querySelector("#score_2").innerHTML = score_2;
		  Goal(this, paddle2, paddle1);
		}
	  } else if (ballon.coord.right >= background.coord.right) {
		if (gameState === "On") {
		  score_1++;
		  document.querySelector("#score_1").innerHTML = score_1;
		  Goal(this, paddle1, paddle2);
		}
	  }
	}
  }