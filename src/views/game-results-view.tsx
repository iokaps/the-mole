import { config } from '@/config';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSnapshot } from 'valtio';

export const GameResultsView: React.FC = () => {
	const { players, votes, moleClientId, taskResults } = useSnapshot(
		globalStore.proxy
	);

	const moleName = players[moleClientId]?.name || 'Unknown';

	// Count votes
	const voteCount: Record<string, number> = {};
	Object.values(votes).forEach((votedId) => {
		voteCount[votedId] = (voteCount[votedId] || 0) + 1;
	});

	// Find who got the most votes
	let mostVotedId = '';
	let maxVotes = 0;
	Object.entries(voteCount).forEach(([clientId, count]) => {
		if (count > maxVotes) {
			maxVotes = count;
			mostVotedId = clientId;
		}
	});

	const crewWon = mostVotedId === moleClientId;
	const tasksCompleted = taskResults.filter((r) => r.success).length;

	const handlePlayAgain = async () => {
		// Reset player state
		await playerActions.setHasVoted(false);
		await playerActions.setRole(null as any);

		// Restart game
		await globalActions.stopGame();
	};

	return (
		<div className="flex h-full w-full flex-col gap-6 p-8">
			<div className="text-center">
				<h1 className="mb-6 text-4xl font-bold">{config.resultsTitle}</h1>

				<div
					className={`mb-4 text-6xl font-bold ${crewWon ? 'text-green-600' : 'text-red-600'}`}
				>
					{crewWon ? config.crewWins : config.moleWins}
				</div>

				<div className="prose prose-lg mx-auto mb-6">
					<ReactMarkdown>
						{crewWon
							? config.crewWinsDescriptionMd
							: config.moleWinsDescriptionMd}
					</ReactMarkdown>
				</div>

				<div className="mb-8 text-xl">
					{config.theMoleWas}{' '}
					<span className="font-bold text-red-600">{moleName}</span>
				</div>

				<div className="mb-4 text-lg text-gray-700">
					{config.tasksCompleted
						.replace('{count}', tasksCompleted.toString())
						.replace('{total}', config.totalRounds.toString())}
				</div>
			</div>

			<div className="mx-auto w-full max-w-md">
				<h2 className="mb-4 text-xl font-semibold">
					{config.voteDistribution}
				</h2>
				<div className="space-y-2">
					{Object.entries(players)
						.sort(([idA], [idB]) => {
							const votesA = voteCount[idA] || 0;
							const votesB = voteCount[idB] || 0;
							return votesB - votesA;
						})
						.map(([clientId, player]) => {
							const votes = voteCount[clientId] || 0;
							const isMole = clientId === moleClientId;
							return (
								<div
									key={clientId}
									className={`flex items-center justify-between rounded-lg border p-3 ${
										isMole ? 'border-red-300 bg-red-50' : 'bg-white'
									}`}
								>
									<span className="font-semibold">
										{player.name}
										{isMole && (
											<span className="ml-2 text-red-600">({config.mole})</span>
										)}
									</span>
									<span className="text-gray-600">
										{votes} {config.votes}
									</span>
								</div>
							);
						})}
				</div>
			</div>

			{kmClient.clientContext.mode === 'host' && (
				<div className="mt-4 text-center">
					<button
						onClick={handlePlayAgain}
						className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700"
					>
						{config.playAgainButton}
					</button>
				</div>
			)}
		</div>
	);
};
