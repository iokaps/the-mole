import { config } from '@/config';
import { useServerTimer } from '@/hooks/useServerTime';
import { globalStore } from '@/state/stores/global-store';
import { KmTimeCountdown } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const TaskIntroView: React.FC = () => {
	const { currentRound, tasks, phaseStartTime } = useSnapshot(
		globalStore.proxy
	);
	const serverTime = useServerTimer();

	const currentTask = tasks[currentRound - 1];

	if (!currentTask) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-xl">{config.loading}</p>
			</div>
		);
	}

	const timeRemaining = Math.max(
		0,
		config.taskIntroDuration - (serverTime - phaseStartTime)
	);

	const getTaskTitle = () => {
		switch (currentTask.type) {
			case 'button-timing':
				return config.taskButtonTimingTitle;
			case 'color-matching':
				return config.taskColorMatchingTitle;
			case 'sequence-memory':
				return config.taskSequenceTitle;
			default:
				return 'Task';
		}
	};

	const getTaskDescription = () => {
		switch (currentTask.type) {
			case 'button-timing':
				return config.taskButtonTimingDescription;
			case 'color-matching':
				return config.taskColorMatchingDescription;
			case 'sequence-memory':
				return config.taskSequenceDescription;
			default:
				return '';
		}
	};

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
			<div className="text-center">
				<h1 className="mb-2 text-3xl font-bold">
					{config.taskIntroTitle.replace('{round}', currentRound.toString())}
				</h1>
				<h2 className="mb-4 text-2xl font-semibold">{getTaskTitle()}</h2>
				<p className="mb-6 text-lg text-gray-700">{getTaskDescription()}</p>

				<div className="text-sm text-gray-600">
					{config.timeRemaining}: <KmTimeCountdown ms={timeRemaining} />
				</div>
			</div>
		</div>
	);
};
