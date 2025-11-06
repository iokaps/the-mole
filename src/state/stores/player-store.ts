import { kmClient } from '@/services/km-client';

export type PlayerRole = 'mole' | 'crew' | null;

export interface PlayerState {
	name: string;
	role: PlayerRole;
	hasVoted: boolean;
}

const initialState: PlayerState = {
	name: '',
	role: null,
	hasVoted: false
};

export const playerStore = kmClient.localStore<PlayerState>(
	'player',
	initialState
);
