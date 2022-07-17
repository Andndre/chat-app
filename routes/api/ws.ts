import { HandlerContext } from '$fresh/server.ts';

export type Chat = {
	name: string;
	message: string;
};

const sockets = new Map<string, WebSocket>();

const chats: Chat[] = [{ name: 'Anonymous', message: 'Hello' }];

const broadcastChat = (chat: Chat) => {
	sockets.forEach((ws, _key) => {
		ws.send(
			JSON.stringify({
				type: 'load-single',
				chat,
			})
		);
	});
};

const onConnect = (ws: WebSocket) => {
	ws.send(
		JSON.stringify({
			type: 'load-many',
			chats,
		})
	);
	console.log('new socket opened');
};

const onMessage = (e: MessageEvent, _socket: WebSocket) => {
	const data = JSON.parse(e.data) as Chat;
	chats.push(data);
	broadcastChat(data);
};

const onError = (e: Event | ErrorEvent) => {
	console.log('socket errored:', e);
};

const onClose = (uuid: string) => {
	sockets.delete(uuid);
	console.log(`socket ${uuid} closed`);
};

export const handler = (req: Request, _ctx: HandlerContext): Response => {
	let response, socket: WebSocket;
	try {
		({ response, socket } = Deno.upgradeWebSocket(req));
	} catch {
		return new Response("request isn't trying to upgrade to websocket.");
	}

	const uuid = crypto.randomUUID();

	sockets.set(uuid, socket);

	socket.onopen = () => onConnect(socket);
	socket.onmessage = (e) => onMessage(e, socket);
	socket.onerror = (e) => onError(e);
	socket.onclose = () => onClose(uuid);
	return response;
};
