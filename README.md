# The Mole 🕵️

A social deduction game built with Kokimoki SDK where players work together to complete mini-games, but one player is secretly "The Mole" trying to sabotage the team.

## 🎮 Game Overview

**The Mole** is a multiplayer party game where teamwork meets deception. Players must complete a series of cooperative tasks while trying to identify who among them is secretly working against the team.

### How to Play

1. **Join the Game**: 3-10 players scan the QR code or join via link
2. **Role Assignment**: One random player becomes The Mole (secret), others are Crew
3. **Complete Tasks**: Work together on 4 cooperative mini-games
4. **Discussion**: Talk with your team to figure out who The Mole is
5. **Vote**: Everyone votes for who they think is The Mole
6. **Results**: If the crew votes correctly, they win! Otherwise, The Mole wins!

## 🎯 Game Phases

### 1. Lobby

- Players join and enter their names
- Host can start the game when ready (minimum 3 players)

### 2. Role Reveal (5 seconds)

- Each player privately sees their role on their device
- **Crew Members**: Work together and identify The Mole
- **The Mole**: Sabotage tasks without getting caught

### 3. Task Rounds (4 rounds)

Each round has:

- **Task Introduction** (8 seconds): Learn what to do
- **Task Execution** (20 seconds): Complete the challenge
- **Task Results** (5 seconds): See if the team succeeded

### 4. Discussion (45 seconds)

- Players discuss who they think is The Mole
- No voting yet, just talking and strategizing

### 5. Voting (30 seconds)

- Everyone votes for who they think is The Mole
- Can't vote for yourself
- Results hidden until everyone votes

### 6. Game Results

- Reveal who The Mole was
- Show vote distribution
- See which tasks succeeded
- **Crew wins** if majority voted for The Mole
- **Mole wins** if they avoided detection

## 🎲 Mini-Games

### Button Timing

Tap the button when it turns green! All players must tap within the correct time window.

**Mole Strategy**: Tap too early or too late

### Color Matching

Everyone must select the same color from 4 options. Coordination is key!

**Mole Strategy**: Pick a different color than the majority

### Sequence Memory

Watch a sequence of 4 colored lights, then repeat it exactly.

**Mole Strategy**: Enter the wrong sequence

## 🎨 Game Modes

- **Host**: Controls the game, can see player roles, start/stop game
- **Player**: Mobile-first interface for playing on phones/tablets
- **Presenter**: Large screen display for TVs/projectors showing game status

## 🚀 Development

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

This will start a local development server where you can test your concept.

### Building

Build the concept for production:

```bash
npm run build
```

### Project Structure

```
src/
├── components/       # Reusable UI components
├── config/          # Game configuration
├── hooks/           # React hooks
├── layouts/         # Layout components
├── modes/           # Host, Player, Presenter apps
├── state/           # State management (stores & actions)
├── views/           # Game views/screens
│   └── tasks/      # Mini-game implementations
└── services/        # Kokimoki client setup
```

## ⚙️ Configuration

Edit `default.config.yaml` to customize:

- Number of rounds
- Phase durations
- Minimum/maximum players
- Task success thresholds
- All UI text and messages

## 🎯 Game Balance

- **Task Success Threshold**: 80% of players must complete tasks correctly
- **Total Rounds**: 4 tasks (configurable)
- **Victory Condition**: Majority vote determines winner

## 🛠️ Built With

- [Kokimoki SDK](https://kokimoki.com) - Real-time multiplayer framework
- React + TypeScript
- Valtio - State management
- Tailwind CSS - Styling
- Vite - Build tool

### Uploading to Kokimoki

To upload your concept to Kokimoki, run:

```bash
kokimoki upload
```

**Important:** Before uploading again, you must update the version in `package.json`. You can do this:

1. Using the npm version command:

   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

2. Or manually edit the `version` field in `package.json`

Uploading with the same version will fail. Always increment the version before running `kokimoki upload` again.

## 📝 License

MIT

## Learn More

Visit [kokimoki.com](https://kokimoki.com) for more information and documentation.
