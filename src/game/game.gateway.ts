import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';

import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { Position } from './game_interface';
import { GameService } from './game.service';

@WebSocketGateway({
	cors: {
	  origin: '*',
	},
  })

@WebSocketGateway()
export class GameGateway 
	implements OnGatewayInit, OnGatewayConnection 
{
	constructor(private gameService: GameService) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway');

	// SQUARE WS
	position: Position = 
	{
		x: this.gameService.init_position.x,
		y: this.gameService.init_position.y
	}
	
	@SubscribeMessage('positionToServer')
	async handlePosition(client: Socket, instruction : string): Promise<void>
	{
		this.position = this.gameService.setSquarePosition(this.position, instruction);
		this.server.emit(`positionToClient`, this.position);
	}

	handleConnection(client: Socket, ...args: any[])
	{
		this.server.emit(`gameData`, this.gameService.game_data);
		this.logger.log(this.gameService.game_data);
		this.server.emit(`positionToClient`, this.position);
		this.logger.log(this.position);
	}

	afterInit(server: Server)
	{
		
	}
}
