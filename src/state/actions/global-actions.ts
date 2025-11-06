import { config } from '@/config';
import { kmClient } from '@/services/km-client';
import {
	globalStore,
	type GamePhase,
	type Task,
	type TaskType
} from '../stores/global-store';

// Generate random task sequence
function generateTasks(totalRounds: number): Task[] {
	const taskTypes: TaskType[] = [
		'button-timing',
		'color-matching',
		'sequence-memory'
	];
	const tasks: Task[] = [];

	for (let round = 1; round <= totalRounds; round++) {
		const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
		const task: Task = {
			id: `task-${round}`,
			type,
			round,
			data: generateTaskData(type)
		};
		tasks.push(task);
	}

	return tasks;
}

function generateTaskData(type: TaskType): any {
	switch (type) {
		case 'button-timing':
			return {
				delay: 2000 + Math.random() * 3000, // Random delay 2-5 seconds before green
				window: 2000 // 2 second window to tap
			};
		case 'color-matching':
			return {
				colors: ['red', 'blue', 'green', 'yellow']
			};
		case 'sequence-memory':
			const colors = ['red', 'blue', 'green', 'yellow'];
			const length = 4;
			const sequence: string[] = [];
			for (let i = 0; i < length; i++) {
				sequence.push(colors[Math.floor(Math.random() * colors.length)]);
			}
			return { sequence };
		default:
			return {};
	}
}

export const globalActions = {
	async startGame() {
		const playerIds = Object.keys(globalStore.proxy.players);
		if (playerIds.length < config.minPlayers) {
			return; // Not enough players
		}

		// Select random mole
		const moleClientId =
			playerIds[Math.floor(Math.random() * playerIds.length)];

		// Generate tasks
		const tasks = generateTasks(config.totalRounds);

		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.started = true;
			globalState.startTimestamp = kmClient.serverTimestamp();
			globalState.phase = 'role-reveal';
			globalState.phaseStartTime = kmClient.serverTimestamp();
			globalState.currentRound = 0;
			globalState.moleClientId = moleClientId;
			globalState.tasks = tasks;
			globalState.taskResults = [];
			globalState.taskResponses = {};
			globalState.votes = {};
		});
	},

	async stopGame() {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.started = false;
			globalState.startTimestamp = 0;
			globalState.phase = 'lobby';
			globalState.currentRound = 0;
			globalState.moleClientId = '';
			globalState.tasks = [];
			globalState.taskResults = [];
			globalState.taskResponses = {};
			globalState.votes = {};
		});
	},

	async setPhase(phase: GamePhase) {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.phase = phase;
			globalState.phaseStartTime = kmClient.serverTimestamp();
		});
	},

	async submitTaskResponse(clientId: string, response: any) {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.taskResponses[clientId] = response;
		});
	},

	async completeTask() {
		await kmClient.transact([globalStore], ([globalState]) => {
			const currentTask = globalState.tasks[globalState.currentRound - 1];
			if (!currentTask) return;

			const responses = globalState.taskResponses;
			const responseCount = Object.keys(responses).length;

			// Calculate success
			let successCount = 0;
			Object.entries(responses).forEach(([clientId, response]) => {
				if (
					isTaskResponseSuccessful(
						currentTask,
						response,
						globalState.moleClientId === clientId
					)
				) {
					successCount++;
				}
			});

			const successRate = responseCount > 0 ? successCount / responseCount : 0;
			const success = successRate >= config.taskSuccessThreshold;

			globalState.taskResults.push({
				taskId: currentTask.id,
				success,
				responses,
				successRate
			});

			// Clear responses for next task
			globalState.taskResponses = {};
		});
	},

	async submitVote(voterClientId: string, votedClientId: string) {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.votes[voterClientId] = votedClientId;
		});
	},

	async nextRound() {
		await kmClient.transact([globalStore], ([globalState]) => {
			globalState.currentRound += 1;
		});
	}
};

// Helper function to check if a task response is successful
function isTaskResponseSuccessful(
	task: Task,
	response: any,
	_isMole: boolean
): boolean {
	switch (task.type) {
		case 'button-timing':
			return response?.success === true;
		case 'color-matching':
			return response?.color != null;
		case 'sequence-memory':
			return (
				JSON.stringify(response?.sequence) ===
				JSON.stringify(task.data.sequence)
			);
		default:
			return false;
	}
}
