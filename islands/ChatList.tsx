/** @jsx h */
import { useState, useEffect, useRef } from 'preact/hooks';
import { h } from 'preact';
import { tw } from '@twind';
import { Chat } from '../routes/api/ws.ts';

export default function ChatList() {
	const [chats, setChats] = useState<Chat[]>([]);
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');
	const ws = useRef<WebSocket | null>(null);

	const handleMessageSend = () => {
		ws.current?.send(
			JSON.stringify({ name: name ? name : 'Anonymous', message } as Chat)
		);
	};

	useEffect(() => {
		ws.current = new WebSocket('ws://localhost:8000/api/ws');
		ws.current.onmessage = (ev) => {
			const data = JSON.parse(ev.data);
			if (data.type === 'load-many') {
				setChats((prev) => [...prev, ...data.chats]);
				return;
			}
			if (data.type === 'load-single') {
				setChats((prev) => [...prev, data.chat]);
			}
		};
	}, []);

	return (
		<div class={tw`flex flex-col gap-3 h-full relative flex-1`}>
			<div class={tw`flex flex-col gap-2`}>
				{chats.map((e) => (
					<div class={tw`px-1 rounded bg-gray-800 min-w-[50%]`}>
						<h3 class={tw`font-bold`}>{e.name}</h3>
						<p>{e.message}</p>
					</div>
				))}
			</div>
			<div
				class={tw`flex items-center w-full bg-black gap-3 rounded-full mb-2 p-2 absolute bottom-0`}
			>
				<input
					type="text"
					value={name}
					placeholder="Name"
					class={tw`border-1 border-black p-1.5 rounded-full bg-gray-800`}
					onChange={(ev) => setName(ev.currentTarget.value)}
				/>
				<input
					type="text"
					value={message}
					class={tw`border-1 border-black flex-1 p-1.5 rounded-full bg-gray-800`}
					placeholder="Message"
					onChange={(ev) => setMessage(ev.currentTarget.value)}
				/>
				<button
					class={tw`bg-blue-500 border-0 rounded-full text-white font-bold px-3 py-1`}
					onClick={handleMessageSend}
				>
					Send
				</button>
			</div>
		</div>
	);
}
