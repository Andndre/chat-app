/** @jsx h */
import { h } from 'preact';
import { tw } from '@twind';
import ChatList from '../islands/ChatList.tsx';

export default function Home() {
	return (
		<div class={tw`text-white bg-gray-900 px-2 min-h-screen `}>
			<div class={tw`container mx-auto flex flex-col min-h-screen`}>
				<h1 class={tw`font-bold text-3xl`}>Chat app</h1>
				<div class={tw`pt-2`} />
				<ChatList />
			</div>
		</div>
	);
}
