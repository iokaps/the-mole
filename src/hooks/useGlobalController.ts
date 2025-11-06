import { config } from '@/config';
import { kmClient } from '@/services/km-client';
import { globalActions } from '@/state/actions/global-actions';
import { globalStore } from '@/state/stores/global-store';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { useServerTimer } from './useServerTime';

export function useGlobalController() {
	const {
		controllerConnectionId,
		started,
		phase,
		phaseStartTime,
		currentRound,
		tasks
	} = useSnapshot(globalStore.proxy);
	const connections = useSnapshot(globalStore.connections);
	const connectionIds = connections.connectionIds;
	const isGlobalController = controllerConnectionId === kmClient.connectionId;
	const serverTime = useServerTimer(1000); // tick every second

	// Maintain connection that is assigned to be the global controller
	useEffect(() => {
		// Check if global controller is online
		if (connectionIds.has(controllerConnectionId)) {
			return;
		}

		// Select new host, sorting by connection id
		kmClient
			.transact([globalStore], ([globalState]) => {
				const connectionIdsArray = Array.from(connectionIds);
				connectionIdsArray.sort();
				globalState.controllerConnectionId = connectionIdsArray[0] || '';
			})
			.then(() => {})
			.catch(() => {});
	}, [connectionIds, controllerConnectionId]);

	// Run global controller-specific logic for phase transitions
	useEffect(() => {
		if (!isGlobalController || !started) {
			return;
		}

		const elapsed = serverTime - phaseStartTime;

		const handlePhaseTransition = async () => {
			switch (phase) {
				case 'role-reveal':
					if (elapsed >= config.roleRevealDuration) {
						await globalActions.nextRound();
						await globalActions.setPhase('task-intro');
					}
					break;

				case 'task-intro':
					if (elapsed >= config.taskIntroDuration) {
						await globalActions.setPhase('task-active');
					}
					break;

				case 'task-active':
					if (elapsed >= config.taskDuration) {
						await globalActions.completeTask();
						await globalActions.setPhase('task-results');
					}
					break;

				case 'task-results':
					if (elapsed >= config.taskResultsDuration) {
						// Check if more rounds to play
						if (currentRound < config.totalRounds) {
							await globalActions.setPhase('task-intro');
							await globalActions.nextRound();
						} else {
							// All tasks done, move to discussion
							await globalActions.setPhase('discussion');
						}
					}
					break;

				case 'discussion':
					if (elapsed >= config.discussionDuration) {
						await globalActions.setPhase('voting');
					}
					break;

				case 'voting':
					// Check if all players have voted or time is up
					const playerIds = Object.keys(globalStore.proxy.players);
					const votes = Object.keys(globalStore.proxy.votes);
					const allVoted = votes.length === playerIds.length;

					if (allVoted || elapsed >= config.votingDuration) {
						await globalActions.setPhase('game-results');
					}
					break;

				case 'game-results':
					// Stay here until host restarts
					break;
			}
		};

		handlePhaseTransition();
	}, [
		isGlobalController,
		started,
		serverTime,
		phase,
		phaseStartTime,
		currentRound,
		tasks.length
	]);

	return isGlobalController;
}
