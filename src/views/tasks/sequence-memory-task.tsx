import { config } from '@/config';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const COLORS = [
	{ name: 'red', bg: 'bg-red-500' },
	{ name: 'blue', bg: 'bg-blue-500' },
	{ name: 'green', bg: 'bg-green-500' },
	{ name: 'yellow', bg: 'bg-yellow-500' }
];

export const SequenceMemoryTask: React.FC = () => {
	const { currentRound, tasks } = useSnapshot(globalStore.proxy);
	const { role } = useSnapshot(playerStore.proxy);

	const currentTask = tasks[currentRound - 1];
	const sequence: string[] = currentTask?.data?.sequence || [];

	const [showPhase, setShowPhase] = React.useState<'watch' | 'input'>('watch');
	const [displayIndex, setDisplayIndex] = React.useState(0);
	const [userSequence, setUserSequence] = React.useState<string[]>([]);
	const [hasSubmitted, setHasSubmitted] = React.useState(false);

	// Display sequence animation
	React.useEffect(() => {
		if (showPhase === 'watch') {
			const interval = setInterval(() => {
				setDisplayIndex((prev) => {
					if (prev >= sequence.length) {
						clearInterval(interval);
						setTimeout(() => setShowPhase('input'), 500);
						return prev;
					}
					return prev + 1;
				});
			}, 800);

			return () => clearInterval(interval);
		}
	}, [showPhase, sequence.length]);

	const handleColorClick = async (color: string) => {
		if (hasSubmitted) return;

		const newSequence = [...userSequence, color];
		setUserSequence(newSequence);

		// Auto-submit when sequence is complete
		if (newSequence.length === sequence.length) {
			setHasSubmitted(true);
			await globalActions.submitTaskResponse(kmClient.id, {
				sequence: newSequence
			});
		}
	};

	const isCorrect =
		hasSubmitted && JSON.stringify(userSequence) === JSON.stringify(sequence);

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-8 p-8">
			<h2 className="text-2xl font-bold">{config.taskSequenceTitle}</h2>

			{showPhase === 'watch' && (
				<>
					<p className="text-lg text-gray-700">{config.taskSequenceWatch}</p>
					<div className="flex gap-4">
						{COLORS.map((color, idx) => (
							<div
								key={color.name}
								className={`h-24 w-24 rounded-lg transition-all ${color.bg} ${idx < displayIndex && sequence[idx] === color.name ? 'scale-110 opacity-100' : 'opacity-20'}`}
							/>
						))}
					</div>
				</>
			)}

			{showPhase === 'input' && (
				<>
					<p className="text-lg text-gray-700">{config.taskSequenceRepeat}</p>

					{role === 'mole' && !hasSubmitted && (
						<div className="text-sm font-semibold text-red-600">
							(Sabotage: Enter the wrong sequence!)
						</div>
					)}

					<div className="flex gap-4">
						{COLORS.map((color) => (
							<button
								key={color.name}
								onClick={() => handleColorClick(color.name)}
								disabled={hasSubmitted}
								className={`h-24 w-24 rounded-lg transition-all ${color.bg} hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50`}
							/>
						))}
					</div>

					<div className="flex gap-2">
						{userSequence.map((color, idx) => {
							const colorData = COLORS.find((c) => c.name === color);
							return (
								<div key={idx} className={`h-8 w-8 rounded ${colorData?.bg}`} />
							);
						})}
					</div>

					{hasSubmitted && (
						<p
							className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
						>
							{isCorrect
								? config.taskSequenceCorrect
								: config.taskSequenceWrong}
						</p>
					)}
				</>
			)}
		</div>
	);
};
