const app = new Vue({
  el: '#app',
  data() {
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
      score1: {},
      score2: {},

      then: {},
      now: {},
      elapsed: {},
      startTime: {},
      fpsInterval: {},

      gameCodeDisplay: {},
      gameScreen: {},
      initialScreen: {},
      newGameBtn: {},
      joinGameBtn: {},
      returnGameBtn: {},
    };
  },
  methods: {
    newGame() {
      console.log('NIK');
      this.socket.emit('newGame');
      this.startAnimating(30);
    },
    joinGame() {
      console.log('PLOP');
      this.socket.emit('joinGame');
      this.startAnimating(60);
    },
    reset() {
      this.initialScreen.style.display = 'block';
      this.gameScreen.style.display = 'none';
    },
    startAnimating(fps) {
      this.initialScreen.style.display = 'none';
      this.gameScreen.style.display = 'block';

      this.fpsInterval = 1000 / fps;
      this.then = Date.now();
      this.startTime = this.then;

      this.getSizeToServe();
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
        // this.getInfo();
        this.context.clearRect(0, 0, board.width, board.height);
        this.background.draw(this.context);
        this.ball.update(this.context);
        this.paddle1.draw(this.context);
        this.paddle2.draw(this.context);
      }
    },
    sendInstruction(instruction) {
      console.log('getInfoToClient');
      this.socket.emit('positionToServer', instruction);
    },
    sendPaddle1Move(instruction) {
      this.socket.emit('MovePaddle1ToServer', instruction);
    },
    sendPaddle2Move(instruction) {
      this.socket.emit('MovePaddle2ToServer', instruction);
    },
    getInfo() {
      this.socket.emit('getInfoToServer');
    },
    getSizeToServe() {
      this.socket.emit('getSizeToServer');
    },
  },
  created() {
    this.socket = io(`http://127.0.0.1:3000`);

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.sendPaddle1Move('up');
          break;
        case 'ArrowDown':
          this.sendPaddle1Move('down');
          break;
        case 'e':
          this.sendPaddle2Move('up');
          break;
        case 'd':
          this.sendPaddle2Move('down');
          break;
        case ' ':
          console.log('this.ball.position.x', this.ball.position.x);
          console.log('this.ball.position.y', this.ball.position.y);
          this.paddle1.updateScale();
          break;
      }
    });
  },
  mounted() {
    this.gameScreen = document.getElementById('gameScreen');
    this.initialScreen = document.getElementById('initialScreen');
    this.newGameBtn = document.getElementById('newGameBtn');
    this.joinGameBtn = document.getElementById('joinGameBtn');
    this.gameCodeDisplay = document.getElementById('gameCodeDisplay');
    this.returnGameBtn = document.getElementById('returnGameBtn');

    this.newGameBtn.addEventListener('click', this.newGame);
    this.joinGameBtn.addEventListener('click', this.joinGame);
    this.returnGameBtn.addEventListener('click', this.reset);
    // ----------------------------------------------

    this.socket.on(`gameData`, (data) => {
      this.canvas = data.canvas;
    });
    this.socket.on('gameCode', (gameCode) => {
      this.gameCodeDisplay.innerText = gameCode;
    });

    this.score1 = document.getElementById('score_1');
    this.score2 = document.getElementById('score_2');
    this.score2 = document.getElementById('score_2');

    this.board = document.getElementById('board');
    var heightRatio = 0.75;
    this.board.height = this.board.width * heightRatio;
    this.context = board.getContext('2d');
    this.socket.on(`paddle1ToClient`, (data) => {
      console.log('check');
    });
    this.socket.on(`getInfoToClient`, (data) => {
      console.log('e');
      this.paddle1.position = data.paddle1.position;

      //			 ------------------

      this.paddle2.position = data.paddle2.position;

      //			 ------------------

      this.ball.position = data.ball.position;
    });

    this.socket.on(`gameState`, (data) => {
      this.paddle1.position = data.paddle1.position;
      this.paddle2.position = data.paddle2.position;
      this.ball.position = data.ball.position;
      this.score1.innerText = data.score.player1;
      this.score2.innerText = data.score.player2;
    });

    this.socket.on('gameOver', (data) => {
      this.returnGameBtn.style.display = 'block';
      // this.reset();
      // alert('you loose ?');
    });

    this.socket.on('getSizeToClient', (data) => {
      this.paddle1.width = data.paddle1.width;
      this.paddle1.height = data.paddle1.height;

      this.paddle1.updateScale();

      this.paddle2.width = data.paddle2.width;
      this.paddle2.height = data.paddle2.height;

      this.paddle2.updateScale();

      this.ball.width = data.ball.width;
      this.ball.height = data.ball.height;

      this.ball.updateScale();
    });

    this.background = new Sprite({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: './assets/SpaceBackground.png',
      width: this.board.width,
      height: this.board.height,
      ctx: this.context,
    });

    this.paddle1 = new paddle({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: './assets/Paddle1.png',
      canvas: this.board,
    });

    this.paddle2 = new paddle({
      position: {
        x: this.board.width - parseInt(this.board.width / 34, 10),
        y: 0,
      },
      imageSrc: '/assets//Paddle2.png',
      canvas: this.board,
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
      imageSrc: './assets/Balls.png',
      speed: 4,
      framesMax: 10,
    });
  },
});
