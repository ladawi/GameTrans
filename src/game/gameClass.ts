export class Sprite {
	public width: any;
	public height: any;
	public position: any;
	public coord: any;
	public display: any;
	public canvasDim: any;

  constructor({
    position,
    height,
    width,
    coord = { top: 0, left: 0, right: 0, bottom: 0, center: { x: 0, y: 0 } },
    display = true,
    canvasDim = {width: 0, height: 0},
  }) {
    this.width = width;
    this.height = height;
    this.canvasDim = canvasDim;
    this.position = position;
    this.coord = coord;
    this.display = display;
    this.coord.top = this.position.y;
    this.coord.right = this.position.x + this.width;
    this.coord.bottom = this.position.y + this.height;
    this.coord.left = this.position.x;
    this.coord.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
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
}

export class paddle extends Sprite {
	public velocity: any;
	public speed: any;

  constructor({
    position,
    velocity  = { x: 0, y: 0 },
    canvasDim,
    speed = 9,
    height,
    width,
  }) {
    super({
      position,
      height,
      width,
      canvasDim,
    });
    this.velocity = velocity;
    this.speed = speed;
  }
  update() {
    // movement paddle
    if (
      !(this.position.y + this.velocity.y + this.height > this.canvasDim.height) &&
      this.position.y + this.velocity.y >= 0
    )
      this.position.y += this.velocity.y;

    this.velocity.y = 0;
  }
  reset() {
    this.speed = 9;
  }
  move() {
    // console.log("QWEQWE" , this.canvasDim);
    // console.log("height :" , this.height, "| width :", this.width);
    // console.log("position" , this.position);
    if (
      !(this.position.y + this.velocity.y + this.height > this.canvasDim.height) &&
      this.position.y + this.velocity.y >= 0
    )
      this.position.y += this.velocity.y;

    // this.velocity.y = 0;
  }
}


export class ball extends Sprite {
	public width: any;
	public height: any;
	public velocity: any;
	public radius: any;
	public speed: any;
	public position: any;
	public draw: any;

	constructor({
	  position,
	  velocity,
	  width,
	  height,
	  speed,
	  canvasDim,
	}) {
	  super({
		position,
		width,
		height,
		canvasDim,
	  });
	  this.width = width;
	  this.height = height;
	  this.velocity = velocity;
	  this.radius = this.height / 2;
	  this.speed = speed;
	}
  
	collision(paddle) {
	//   console.log(this.coord, "this.coord");
	//   console.log(paddle.coord, "paddle.coord");
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
	  this.position.x = (this.canvasDim.width - 40) / 2;
	  this.position.y = (this.canvasDim.height - 40) / 2;
	  this.speed = 5;
	  this.velocity.y = 0;
	}
  
	update(paddle1, paddle2) {
	  // this.draw(ctx);
	//   if (this.velocity.x !== 0 || this.velocity.y !== 0) this.animateFrames();
	  this.position.x += this.velocity.x;
	  this.position.y += this.velocity.y;
	  if (
		this.position.y + this.height > this.canvasDim.height ||
		this.position.y < 0
	  ) {
		this.velocity.y = -this.velocity.y;
	  }
  
	  let paddle =
		this.position.x < (this.canvasDim.width / 2) ? paddle1 : paddle2;
  
		// console.log(this.canvasDim.width, "paddle pos");
	  if (this.collision(paddle)) {
		let collidePoint =
		  (this.coord.center.y - paddle.coord.center.y) / (paddle.height / 2);
		let angleRad = (Math.PI / 8) * collidePoint;
  
		let direction = this.coord.center.x < (this.canvasDim.width / 2) ? 1 : -1;
  
		this.velocity.x = this.speed * Math.cos(angleRad) * direction;
		this.velocity.y = this.speed * Math.sin(angleRad);
  
		this.speed += 0.1;
	  }
	  // IF GOAL -->
	  if (this.coord.left <= 0) {

		this.velocity.x = 0;
		this.velocity.y = 0;

		this.reset();

		setTimeout(() => {
			this.velocity.x = -5;
		}, 3000);

		// console.log("j1 g");
		return (1);
	  } else if (this.coord.right >= this.canvasDim.width) {

			this.velocity.x = 0;
			this.velocity.y = 0;
	
			this.reset();
	
			setTimeout(() => {
				this.velocity.x = 5;
			}, 3000);
			this.reset();
		// console.log("j2 g");
		return (2);

	  }
		return (0);

	}
  }