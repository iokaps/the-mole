import { config } from '@/config';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { playerStore } from '@/state/stores/player-store';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const COLORS = [
	{ name: 'red', bg: 'bg-red-500', hover: 'hover:bg-red-600' },
	{ name: 'blue', bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
	{ name: 'green', bg: 'bg-green-500', hover: 'hover:bg-green-600' },
	{ name: 'yellow', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' }
];

export const ColorMatchingTask: React.FC = () => {
	const { role } = useSnapshot(playerStore.proxy);

	const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

	const handleColorSelect = async (color: string) => {
		if (selectedColor) return; // Already selected

		setSelectedColor(color);

		// Submit response
		await globalActions.submitTaskResponse(kmClient.id, {
			color
		});
	};

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-8 p-8">
			<h2 className="text-2xl font-bold">{config.taskColorMatchingTitle}</h2>
			<p className="text-lg text-gray-700">
				{config.taskColorMatchingDescription}
			</p>

			{role === 'mole' && !selectedColor && (
				<div className="text-sm font-semibold text-red-600">
					(Sabotage: Pick a different color from others!)
				</div>
			)}

			<div className="grid grid-cols-2 gap-4">
				{COLORS.map((color) => (
					<button
						key={color.name}
						onClick={() => handleColorSelect(color.name)}
						disabled={!!selectedColor}
						className={`h-32 w-32 rounded-lg text-lg font-bold text-white transition-all ${color.bg} ${color.hover} ${selectedColor === color.name ? 'scale-110 ring-4 ring-white' : ''} disabled:cursor-not-allowed disabled:opacity-50`}
					>
						{selectedColor === color.name ? '✓' : ''}
					</button>
				))}
			</div>

			{selectedColor && (
				<p className="text-sm text-gray-600">{config.taskColorSelected}</p>
			)}
		</div>
	);
};
