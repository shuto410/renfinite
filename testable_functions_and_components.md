# Testable Functions and Components

This document lists all functions and components in the codebase that can be unit tested, organized by category and file location.

## 🧮 Utility Functions

### src/utils/boardUtils.ts
- **`positionToCoordinates(position: number, size: number): string`**
  - Converts board position to human-readable coordinates
  - Pure function, ideal for unit testing
  - Test cases: various positions, edge cases, different board sizes

- **`distanceFromCenter(position: number, size: number): number`**
  - Calculates Manhattan distance from center
  - Pure function, mathematical calculation
  - Test cases: center position, corners, edge positions

### src/utils/effects.ts
- **`applyBlockEffect(position: number, direction: BlockDirection, size: number): number[]`**
  - Applies block effects in different directions
  - Pure function with complex logic
  - Test cases: all directions, edge positions, out-of-bounds handling

- **`getValidBlockDirections(position: number, size: number): BlockDirection[]`**
  - Returns valid block directions for a position
  - Depends on applyBlockEffect
  - Test cases: corner positions, edge positions, center positions

- **`applyCrossDestroy(position: number, size: number): number[]`**
  - Calculates diagonal destroy targets
  - Pure function with array manipulation
  - Test cases: center, corners, edges, different board sizes

- **`applyAllDestroy(position: number, size: number): number[]`**
  - Calculates all surrounding destroy targets
  - Pure function similar to applyCrossDestroy
  - Test cases: center, corners, edges, boundary conditions

### src/utils/index.tsx
- **`calculateWinner(squares: ('X' | 'O' | null)[], size: number, winLength: number)`**
  - Core game logic for determining winner
  - Complex function with multiple winning conditions
  - Test cases: horizontal/vertical/diagonal wins, no winner, edge cases

### src/lib/utils.ts
- **`cn(...inputs: ClassValue[]): string`**
  - Utility for combining CSS class names
  - Pure function, straightforward testing
  - Test cases: various input combinations, undefined/null handling

## 🏪 Store/State Management Functions

### src/store/utils.ts
- **`resetBattle(): void`**
  - Resets all battle state
  - Side effects function, requires mocking
  - Test cases: verify all state is reset correctly

- **`generateInitialHand(deck: Card[]): {hand: Card[], remainingDeck: Card[]}`** (private function)
  - Generates initial hand from deck
  - Pure function with randomness (needs seeding for tests)
  - Test cases: empty deck, full deck, various hand sizes

### src/store/battleBoard.ts
- **`createBattleBoardSlice`** - State creator function
  - Can test individual actions and state updates
  - Test cases: state mutations, action dispatching

### src/store/magicSystem.ts
- **`createMagicSystemSlice`** - State creator function
  - Magic system state management
  - Test cases: magic selection, mana management

### src/store/moveHistory.ts
- **`createMoveHistorySlice`** - State creator function
  - Move history tracking
  - Test cases: adding moves, clearing history

### src/store/playerDeckSlice.ts
- **`createPlayerDeckSlice`** - State creator function
  - Player deck management
  - Test cases: deck modifications, card management

### src/store/stageRoute.ts
- **`createStageRouteSlice`** - State creator function
  - Stage progression logic
  - Test cases: route generation, stage completion

## 🤖 AI/Game Logic Functions

### src/hooks/useCPUOpponent.ts
- **`evaluateCell(squares, blockedSquares, position, size, winLength)`**
  - Evaluates board position for CPU strategy
  - Complex pure function with scoring logic
  - Test cases: various board states, different positions

- **`findWinningMove(squares, blockedSquares, size, winLength, cpuHand, cpuMana)`**
  - Finds moves that lead to immediate victory
  - Pure function with game state analysis
  - Test cases: winning positions, no winning moves, various magic cards

- **`findBlockingMove(squares, blockedSquares, size, winLength, cpuHand, cpuMana)`**
  - Finds moves to block opponent's victory
  - Pure function similar to findWinningMove
  - Test cases: blocking scenarios, multiple threats

- **`sortBestMagics(availableMagics: Card[]): Card[]`**
  - Sorts magic cards by priority
  - Pure function with simple sorting logic
  - Test cases: various magic combinations, empty arrays

- **`findValidPositionsForMagic(magic, squares, blockedSquares): number[]`**
  - Finds valid positions for specific magic types
  - Pure function with magic type logic
  - Test cases: all magic types, various board states

- **`findBestPositionForMagic(magic, squares, blockedSquares, size, winLength)`**
  - Finds optimal position for a specific magic
  - Complex function combining multiple evaluations
  - Test cases: different magic types, various board states

## 🎮 Custom Hooks

### src/hooks/useBattleState.ts
- **`useBattleState()`** - Custom hook
  - Battle state management logic
  - Integration testing with React Testing Library
  - Test cases: state transitions, action handling

### src/hooks/useBattleBoard.ts
- **`useBattleBoard()`** - Custom hook
  - Board state management
  - Integration testing recommended
  - Test cases: board updates, square interactions

### src/hooks/useMagicSystem.ts
- **`useMagicSystem()`** - Custom hook
  - Magic system interactions
  - Integration testing with mock store
  - Test cases: magic selection, mana consumption

## ⚛️ React Components

### Game Components
- **`Square`** (src/components/Square.tsx)
  - Individual board square component
  - Props-based rendering, click handlers
  - Test cases: different states, click interactions, visual rendering

- **`Board`** (src/components/board.tsx)
  - Main game board component
  - Grid rendering and interactions
  - Test cases: board size variations, square interactions

- **`MagicCard`** (src/components/MagicCard.tsx)
  - Magic card display and interaction
  - Props-based rendering with complex state
  - Test cases: different card types, selection states, cost display

- **`HandCards`** (src/components/HandCards.tsx)
  - Player hand display
  - Array rendering with interactions
  - Test cases: different hand sizes, card selection

- **`PlayerInfo`** (src/components/PlayerInfo.tsx)
  - Player information display
  - Simple props-based component
  - Test cases: different player states, hit points, mana

### UI Components
- **`GameStatusMessage`** (src/components/GameStatusMessage.tsx)
  - Game status display
  - Conditional rendering based on game state
  - Test cases: different game states, winner displays

- **`MoveHistory`** (src/components/MoveHistory.tsx)
  - Move history display
  - List rendering with scroll
  - Test cases: empty history, full history, move details

- **`DialogWindow`** (src/components/DialogWindow.tsx)
  - Modal dialog component
  - Props-based with conditional rendering
  - Test cases: open/close states, content rendering

### Popup Components
- **`BattleSettingPopup`** (src/components/BattleSettingPopup.tsx)
  - Battle configuration popup
  - Form interactions and settings
  - Test cases: setting changes, form validation

- **`CardSelectionPopup`** (src/components/CardSelectionPopup.tsx)
  - Card selection interface
  - Multiple selection logic
  - Test cases: card selection, confirmation actions

- **`DeckViewPopup`** (src/components/DeckViewPopup.tsx)
  - Deck viewing interface
  - List display with filtering
  - Test cases: deck display, card details

### Navigation Components
- **`RouteSelection`** (src/components/RouteSelection.tsx)
  - Route selection interface
  - Interactive route choosing
  - Test cases: route options, selection logic

- **`RouteSelectionView`** (src/components/RouteSelectionView.tsx)
  - Route visualization component
  - Complex rendering with tree generation
  - Test cases: tree generation, visual rendering

- **`genRandomTree(N: number, reverse: boolean)`** (RouteSelectionView.tsx)
  - Tree generation utility function
  - Pure function with randomness
  - Test cases: different sizes, reverse option

### Setting Components
- **`SettingButton`** (src/components/SettingButton.tsx)
  - Individual setting button
  - Simple button component
  - Test cases: click handling, visual states

- **`SettingButtons`** (src/components/setting-buttons.tsx)
  - Collection of setting buttons
  - Button group management
  - Test cases: multiple button interactions

### Deck Components
- **`DeckButton`** (src/components/DeckButton.tsx)
  - Deck interaction button
  - Simple button with state
  - Test cases: click handling, enabled/disabled states

- **`DeckView`** (src/components/DeckView.tsx)
  - Deck display component
  - Card list rendering
  - Test cases: deck display, card interactions

### Debug Components
- **`DebugOverlay`** (src/components/DebugOverlay.tsx)
  - Development debug interface
  - Complex state display and manipulation
  - Test cases: debug state changes, overlay visibility

## 📱 Page Components

### src/app/page.tsx
- **`Home`** - Main landing page
  - Navigation and game start
  - Test cases: navigation links, game initialization

### src/app/battle/page.tsx
- **`Battle`** - Main battle page
  - Game state integration
  - Test cases: game flow, state updates

### src/app/card-selection/page.tsx
- **`CardSelection`** - Card selection page
  - Deck building interface
  - Test cases: card selection, deck validation

### src/app/event/page.tsx
- **`EventPage`** - Event handling page
  - Event display and interaction
  - Test cases: event processing, user choices

### src/app/shop/page.tsx
- **`Shop`** - Shop interface page
  - Item purchasing logic
  - Test cases: purchase flow, item display

## 📊 Constants and Configuration

### src/constants/decks.ts
- **Deck configurations and magic card definitions**
  - Static data validation
  - Test cases: deck composition, card properties

## 🧪 Testing Recommendations

### High Priority for Testing (Pure Functions)
1. `calculateWinner` - Core game logic
2. All functions in `effects.ts` - Game mechanics
3. All functions in `boardUtils.ts` - Utility calculations
4. CPU opponent functions - AI logic

### Medium Priority (Components with Logic)
1. `MagicCard` - Complex state management
2. `Square` - Game interaction core
3. `Board` - Game state display
4. Route selection components

### Lower Priority (Simple Display Components)
1. `PlayerInfo` - Simple props display
2. `GameStatusMessage` - Conditional text
3. Basic UI components

### Integration Testing Candidates
1. Custom hooks with store integration
2. Page components with full game flow
3. Popup components with complex interactions

## 📝 Existing Tests
Currently, there is one test file:
- `src/__tests__/hooks/useCPUOpponent.test.ts` - Comprehensive CPU opponent testing

This provides a good example of testing patterns for the remaining untested functions and components.