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
import { makeid } from './utils';
import { Sprite } from './gameClass';
import { fips } from 'crypto';
import { IoAdapter } from '@nestjs/platform-socket.io';

@WebSocketGateway({
	cors: {
	  origin: '*',
	},
  })

@WebSocketGateway()
export class GameGateway 
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private gameService: GameService) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway');

	state = {};
	clientRooms = {};
	openRooms: string[] = [];
	io = require('socket.io')();
	// -----------

	@SubscribeMessage('MovePaddleToServer')
	async handlePaddle(client: Socket, instruction : string): Promise<void>
	{
		if (this.state[this.clientRooms[client.id]]) {
			if (client.id === this.state[this.clientRooms[client.id]].game_data.idPlayers.player1) {
				if (this.state[this.clientRooms[client.id]]){
					this.state[this.clientRooms[client.id]].movementPaddle(this.state[this.clientRooms[client.id]].game_data.paddle1, instruction);
					this.server.to(this.clientRooms[client.id]).emit(`paddle1ToClient`, this.state[this.clientRooms[client.id]].game_data);
				}
			} else if (client.id === this.state[this.clientRooms[client.id]].game_data.idPlayers.player2) {
				if (this.state[this.clientRooms[client.id]]){
					this.state[this.clientRooms[client.id]].movementPaddle(this.state[this.clientRooms[client.id]].game_data.paddle2, instruction);
					this.server.to(this.clientRooms[client.id]).emit(`paddle2ToClient`, this.state[this.clientRooms[client.id]].game_data);
				}
			}
		}
	}

	@SubscribeMessage('getInfoToServer')
	async GetInfos(client: Socket): Promise<void>
	{
		if (this.state[this.clientRooms[client.id]]) {
		console.log(client.id , this.state[this.clientRooms[client.id]].game_data.paddle1.position);
			this.server.to(this.clientRooms[client.id]).emit(`getInfoToClient`, this.state[this.clientRooms[client.id]].game_data);
		}
	}

	@SubscribeMessage('getSizeToServer')
	async GetSize(client: Socket): Promise<void>
	{
		if (this.state[this.clientRooms[client.id]]) {
			this.server.to(this.clientRooms[client.id]).emit(`getSizeToClient`, this.state[this.clientRooms[client.id]].game_data);
			console.log(this.clientRooms[client.id])
		}
	}

	@SubscribeMessage('newGame')
	async handleNewGame(client: Socket): Promise<void>
	{
		console.log('handleNewGame');
		let roomName = makeid(5);
		this.clientRooms[client.id] = roomName;
		client.emit('gameCode', roomName);

		this.state[roomName] = new GameService;

		this.state[roomName].game_data.idPlayers.player1 = client.id;
		client.join(roomName);
		console.log('client.rooms.size', client.rooms);
		client.emit('init', 1);
		this.openRooms.push(roomName);
		console.log(this.openRooms);
	}

	@SubscribeMessage('specGame')
	async handleSpecGame(client: Socket, gameCode: string): Promise<void>
	{
		// console.log("gameCode", gameCode);
		if (!this.state[gameCode]) {
			client.emit('unknownGame');
			return;
		}
		this.clientRooms[client.id] = gameCode;
		client.join(gameCode);
		client.emit('gameCode', gameCode);
		client.emit('init', 1);
	}

	@SubscribeMessage('findGame')
	async handleFindGame(client: Socket): Promise<void>
	{
		let gameCode = "";
		console.log(this.openRooms);
		if (!this.openRooms.length) {
			console.log("void", this.openRooms.length);
			this.handleNewGame(client);
			return;
		}
		if (!this.openRooms[0]) {
			client.emit("errFindGame");
			return;
		}
		gameCode = this.openRooms[0];
		this.clientRooms[client.id] = gameCode;
		client.join(gameCode);
		this.state[gameCode].game_data.idPlayers.player2 = client.id;
		client.emit('gameCode', gameCode);
		client.emit('init', 2);
		this.openRooms.shift();
		setTimeout(() => {
			this.startGameInterval(client, this.state[gameCode], gameCode);
		}, 500);
	}

	@SubscribeMessage('leaveGame')
	async handleLeaveGame(client: Socket): Promise<void>
	{
		console.log("leaved game : ", client.id);
		if (this.state[this.clientRooms[client.id]]) {
			if (this.state[this.clientRooms[client.id]].game_data.idPlayers.player1 === client.id)
			this.state[this.clientRooms[client.id]].game_data.idPlayers.player1 = 0;
			else if (this.state[this.clientRooms[client.id]].game_data.idPlayers.player1 === client.id)
			this.state[this.clientRooms[client.id]].game_data.idPlayers.player2 = 0;
		 }
		 var I = this.openRooms.indexOf(this.clientRooms[client.id]);
		if ( I != -1) {
			this.openRooms.splice(I, 1);
		}
		this.clientRooms[client.id] = null;
	}

	handleConnection(client: Socket, ...args: any[])
	{
		this.server.emit(`gameData`, this.gameService.game_data);
		this.server.emit(`positionToClient`, this.gameService.game_data);
	}

	handleDisconnect(client: Socket, ...args: any[])
	{
		console.log("A client DC", client.id);
		if (this.state[this.clientRooms[client.id]]) {
		 if (this.state[this.clientRooms[client.id]].game_data.idPlayers.player1 === client.id)
		 this.state[this.clientRooms[client.id]].game_data.idPlayers.player1 = 0;
		 else if (this.state[this.clientRooms[client.id]].game_data.idPlayers.player1 === client.id)
		 this.state[this.clientRooms[client.id]].game_data.idPlayers.player2 = 0;
		}
		var I = this.openRooms.indexOf(this.clientRooms[client.id]);
		if ( I != -1) {
			this.openRooms.splice(I, 1);
		}
		this.clientRooms[client.id] = null;
		// this.server.emit(`gameData`, this.gameService.game_data);
		// this.server.emit(`positionToClient`, this.gameService.game_data);
	}

	afterInit(server: Server)
	{
	}

	startGameInterval(client, state, gameCode) {
		const intervalID = setInterval(() => {
			const winner = state.gameLoop(state);
		if (!winner) {
			this.server.to(this.clientRooms[client.id]).emit('gameState', state.game_data);
		}
		else
		{
			console.log('gameOver 2');
			client.emit('gameOver');
			clearInterval(intervalID);
			this.state[gameCode] = null;
			delete this.state[gameCode];
		}
	}, 1000 / 60);
	}

	
}
