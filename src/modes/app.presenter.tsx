import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
import { useServerTimer } from '@/hooks/useServerTime';
import { generateLink } from '@/kit/generate-link';
import { HostPresenterLayout } from '@/layouts/host-presenter';
import { kmClient } from '@/services/km-client';
import { globalStore } from '@/state/stores/global-store';
import { KmQrCode, KmTimeCountdown } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const App: React.FC = () => {
	const { title } = config;
	const { started, phase, currentRound, players, phaseStartTime, taskResults } =
		useSnapshot(globalStore.proxy);
	const serverTime = useServerTimer();

	useGlobalController();
	useDocumentTitle(title);

	if (kmClient.clientContext.mode !== 'presenter') {
		throw new Error('App presenter rendered in non-presenter mode');
	}

	const playerLink = generateLink(kmClient.clientContext.playerCode, {
		mode: 'player'
	});

	const getPhaseDuration = () => {
		switch (phase) {
			case 'role-reveal':
				return config.roleRevealDuration;
			case 'task-intro':
				return config.taskIntroDuration;
			case 'task-active':
				return config.taskDuration;
			case 'task-results':
				return config.taskResultsDuration;
			case 'discussion':
				return config.discussionDuration;
			case 'voting':
				return config.votingDuration;
			default:
				return 0;
		}
	};

	const timeRemaining = Math.max(
		0,
		getPhaseDuration() - (serverTime - phaseStartTime)
	);

	return (
		<HostPresenterLayout.Root>
			<HostPresenterLayout.Header>
				<div className="text-sm opacity-70">{config.presenterLabel}</div>
			</HostPresenterLayout.Header>

			<HostPresenterLayout.Main>
				{!started ? (
					<>
						<div className="rounded-lg border border-gray-200 bg-white shadow-md">
							<div className="flex flex-col gap-2 p-6">
								<h2 className="text-xl font-bold">{config.playerLinkLabel}</h2>
								<KmQrCode data={playerLink} size={200} interactive={false} />

								<a
									href={playerLink}
									target="_blank"
									rel="noreferrer"
									className="break-all text-blue-600 underline hover:text-blue-700"
								>
									{config.playerLinkLabel}
								</a>
							</div>
						</div>

						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
							<h2 className="mb-4 text-xl font-bold">{config.players}</h2>
							<div className="text-4xl font-bold">
								{Object.keys(players).length}
							</div>
						</div>
					</>
				) : (
					<>
						{/* Game Info */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
							<h2 className="mb-4 text-xl font-bold">Game Status</h2>
							<div className="space-y-2">
								<div className="text-lg">
									<span className="font-semibold">{config.currentPhase}:</span>{' '}
									{phase}
								</div>
								<div className="text-lg">
									<span className="font-semibold">{config.round}:</span>{' '}
									{currentRound} / {config.totalRounds}
								</div>
								{phase !== 'game-results' && phase !== 'lobby' && (
									<div className="text-lg">
										<span className="font-semibold">
											{config.timeRemaining}:
										</span>{' '}
										<KmTimeCountdown ms={timeRemaining} />
									</div>
								)}
							</div>
						</div>

						{/* Task Progress */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
							<h2 className="mb-4 text-xl font-bold">Task Progress</h2>
							<div className="space-y-2">
								{taskResults.map((result, idx) => (
									<div
										key={result.taskId}
										className={`flex items-center justify-between rounded-lg border p-3 ${
											result.success
												? 'border-green-300 bg-green-50'
												: 'border-red-300 bg-red-50'
										}`}
									>
										<span className="font-semibold">Task {idx + 1}</span>
										<span
											className={
												result.success ? 'text-green-600' : 'text-red-600'
											}
										>
											{result.success ? config.taskSuccess : config.taskFailed}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Player Count */}
						<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
							<h2 className="mb-4 text-xl font-bold">{config.players}</h2>
							<div className="text-4xl font-bold">
								{Object.keys(players).length}
							</div>
						</div>
					</>
				)}
			</HostPresenterLayout.Main>
		</HostPresenterLayout.Root>
	);
};

export default App;
