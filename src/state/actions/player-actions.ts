import { kmClient } from '@/services/km-client';
import { globalStore } from '../stores/global-store';
import { playerStore } from '../stores/player-store';

export const playerActions = {
	async setPlayerName(name: string) {
		await kmClient.transact(
			[playerStore, globalStore],
			([playerState, globalState]) => {
				playerState.name = name;
				globalState.players[kmClient.id] = { name };
			}
		);
	},

	async setRole(role: 'mole' | 'crew') {
		await kmClient.transact([playerStore], ([playerState]) => {
			playerState.role = role;
		});
	},

	async setHasVoted(voted: boolean) {
		await kmClient.transact([playerStore], ([playerState]) => {
			playerState.hasVoted = voted;
		});
	}
};
