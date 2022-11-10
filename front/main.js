const app = new Vue({
    el: '#app',
    data: 
    {
        title: 'BLOCK GAME',
		socket: {},
		context: {},
		board: {},
		square: {},
		position: {},
    },
    methods: 
    {
		sendInstruction(instruction)
		{
			this.socket.emit('positionToServer', instruction);
		},
    },
    created() 
    {
        this.socket = io(`http://127.0.0.1:3000`);
		
		window.addEventListener('keydown', (e) => {

			switch (e.key) {
				case "ArrowUp":
					this.sendInstruction("up");
					break;
				case "ArrowDown":
					this.sendInstruction("down");
					break;
				case "ArrowLeft":
					this.sendInstruction("left");
					break;
				case "ArrowRight":
					this.sendInstruction("right");
					break;
			}
			
		});
       
    },
	mounted() {
		this.socket.on(`gameData`, (data) => {
			this.canvas = data.canvas;
			this.square = data.square;
        });
		this.board = document.getElementById("board");
		this.context = board.getContext("2d");
		this.socket.on(`positionToClient`, (data) => {
			this.position = data;
			this.context.clearRect(0, 0, board.width, board.height);
			this.context.fillRect(this.position.x, this.position.y, this.square.width, this.square.height);
        });
	}
})
