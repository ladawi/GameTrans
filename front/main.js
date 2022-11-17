const app = new Vue({
    el: '#app',
    data() 
    {
		return {
			title: 'BLOCK GAME',
			socket: {},
			context: {},
			board: {},
			square: {},
			position: {},
			background: {},
			paddle1: {},
			paddle2: {},
			ball: {},

			then: {},
			now: {},
			elapsed: {},
			startTime: {},
			fpsInterval: {},
		}
    },
    methods: 
    {
		startAnimating(fps) {
			this.fpsInterval = 1000 / fps;
			this.then = Date.now();
			this.startTime = this.then;

			this.paddle1.updateScale();

			this.game();
		},
		game() {

			window.requestAnimationFrame(this.game);

			this.now = Date.now();
			this.elapsed = this.now - this.then;

			if (this.elapsed > this.fpsInterval) {

				// Get ready for next frame by setting this.then=this.now, but also adjust for your
				// specified this.fpsInterval not being a multiple of RAF's interval (16.7ms)
				this.then = this.now - (this.elapsed % this.fpsInterval);

				// Put your drawing code here
				this.getPaddle1();
				this.background.draw(this.context);
				this.paddle1.draw(this.context);
				this.paddle2.draw(this.context);
				this.ball.draw(this.context);
				console.log('YEP', this.fpsInterval);
			}
		},
		sendInstruction(instruction)
		{
			console.log('getPaddle1ToClient');
			this.socket.emit('positionToServer', instruction);
		},
		sendPaddle1Move(instruction)
		{
			this.socket.emit('MovePaddle1ToServer', instruction);
		},
		getPaddle1()
		{
			this.socket.emit('getPaddle1ToServer');
		},
    },
    created()
    {
        this.socket = io(`http://127.0.0.1:3000`);
		
		window.addEventListener('keydown', (e) => {

			switch (e.key) {
				case "w":
					this.sendPaddle1Move("up");
					break;
				case "s":
					this.sendPaddle1Move("down");
					break;
				case "ArrowLeft":
					this.sendInstruction("left");
					break;
				case "ArrowRight":
					this.sendInstruction("right");
					break;
				case " ":
						console.log(this.paddle1.position.x);
						console.log(this.paddle1.position.y);
						this.paddle1.updateScale();
					break;
			}
			
		});
	},
	mounted() {
		this.socket.on(`gameData`, (data) => {
			this.canvas = data.canvas;
		});
		this.board = document.getElementById("board");
		this.context = board.getContext("2d");
		this.socket.on(`paddle1ToClient`, (data) => {
			console.log('check');
		});
		this.socket.on(`getPaddle1ToClient`, (data) => {

			this.paddle1.position = data.paddle1.position;
			this.paddle1.velocity = data.paddle1.velocity;
			this.paddle1.width = data.paddle1.width;
			this.paddle1.height = data.paddle1.height;
			this.paddle1.speed = data.paddle1.speed;
			this.paddle1.updateScale();

//			 ------------------

			this.paddle2.position = data.paddle2.position;
			this.paddle2.velocity = data.paddle2.velocity;
			this.paddle2.width = data.paddle2.width;
			this.paddle2.height = data.paddle2.height;
			this.paddle2.speed = data.paddle2.speed;
			this.paddle2.updateScale();

		});


		this.background = new Sprite({
			position: {
			  x: 0,
			  y: 0,
			},
			imageSrc: "./assets/SpaceBackground.png",
			width: this.board.width,
			height: this.board.height,
		});

		this.paddle1 = new paddle({
			position: {
				x: 0,
				y: 0,
			},
			velocity: {
				x: 0,
				y: 0,
			},
			// width: parseInt(this.board.width / 34, 10),
			// height: parseInt(this.board.height / 3.5, 10),

			width: 123,
			height:345,
			imageSrc: "./assets/Paddle1.png",
			GoalSoundSrc: "./assets/Siuu.mp3",
			GoalAnimSrc: "./assets/nyancat-removebg-preview.png",
			GoalAnimFrame: 9,
			canvas : this.board
		});

		this.paddle2 = new paddle({
			position: {
				x: this.board.width - parseInt(this.board.width / 34, 10),
				y: 0,
			},
			velocity: {
				x: 0,
				y: 0,
			},
			width: parseInt(this.board.width / 34, 10),
			height: parseInt(this.board.height / 3.5, 10),
			imageSrc: "/assets//Paddle2.png",
			GoalSoundSrc: "/assets//Marex.wav",
			GoalAnimSrc: "/assets//horny-jail-bonk.png",
			GoalAnimFrame: 6,
			canvas : this.board
		});
		
		this.ball = new ball({
			position: {
			  x: (this.board.width - parseInt(this.board.height / 19.2, 10)) / 2,
			  y: (this.board.height - parseInt(this.board.height / 19.2, 10)) / 2,
			},
			velocity: {
			  x: 0,
			  y: 0,
			},
			coord: {
			  top: 0,
			  left: 0,
			  right: 0,
			  bottom: 0,
			},
			width: parseInt(this.board.height / 19.2, 10),
			height: parseInt(this.board.height / 19.2, 10),
			imageSrc: "./assets/Balls.png",
			speed: 4,
			framesMax: 10,
		  });


		this.startAnimating(30);
	},
})
