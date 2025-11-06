import { config } from '@/config';
import { useServerTimer } from '@/hooks/useServerTime';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const ButtonTimingTask: React.FC = () => {
	const { currentRound, tasks, phaseStartTime } = useSnapshot(
		globalStore.proxy
	);
	const { role } = useSnapshot(playerStore.proxy);
	const serverTime = useServerTimer();

	const currentTask = tasks[currentRound - 1];
	const [hasResponded, setHasResponded] = React.useState(false);
	const [response, setResponse] = React.useState<
		'success' | 'early' | 'late' | null
	>(null);

	const taskElapsed = serverTime - phaseStartTime;
	const delay = currentTask?.data?.delay || 3000;
	const window = currentTask?.data?.window || 2000;

	const isGreen = taskElapsed >= delay && taskElapsed < delay + window;
	const isPast = taskElapsed >= delay + window;

	const handleTap = async () => {
		if (hasResponded) return;

		setHasResponded(true);

		let result: 'success' | 'early' | 'late';
		if (isGreen) {
			result = 'success';
		} else if (taskElapsed < delay) {
			result = 'early';
		} else {
			result = 'late';
		}

		setResponse(result);

		// Submit response
		await globalActions.submitTaskResponse(kmClient.id, {
			success: result === 'success',
			timestamp: serverTime
		});
	};

	const getButtonLabel = () => {
		if (hasResponded) {
			if (response === 'success') return config.taskButtonTapped;
			if (response === 'early') return config.taskButtonTooEarly;
			if (response === 'late') return config.taskButtonTooLate;
		}
		if (isGreen) return config.taskButtonGo;
		return config.taskButtonWaiting;
	};

	const getButtonColor = () => {
		if (hasResponded) {
			if (response === 'success') return 'bg-green-600 hover:bg-green-600';
			return 'bg-red-600 hover:bg-red-600';
		}
		if (isGreen) return 'bg-green-500 hover:bg-green-600 animate-pulse';
		return 'bg-gray-400 hover:bg-gray-500';
	};

	// Auto-fail if time runs out
	React.useEffect(() => {
		if (isPast && !hasResponded) {
			setHasResponded(true);
			setResponse('late');
			globalActions.submitTaskResponse(kmClient.id, {
				success: false,
				timestamp: serverTime
			});
		}
	}, [isPast, hasResponded, serverTime]);

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-8 p-8">
			<h2 className="text-2xl font-bold">{config.taskButtonTimingTitle}</h2>
			<p className="text-lg text-gray-700">
				{config.taskButtonTimingDescription}
			</p>

			{role === 'mole' && !hasResponded && (
				<div className="text-sm font-semibold text-red-600">
					(Sabotage: Tap too early or too late!)
				</div>
			)}

			<button
				onClick={handleTap}
				disabled={hasResponded}
				className={`h-48 w-48 rounded-full text-2xl font-bold text-white transition-all ${getButtonColor()} disabled:cursor-not-allowed`}
			>
				{getButtonLabel()}
			</button>
		</div>
	);
};
