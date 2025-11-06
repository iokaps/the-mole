import { config } from '@/config';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const VotingView: React.FC = () => {
	const { players, votes } = useSnapshot(globalStore.proxy);
	const { hasVoted } = useSnapshot(playerStore.proxy);
	const onlineClientIds = useSnapshot(globalStore.connections).clientIds;

	const myVote = votes[kmClient.id];
	const votedPlayerName = myVote ? players[myVote]?.name : '';

	const handleVote = async (votedClientId: string) => {
		if (hasVoted || votedClientId === kmClient.id) return;

		await globalActions.submitVote(kmClient.id, votedClientId);
		await playerActions.setHasVoted(true);
	};

	return (
		<div className="flex h-full w-full flex-col gap-6 p-8">
			<div className="text-center">
				<h1 className="mb-2 text-3xl font-bold">{config.votingTitle}</h1>
				<p className="text-lg text-gray-700">{config.votingDescription}</p>
			</div>

			{hasVoted ? (
				<div className="text-center">
					<p className="mb-4 text-xl font-semibold text-green-600">
						{config.hasVoted.replace('{name}', votedPlayerName)}
					</p>
					<p className="text-gray-600">{config.votingWaiting}</p>
				</div>
			) : (
				<div className="mx-auto w-full max-w-md">
					<div className="space-y-3">
						{Object.entries(players)
							.filter(([clientId]) => clientId !== kmClient.id) // Can't vote for self
							.map(([clientId, player]) => {
								const isOnline = onlineClientIds.has(clientId);
								return (
									<button
										key={clientId}
										onClick={() => handleVote(clientId)}
										disabled={!isOnline}
										className={`w-full rounded-lg border p-4 text-left font-semibold transition-all ${
											isOnline
												? 'bg-white hover:border-blue-500 hover:bg-blue-50'
												: 'cursor-not-allowed bg-gray-100 opacity-50'
										}`}
									>
										{player.name}
										{!isOnline && (
											<span className="ml-2 text-xs text-gray-500">
												(offline)
											</span>
										)}
									</button>
								);
							})}
					</div>
				</div>
			)}
		</div>
	);
};
