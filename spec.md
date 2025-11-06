# The Mole - Game Specification

## Overview

A social deduction game where players work together to complete mini-games, but one player is secretly "The Mole" trying to sabotage the tasks.

## Game Flow

### 1. Lobby Phase

- Players join and enter their names
- Host can see all connected players
- Host starts the game when ready (minimum 3 players required)

### 2. Role Assignment

- One random player is secretly assigned as "The Mole"
- Other players are "Crew Members"
- Players see their role on their device (private)

### 3. Task Rounds (3-5 rounds)

Each round consists of:

- **Task Introduction** (5-10 seconds): All players see the task description
- **Task Execution** (15-30 seconds): Players complete the cooperative task
- **Task Results** (5 seconds): Show if task was successful or failed

### 4. Discussion Phase (30-60 seconds)

- Players can discuss who they think The Mole is
- No voting yet, just discussion time
- Timer counts down

### 5. Voting Phase

- All players vote for who they think is The Mole
- Cannot vote for themselves
- Results are hidden until all votes are cast

### 6. Results

- Reveal who The Mole was
- Show vote distribution
- **Crew Wins** if majority voted for The Mole
- **Mole Wins** if they avoided detection

## Mini-Game Ideas (AI-Generated)

### Task 1: Button Timing

- **Description**: "Everyone tap your button when it turns green"
- **Crew Goal**: All players tap within 2 seconds of the button turning green
- **Mole Strategy**: Tap too early or too late
- **Success Condition**: 80%+ of players tap in time window

### Task 2: Color Matching

- **Description**: "Select the color that matches the majority"
- **Crew Goal**: Everyone picks the same color from 4 options
- **Mole Strategy**: Pick a different color
- **Success Condition**: 80%+ of players pick the same color

### Task 3: Sequence Memory

- **Description**: "Remember and repeat the sequence shown"
- **Crew Goal**: All players enter the correct sequence of 4 colors
- **Mole Strategy**: Enter wrong sequence
- **Success Condition**: 80%+ of players enter correct sequence

### Task 4: Wire Connection

- **Description**: "Connect the matching colored wires"
- **Crew Goal**: Drag and connect matching wire pairs correctly
- **Mole Strategy**: Connect wrong wires or be slow
- **Success Condition**: 80%+ of players connect correctly

### Task 5: Number Sum

- **Description**: "Enter numbers that sum to the target"
- **Crew Goal**: Each player enters a number, team sum should equal target
- **Mole Strategy**: Enter a number that breaks the sum
- **Success Condition**: Team sum is within 10% of target

## Game States

```typescript
type GamePhase =
  | 'lobby' // Waiting for players
  | 'role-reveal' // Show player their role
  | 'task-intro' // Introduce the task
  | 'task-active' // Task in progress
  | 'task-results' // Show task outcome
  | 'discussion' // Players discuss
  | 'voting' // Vote for The Mole
  | 'game-results'; // Final results

interface GlobalState {
  phase: GamePhase;
  currentRound: number;
  totalRounds: number;
  moleClientId: string;
  tasks: Task[];
  currentTask: Task | null;
  taskResults: TaskResult[];
  votes: Record<string, string>; // voterClientId -> votedClientId
  phaseStartTime: number;
  phaseDuration: number;
}

interface PlayerState {
  role: 'mole' | 'crew' | null;
  currentView:
    | 'lobby'
    | 'role-reveal'
    | 'task'
    | 'discussion'
    | 'voting'
    | 'results';
  hasVoted: boolean;
  taskResponse: any; // Task-specific response
}

interface Task {
  id: string;
  type:
    | 'button-timing'
    | 'color-matching'
    | 'sequence-memory'
    | 'wire-connection'
    | 'number-sum';
  title: string;
  description: string;
  duration: number;
  successThreshold: number; // 0-1 (e.g., 0.8 = 80%)
  data: any; // Task-specific data
}

interface TaskResult {
  taskId: string;
  success: boolean;
  responses: Record<string, any>; // clientId -> response
  crewSuccessRate: number;
  moleSuccessRate: number;
}
```

## UI Layouts

### Player View

- **Lobby**: Show waiting message, player count
- **Role Reveal**: Show role card (Mole or Crew) with dramatic reveal
- **Task**: Show task UI specific to the mini-game
- **Discussion**: Show timer, list of players
- **Voting**: Show list of players to vote for
- **Results**: Show The Mole reveal, vote distribution, winner

### Host View

- **Lobby**: Player list, start game button
- **Game**: Current phase, round counter, player list with roles visible
- **Controls**: Skip phase, end game buttons

### Presenter View

- **Lobby**: QR code, player count
- **Game**: Current task description, round progress
- **Results**: The Mole reveal animation, vote results visualization

## Configuration

```yaml
# Game Settings
minPlayers: 3
maxPlayers: 10
totalRounds: 4

# Phase Durations (milliseconds)
roleRevealDuration: 5000
taskIntroDuration: 8000
taskDuration: 20000
taskResultsDuration: 5000
discussionDuration: 45000
votingDuration: 30000

# Task Settings
taskSuccessThreshold: 0.8

# UI Text
title: 'The Mole'
roleCrewTitle: 'You are a Crew Member'
roleCrewDescription: 'Work with your team to complete tasks and identify The Mole.'
roleMoleTitle: 'You are The Mole'
roleMoleDescription: 'Sabotage tasks without getting caught!'
# ... more text content
```

## Implementation Notes

- Use AI integration (`kmClient.chat`) to generate random task descriptions and variations
- Store task responses in global state for result calculation
- Use global controller to manage phase transitions based on server time
- Mole selection should be random and fair (use server timestamp for seed)
- Prevent players from joining mid-game
- Handle disconnections gracefully (remove from voting pool)
