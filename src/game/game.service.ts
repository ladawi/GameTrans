import { ConsoleLogger, Injectable } from '@nestjs/common';

import { Position, Dimension } from './game_interface';

import { Sprite, paddle, ball } from './gameClass';

@Injectable()
export class GameService 
{
	game_data =
	{
		gameState: 'off',
		score:
		{
			player1: 0,
			player2: 0,
		},
		idPlayers:
		{
			player1: 0,
			player2: 0,
		},
		canvas:
		{
			width: 640,
			height: 480
		},
		paddle1 : new paddle({
			width: 30,
			height: 160,
			position: {
				x: 10,
				y: 200,
			},
			canvasDim: {
				width: 640,
				height: 480
			}
		}),
		paddle2 : new paddle({
			width: 30,
			height: 160,
			position: {
				x: 640 - 40,
				y: 200,
			},
			canvasDim: {
				width: 640,
				height: 480
			}
		}),
		ball : new ball({
			width: 33,
			height: 33,
			position: {
				x: 640/2,
				y: 480/2
			},
			velocity: {
				x: 5,
				y: 0
			},
			speed: 3,
			canvasDim: {
				width: 640,
				height: 480
			}
		}),
	}

	movementPaddle(paddle: paddle, instruction: string) {
		switch (instruction) {
			case "up":
				paddle.velocity.y = -20;
			// this.game_data.paddle1.move();
					break;
			case "down":
				paddle.velocity.y = 20;
				// this.game_data.paddle1.move();
					break;
		}
	}


	gameLoop(state) {
		let ret;
		// console.log(this.game_data.ball.position);
		// this.game_data.paddle1.update();
		state.game_data.paddle1.update();
		state.game_data.paddle2.update();
		ret = state.game_data.ball.update(state.game_data.paddle1, state.game_data.paddle2);
		if (ret === 1){
			state.game_data.score.player1+= 1;
			ret = 0;
		} else if (ret === 2) {
			state.game_data.score.player2+= 1;
			ret = 0;
		}
		if (state.game_data.score.player1 > 2) {
			return (1);
		} else if (state.game_data.score.player2 > 2) {
			return (2);
		}
		// console.log(this.game_data.score);
	}
}
