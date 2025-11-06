import { config } from '@/config';
import { useServerTimer } from '@/hooks/useServerTime';
import { globalStore } from '@/state/stores/global-store';
import { KmTimeCountdown } from '@kokimoki/shared';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSnapshot } from 'valtio';

export const DiscussionView: React.FC = () => {
	const { players, phaseStartTime } = useSnapshot(globalStore.proxy);
	const onlineClientIds = useSnapshot(globalStore.connections).clientIds;
	const serverTime = useServerTimer();

	const timeRemaining = Math.max(
		0,
		config.discussionDuration - (serverTime - phaseStartTime)
	);

	return (
		<div className="flex h-full w-full flex-col gap-6 p-8">
			<div className="text-center">
				<h1 className="mb-4 text-3xl font-bold">{config.discussionTitle}</h1>
				<div className="prose prose-lg mx-auto">
					<ReactMarkdown>{config.discussionDescriptionMd}</ReactMarkdown>
				</div>
			</div>

			<div className="text-center text-lg">
				{config.timeRemaining}: <KmTimeCountdown ms={timeRemaining} />
			</div>

			<div className="mx-auto w-full max-w-md">
				<h2 className="mb-4 text-xl font-semibold">{config.players}</h2>
				<div className="space-y-2">
					{Object.entries(players).map(([clientId, player]) => {
						const isOnline = onlineClientIds.has(clientId);
						return (
							<div
								key={clientId}
								className={`rounded-lg border p-3 ${isOnline ? 'bg-white' : 'bg-gray-100 opacity-50'}`}
							>
								{player.name}
								{!isOnline && (
									<span className="ml-2 text-xs text-gray-500">(offline)</span>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
