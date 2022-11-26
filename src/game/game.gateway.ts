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
	implements OnGatewayInit, OnGatewayConnection 
{
	constructor(private gameService: GameService) {}
	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway');

	state = {};
	clientRooms = {};
	io = require('socket.io')();
	// -----------

	@SubscribeMessage('MovePaddle1ToServer')
	async handlePaddle1(client: Socket, instruction : string): Promise<void>
	{
		if (this.state[this.clientRooms[client.id]]){
			this.state[this.clientRooms[client.id]].movementPaddle(this.state[this.clientRooms[client.id]].game_data.paddle1, instruction);
			this.server.emit(`paddle1ToClient`, this.state[this.clientRooms[client.id]].game_data);
		}
	}

	@SubscribeMessage('MovePaddle2ToServer')
	async handlePaddle2(client: Socket, instruction : string): Promise<void>
	{
		if (this.state[this.clientRooms[client.id]]){
			this.state[this.clientRooms[client.id]].movementPaddle(this.state[this.clientRooms[client.id]].game_data.paddle2, instruction);
			this.server.emit(`paddle2ToClient`, this.state[this.clientRooms[client.id]].game_data);
		}
	}

	@SubscribeMessage('getInfoToServer')
	async GetInfos(client: Socket): Promise<void>
	{
		if (this.state[this.clientRooms[client.id]]) {
			console.log(client.id , this.state[this.clientRooms[client.id]].game_data.paddle1.position);
			this.server.emit(`getInfoToClient`, this.state[this.clientRooms[client.id]].game_data);
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

		client.join(roomName);
		console.log('client.rooms.size', client.rooms);
		client.emit('init', 1);
		setTimeout(() => {
			this.startGameInterval(client, this.state[roomName]);
		}, 500);
	}

	@SubscribeMessage('getSizeToServer')
	async GetSize(client: Socket): Promise<void>
	{
		if (this.state[this.clientRooms[client.id]]) {
			this.server.emit(`getSizeToClient`, this.state[this.clientRooms[client.id]].game_data);
		console.log(this.clientRooms[client.id])
		}
	}

	@SubscribeMessage('joinGame')
	async handleJoinGame(client: Socket, gameCode: string): Promise<void>
	{
		console.log('handleJoinGame', client.rooms.size);
		// const room = io.sockets.adapter.room[gameCode];
		// console.log("-------------> ");

		// let allUsers;
		// if (room) {
		// 	allUsers = room.sockets;
		// }

		// let numClients = 0;
		// if (allUsers) {
		// 	numClients = Object.keys(allUsers).length;
		// }

		// if (numClients === 0) {
		// 	client.emit('unknownGame'); 
		// 	return;
		// } else if (numClients > 1) {
		// 	client.emit('tooManyPlayers');
		// 	return;
		// }
		// this.clientRooms[client.id] = gameCode;
		client.emit('gameCode', gameCode);

		client.join(gameCode);
		// client.emit('init', 1);
		// client.emit('init', 2);
		// this.startGameInterval(client, this.gameService);
	}

	handleConnection(client: Socket, ...args: any[])
	{
		this.server.emit(`gameData`, this.gameService.game_data);
		this.server.emit(`positionToClient`, this.gameService.game_data);
		// this.startGameInterval(client, this.gameService);
	}

	afterInit(server: Server)
	{
	}

	startGameInterval(client, state) {
		const intervalID = setInterval(() => {
			const winner = state.gameLoop(state);
		if (!winner) {
			client.emit('gameState', state.game_data);
		}
		else
		{
			client.emit('gameOver');
			clearInterval(intervalID);
			// console.log("client.emit('gameOver')");
		}
	}, 1000 / 60);
	}

	
}
