import { kmClient } from '@/services/km-client';

export type GamePhase =
	| 'lobby'
	| 'role-reveal'
	| 'task-intro'
	| 'task-active'
	| 'task-results'
	| 'discussion'
	| 'voting'
	| 'game-results';

export type TaskType = 'button-timing' | 'color-matching' | 'sequence-memory';

export interface Task {
	id: string;
	type: TaskType;
	round: number;
	data: any; // Task-specific data (e.g., sequence, target time, etc.)
}

export interface TaskResult {
	taskId: string;
	success: boolean;
	responses: Record<string, any>; // clientId -> response
	successRate: number;
}

export interface GlobalState {
	controllerConnectionId: string;
	started: boolean;
	startTimestamp: number;
	players: Record<string, { name: string }>;

	// Game state
	phase: GamePhase;
	phaseStartTime: number;
	currentRound: number;
	moleClientId: string;

	// Tasks
	tasks: Task[];
	taskResults: TaskResult[];
	taskResponses: Record<string, any>; // clientId -> current task response

	// Voting
	votes: Record<string, string>; // voterClientId -> votedClientId
}

const initialState: GlobalState = {
	controllerConnectionId: '',
	started: false,
	startTimestamp: 0,
	players: {},

	phase: 'lobby',
	phaseStartTime: 0,
	currentRound: 0,
	moleClientId: '',

	tasks: [],
	taskResults: [],
	taskResponses: {},

	votes: {}
};

export const globalStore = kmClient.store<GlobalState>('global', initialState);
