import { Injectable } from '@nestjs/common';

import { Position, Dimension } from './game_interface';

import { Sprite, paddle } from './gameClass';

@Injectable()
export class GameService 
{
	game_data =
	{
		canvas:
		{
			width: 640,
			height: 480
		},
		paddle1 : new paddle({
			position: {
				x: 20,
				y: 200,
			},
			velocity: {
				x: 0,
				y: 0,
			},
			width: 30,
			height: 80,
			canvasDim: {
				width: 640,
				height: 480
			}
		})
	}

	movementPaddle1(paddle: paddle, instruction: string) {
		switch (instruction) {
			case "up":
    		console.log("issoi");
			this.game_data.paddle1.velocity.y = -5;
			this.game_data.paddle1.move();
					break;
			case "down":
    			console.log("issoi2");
				this.game_data.paddle1.velocity.y = 5;
				this.game_data.paddle1.move();
					break;
		}
	}

}
