import { Injectable } from '@nestjs/common';

import { Position, Dimension } from './game_interface';

@Injectable()
export class GameService 
{
	init_position: Position = 
	{
		x: 200,
		y: 200
	}
	game_data =
	{
		step:  10,
		canvas:
		{
			width: 640,
			height: 480
		},
		square:
		{
			width: 20,
			height: 20
		}
	}
	

	setSquarePosition(position: Position , instruction: string): Position
	{
		switch (instruction) {
			case "up":
				if (position.y >  0 )
					position.y -= this.game_data.step;
				break;
			case "down":
				if (position.y + this.game_data.square.height + this.game_data.step < this.game_data.canvas.height)
					position.y += this.game_data.step;
				break;
			case "left":
				if (position.x >  0 )
					position.x -= this.game_data.step;
				break;
			case "right":
				if (position.x+ this.game_data.square.width + this.game_data.step < this.game_data.canvas.width)
					position.x += this.game_data.step;
				break;
			default:
				break;
		}
		return position;
	}

}
