import { ConsoleLogger, Injectable } from '@nestjs/common';

import { Position, Dimension } from './game_interface';

import { Sprite, paddle, ball } from './gameClass';

@Injectable()
export class GameService 
{
	game_data =
	{
		gameState: 'off',
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
			speed: 0,
			canvasDim: {
				width: 640,
				height: 480
			}
		}),
	}

	movementPaddle1(paddle: paddle, instruction: string) {
		switch (instruction) {
			case "up":
			this.game_data.paddle1.velocity.y = -10;
			// this.game_data.paddle1.move();
					break;
			case "down":
				this.game_data.paddle1.velocity.y = 10;
				// this.game_data.paddle1.move();
					break;
		}
	}

	gameLoop(state) {
		// console.log(this.game_data.ball.position);
		this.game_data.paddle1.update();
		this.game_data.paddle2.update();
		this.game_data.ball.update(this.game_data.paddle1, this.game_data.paddle2);
	}
}
