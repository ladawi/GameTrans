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
import { Sprite } from './gameClass';

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

	@SubscribeMessage('MovePaddle1ToServer')
	async handlePaddle1(client: Socket, instruction : string): Promise<void>
	{
		console.log("handlePaddle1");
		this.gameService.movementPaddle1(this.gameService.game_data.paddle1, instruction);
		this.server.emit(`paddle1ToClient`, this.gameService.game_data);

	}

	@SubscribeMessage('getPaddle1ToServer')
	async GetPaddle1(client: Socket): Promise<void>
	{
		// console.log("getPaddle1ToServer");
		this.server.emit(`getPaddle1ToClient`, this.gameService.game_data.paddle1);

	}

	handleConnection(client: Socket, ...args: any[])
	{
		this.server.emit(`gameData`, this.gameService.game_data);
		this.logger.log(this.gameService.game_data);
		this.server.emit(`positionToClient`, this.gameService.game_data);
	}

	afterInit(server: Server)
	{
		
	}
}
