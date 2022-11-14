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
    velocity,
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
    console.log("QWEQWE" , this.canvasDim);
    console.log("height :" , this.height, "| width :", this.width);
    console.log("position" , this.position);
    if (
      !(this.position.y + this.velocity.y + this.height > this.canvasDim.height) &&
      this.position.y + this.velocity.y >= 0
    )
      this.position.y += this.velocity.y;

    this.velocity.y = 0;
  }
  } 
