import { config } from '@/config';
import { playerStore } from '@/state/stores/player-store';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSnapshot } from 'valtio';

export const RoleRevealView: React.FC = () => {
	const { role } = useSnapshot(playerStore.proxy);

	if (!role) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="text-center">
					<p className="text-xl">{config.roleRevealWaiting}</p>
				</div>
			</div>
		);
	}

	const isMole = role === 'mole';
	const title = isMole ? config.roleMoleTitle : config.roleCrewTitle;
	const description = isMole
		? config.roleMoleDescriptionMd
		: config.roleCrewDescriptionMd;
	const bgColor = isMole ? 'bg-red-600' : 'bg-blue-600';

	return (
		<div
			className={`flex h-full w-full items-center justify-center ${bgColor} text-white`}
		>
			<div className="max-w-lg p-8 text-center">
				<h1 className="mb-4 text-4xl font-bold">{title}</h1>
				<div className="prose prose-lg prose-invert">
					<ReactMarkdown>{description}</ReactMarkdown>
				</div>
			</div>
		</div>
	);
};
