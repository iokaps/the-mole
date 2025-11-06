import { PlayerMenu } from '@/components/player/menu';
import { NameLabel } from '@/components/player/name-label';
import { config } from '@/config';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGlobalController } from '@/hooks/useGlobalController';
import { PlayerLayout } from '@/layouts/player';
import { kmClient } from '@/services/km-client';
import { playerActions } from '@/state/actions/player-actions';
import { globalStore } from '@/state/stores/global-store';
import { playerStore } from '@/state/stores/player-store';
import { CreateProfileView } from '@/views/create-profile-view';
import { DiscussionView } from '@/views/discussion-view';
import { GameLobbyView } from '@/views/game-lobby-view';
import { GameResultsView } from '@/views/game-results-view';
import { RoleRevealView } from '@/views/role-reveal-view';
import { TaskIntroView } from '@/views/task-intro-view';
import { TaskResultsView } from '@/views/task-results-view';
import { ButtonTimingTask } from '@/views/tasks/button-timing-task';
import { ColorMatchingTask } from '@/views/tasks/color-matching-task';
import { SequenceMemoryTask } from '@/views/tasks/sequence-memory-task';
import { VotingView } from '@/views/voting-view';
import { KmModalProvider } from '@kokimoki/shared';
import * as React from 'react';
import { useSnapshot } from 'valtio';

const App: React.FC = () => {
	const { title } = config;
	const { name, role } = useSnapshot(playerStore.proxy);
	const { started, phase, moleClientId, currentRound, tasks } = useSnapshot(
		globalStore.proxy
	);

	useGlobalController();
	useDocumentTitle(title);

	// Set player role when game starts
	React.useEffect(() => {
		if (started && !role && moleClientId) {
			const isMole = kmClient.id === moleClientId;
			playerActions.setRole(isMole ? 'mole' : 'crew');
		}
	}, [started, role, moleClientId]);

	// Reset role when game ends
	React.useEffect(() => {
		if (!started && role) {
			playerActions.setRole(null as any);
		}
	}, [started, role]);

	if (!name) {
		return (
			<PlayerLayout.Root>
				<PlayerLayout.Header />
				<PlayerLayout.Main>
					<CreateProfileView />
				</PlayerLayout.Main>
			</PlayerLayout.Root>
		);
	}

	if (!started) {
		return (
			<KmModalProvider>
				<PlayerLayout.Root>
					<PlayerLayout.Header>
						<PlayerMenu />
					</PlayerLayout.Header>

					<PlayerLayout.Main>
						<GameLobbyView />
					</PlayerLayout.Main>

					<PlayerLayout.Footer>
						<NameLabel name={name} />
					</PlayerLayout.Footer>
				</PlayerLayout.Root>
			</KmModalProvider>
		);
	}

	// Render based on game phase
	const renderPhaseView = () => {
		switch (phase) {
			case 'role-reveal':
				return <RoleRevealView />;

			case 'task-intro':
				return <TaskIntroView />;

			case 'task-active':
				const currentTask = tasks[currentRound - 1];
				if (!currentTask) return null;

				switch (currentTask.type) {
					case 'button-timing':
						return <ButtonTimingTask />;
					case 'color-matching':
						return <ColorMatchingTask />;
					case 'sequence-memory':
						return <SequenceMemoryTask />;
					default:
						return null;
				}

			case 'task-results':
				return <TaskResultsView />;

			case 'discussion':
				return <DiscussionView />;

			case 'voting':
				return <VotingView />;

			case 'game-results':
				return <GameResultsView />;

			default:
				return (
					<div className="flex h-full items-center justify-center">
						{config.loading}
					</div>
				);
		}
	};

	return (
		<PlayerLayout.Root>
			<PlayerLayout.Header />

			<PlayerLayout.Main>{renderPhaseView()}</PlayerLayout.Main>

			<PlayerLayout.Footer>
				<NameLabel name={name} />
			</PlayerLayout.Footer>
		</PlayerLayout.Root>
	);
};

export default App;
