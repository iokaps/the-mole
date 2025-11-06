import { z } from 'zod/v4';

export const schema = z.object({
	// Game settings
	title: z.string().default('The Mole'),
	minPlayers: z.number().default(3),
	maxPlayers: z.number().default(10),
	totalRounds: z.number().default(4),

	// Phase durations (milliseconds)
	roleRevealDuration: z.number().default(5000),
	taskIntroDuration: z.number().default(8000),
	taskDuration: z.number().default(20000),
	taskResultsDuration: z.number().default(5000),
	discussionDuration: z.number().default(45000),
	votingDuration: z.number().default(30000),

	// Task settings
	taskSuccessThreshold: z.number().default(0.8),

	// General UI
	players: z.string().default('Players'),
	round: z.string().default('Round'),
	timeRemaining: z.string().default('Time Remaining'),
	loading: z.string().default('Loading...'),
	waiting: z.string().default('Waiting...'),

	// Lobby
	gameLobbyMd: z
		.string()
		.default(
			'# Waiting for players...\n\nThe game will start once the host is ready.'
		),
	minPlayersRequired: z.string().default('Minimum {min} players required'),
	playersConnected: z.string().default('{count} players connected'),
	startButton: z.string().default('Start Game'),
	stopButton: z.string().default('End Game'),

	// Player name
	playerNameTitle: z.string().default('Enter Your Name'),
	playerNamePlaceholder: z.string().default('Your name...'),
	playerNameLabel: z.string().default('Name:'),
	playerNameButton: z.string().default('Continue'),

	// Role reveal
	roleCrewTitle: z.string().default('You are a Crew Member'),
	roleCrewDescriptionMd: z
		.string()
		.default(
			'Work with your team to complete tasks and identify **The Mole**.'
		),
	roleMoleTitle: z.string().default('You are The Mole'),
	roleMoleDescriptionMd: z
		.string()
		.default('Sabotage tasks without getting caught! Stay undercover.'),
	roleRevealWaiting: z.string().default('Get ready...'),

	// Task phases
	taskIntroTitle: z.string().default('Task {round}'),
	taskActive: z.string().default('Complete the task!'),
	taskSuccess: z.string().default('✓ Task Successful'),
	taskFailed: z.string().default('✗ Task Failed'),
	taskSuccessRate: z.string().default('Success Rate: {rate}%'),

	// Discussion
	discussionTitle: z.string().default('Discussion Time'),
	discussionDescriptionMd: z
		.string()
		.default('Discuss with your team and figure out who **The Mole** is.'),

	// Voting
	votingTitle: z.string().default('Vote for The Mole'),
	votingDescription: z.string().default('Who do you think is The Mole?'),
	voteButton: z.string().default('Vote'),
	votingWaiting: z.string().default('Waiting for all players to vote...'),
	hasVoted: z.string().default('You voted for {name}'),

	// Results
	resultsTitle: z.string().default('Game Over'),
	theMoleWas: z.string().default('The Mole was:'),
	crewWins: z.string().default('🎉 Crew Wins!'),
	moleWins: z.string().default('😈 The Mole Wins!'),
	crewWinsDescriptionMd: z
		.string()
		.default('The crew successfully identified **The Mole**!'),
	moleWinsDescriptionMd: z
		.string()
		.default('**The Mole** evaded detection and sabotaged the mission!'),
	voteDistribution: z.string().default('Vote Distribution'),
	votes: z.string().default('votes'),
	tasksCompleted: z.string().default('Tasks Completed: {count}/{total}'),
	playAgainButton: z.string().default('Play Again'),

	// Task: Button Timing
	taskButtonTimingTitle: z.string().default('Button Timing'),
	taskButtonTimingDescription: z
		.string()
		.default('Tap the button when it turns green!'),
	taskButtonWaiting: z.string().default('Wait for green...'),
	taskButtonGo: z.string().default('TAP NOW!'),
	taskButtonTapped: z.string().default('Tapped!'),
	taskButtonTooEarly: z.string().default('Too early!'),
	taskButtonTooLate: z.string().default('Too late!'),

	// Task: Color Matching
	taskColorMatchingTitle: z.string().default('Color Matching'),
	taskColorMatchingDescription: z
		.string()
		.default('Everyone select the same color!'),
	taskColorSelect: z.string().default('Select a color'),
	taskColorSelected: z.string().default('Color selected'),

	// Task: Sequence Memory
	taskSequenceTitle: z.string().default('Sequence Memory'),
	taskSequenceDescription: z
		.string()
		.default('Watch the sequence, then repeat it!'),
	taskSequenceWatch: z.string().default('Watch carefully...'),
	taskSequenceRepeat: z.string().default('Your turn!'),
	taskSequenceCorrect: z.string().default('Correct!'),
	taskSequenceWrong: z.string().default('Wrong!'),

	// Host/Presenter
	hostLabel: z.string().default('Host'),
	presenterLabel: z.string().default('Presenter'),
	gameLinksTitle: z.string().default('Game Links'),
	playerLinkLabel: z.string().default('Player Link'),
	presenterLinkLabel: z.string().default('Presenter Link'),

	currentPhase: z.string().default('Current Phase'),
	playerRoles: z.string().default('Player Roles'),
	crew: z.string().default('Crew'),
	mole: z.string().default('Mole'),

	// Menu
	menuTitle: z.string().default('Menu'),
	menuAriaLabel: z.string().default('Open menu')
});

export type Config = z.infer<typeof schema>;
