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
		})
		
	}

	movementPaddle1(paddle: paddle, instruction: string) {
		switch (instruction) {
			case "up":
    		console.log("issoi");
			this.game_data.paddle1.velocity.y = -10;
			this.game_data.paddle1.move();
					break;
			case "down":
    			console.log("issoi2");
				this.game_data.paddle1.velocity.y = 10;
				this.game_data.paddle1.move();
					break;
		}
	}

}
