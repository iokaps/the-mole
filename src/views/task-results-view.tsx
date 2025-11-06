import { config } from '@/config';
import { globalStore } from '@/state/stores/global-store';
import * as React from 'react';
import { useSnapshot } from 'valtio';

export const TaskResultsView: React.FC = () => {
	const { currentRound, taskResults } = useSnapshot(globalStore.proxy);

	const currentResult = taskResults[currentRound - 1];

	if (!currentResult) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-xl">{config.loading}</p>
			</div>
		);
	}

	const successRate = Math.round(currentResult.successRate * 100);
	const isSuccess = currentResult.success;

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-8 p-8">
			<div
				className={`text-6xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
			>
				{isSuccess ? config.taskSuccess : config.taskFailed}
			</div>

			<p className="text-xl text-gray-700">
				{config.taskSuccessRate.replace('{rate}', successRate.toString())}
			</p>
		</div>
	);
};
