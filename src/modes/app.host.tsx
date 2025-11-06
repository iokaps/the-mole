import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
import { generateLink } from '@/kit/generate-link';
import { HostPresenterLayout } from '@/layouts/host-presenter';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { globalStore } from '@/state/stores/global-store';
import { KmQrCode } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const App: React.FC = () => {
	useGlobalController();
	const { title } = config;
	const { started, phase, players, currentRound, moleClientId } = useSnapshot(
		globalStore.proxy
	);
	const onlineClientIds = useSnapshot(globalStore.connections).clientIds;
	useDocumentTitle(title);

	if (kmClient.clientContext.mode !== 'host') {
		throw new Error('App host rendered in non-host mode');
	}

	const playerLink = generateLink(kmClient.clientContext.playerCode, {
		mode: 'player'
	});

	const presenterLink = generateLink(kmClient.clientContext.presenterCode, {
		mode: 'presenter',
		playerCode: kmClient.clientContext.playerCode
	});

	const playerCount = Object.keys(players).length;
	const canStart = playerCount >= config.minPlayers;

	return (
		<HostPresenterLayout.Root>
			<HostPresenterLayout.Header>
				<div className="text-sm opacity-70">{config.hostLabel}</div>
			</HostPresenterLayout.Header>

			<HostPresenterLayout.Main>
				<div className="rounded-lg border border-gray-200 bg-white shadow-md">
					<div className="flex flex-col gap-2 p-6">
						<h2 className="text-xl font-bold">{config.gameLinksTitle}</h2>
						<KmQrCode data={playerLink} size={200} interactive={false} />
						<div className="flex gap-2">
							<a
								href={playerLink}
								target="_blank"
								rel="noreferrer"
								className="break-all text-blue-600 underline hover:text-blue-700"
							>
								{config.playerLinkLabel}
							</a>
							|
							<a
								href={presenterLink}
								target="_blank"
								rel="noreferrer"
								className="break-all text-blue-600 underline hover:text-blue-700"
							>
								{config.presenterLinkLabel}
							</a>
						</div>
					</div>
				</div>

				{/* Game Controls */}
				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
					<h2 className="mb-4 text-xl font-bold">Game Controls</h2>

					<div className="mb-4">
						<div className="text-sm text-gray-600">
							{config.playersConnected.replace(
								'{count}',
								playerCount.toString()
							)}
						</div>
						{!canStart && (
							<div className="text-sm text-red-600">
								{config.minPlayersRequired.replace(
									'{min}',
									config.minPlayers.toString()
								)}
							</div>
						)}
					</div>

					{!started ? (
						<button
							onClick={() => globalActions.startGame()}
							disabled={!canStart}
							className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
						>
							{config.startButton}
						</button>
					) : (
						<>
							<div className="mb-4 space-y-2">
								<div className="text-sm">
									<span className="font-semibold">{config.currentPhase}:</span>{' '}
									{phase}
								</div>
								<div className="text-sm">
									<span className="font-semibold">{config.round}:</span>{' '}
									{currentRound} / {config.totalRounds}
								</div>
							</div>
							<button
								onClick={() => globalActions.stopGame()}
								className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
							>
								{config.stopButton}
							</button>
						</>
					)}
				</div>

				{/* Player List */}
				<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
					<h2 className="mb-4 text-xl font-bold">{config.players}</h2>
					<div className="space-y-2">
						{Object.entries(players).map(([clientId, player]) => {
							const isOnline = onlineClientIds.has(clientId);
							const isMole = started && clientId === moleClientId;
							return (
								<div
									key={clientId}
									className="flex items-center justify-between rounded-lg border p-3"
								>
									<span className={!isOnline ? 'opacity-50' : ''}>
										{player.name}
									</span>
									<div className="flex gap-2">
										{!isOnline && (
											<span className="text-xs text-gray-500">offline</span>
										)}
										{started && (
											<span
												className={`text-xs font-semibold ${isMole ? 'text-red-600' : 'text-blue-600'}`}
											>
												{isMole ? config.mole : config.crew}
											</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</HostPresenterLayout.Main>
		</HostPresenterLayout.Root>
	);
};

export default App;
