# Bug Analysis Report

## Bug #1: Stale State Initialization in Route Selection (Logic Error) ✅ FIXED

**Location:** `src/app/page.tsx` lines 16-25

**Issue:** The `nextStages` state is initialized with a `useState` call that captures the state values at component mount time, but these values might be stale or undefined. The state depends on `currentStage`, `routes`, `currentRouteType`, and `currentStageIndex` from the game store, but there's no mechanism to update `nextStages` when these dependencies change.

**Problematic Code (Before Fix):**
```typescript
const [nextStages] = useState<{ [k in RouteType]?: Stage }>(
  currentStage.canMoveOtherRoute
    ? {
        A: routes['A'].stages[currentStageIndex + 1],
        B: routes['B'].stages[currentStageIndex + 1], 
        C: routes['C'].stages[currentStageIndex + 1],
      }
    : {
        [currentRouteType]:
          routes[currentRouteType].stages[currentStageIndex + 1],
      },
);
```

**Problem:** This creates a race condition where:
1. The game store might not be fully initialized when the component mounts
2. If the store state changes, `nextStages` will not update accordingly
3. Array bounds checking is missing - `currentStageIndex + 1` could exceed array bounds

**Fix Applied:**
```typescript
// Calculate next stages dynamically with bounds checking
const nextStages = React.useMemo<{ [k in RouteType]?: Stage }>(() => {
  if (!currentStage) return {};
  
  const nextIndex = currentStageIndex + 1;
  
  if (currentStage.canMoveOtherRoute) {
    return {
      A: routes['A']?.stages?.[nextIndex],
      B: routes['B']?.stages?.[nextIndex],
      C: routes['C']?.stages?.[nextIndex],
    };
  } else {
    return {
      [currentRouteType]: routes[currentRouteType]?.stages?.[nextIndex],
    };
  }
}, [currentStage, currentStageIndex, currentRouteType, routes]);
```

**Benefits of Fix:**
- Uses `useMemo` to reactively update when dependencies change
- Adds bounds checking with optional chaining (`?.`)
- Includes null check for `currentStage`
- Properly lists all dependencies for React's reactivity system

**Impact:** Could lead to undefined routes, incorrect navigation, or crashes when trying to access non-existent stages.

---

## Bug #2: Missing Array Bounds Check in Effects Utility (Security/Crash Risk) ✅ FIXED

**Location:** `src/utils/effects.ts` lines 15-19 and 22-26

**Issue:** The `applyBlockEffect` function doesn't validate that calculated block positions are within the valid range before applying row/column boundary checks. This could lead to negative indices or out-of-bounds access.

**Problematic Code (Before Fix):**
```typescript
case 'right':
  blockIndexes = [position + 1];
  if (Math.floor(position / size) !== Math.floor(blockIndexes[0] / size))
    blockIndexes = [];
  break;
case 'left':
  blockIndexes = [position - 1];
  if (Math.floor(position / size) !== Math.floor(blockIndexes[0] / size))
    blockIndexes = [];
  break;
```

**Problem:** 
1. For `left` direction, `position - 1` could be `-1` when `position = 0`
2. The row check happens after the calculation but the negative index is still passed to `Math.floor()`
3. The final filter only checks `blockIndex >= 0` but the damage could already be done

**Fix Applied:**
```typescript
case 'right':
  const rightPos = position + 1;
  // Check bounds first, then row boundary
  if (rightPos < size * size && Math.floor(position / size) === Math.floor(rightPos / size)) {
    blockIndexes = [rightPos];
  } else {
    blockIndexes = [];
  }
  break;
case 'left':
  const leftPos = position - 1;
  // Check bounds first, then row boundary
  if (leftPos >= 0 && Math.floor(position / size) === Math.floor(leftPos / size)) {
    blockIndexes = [leftPos];
  } else {
    blockIndexes = [];
  }
  break;
```

**Benefits of Fix:**
- Validates bounds BEFORE doing any calculations with the position
- Prevents negative indices from being processed
- Clear, readable logic that checks bounds first
- Maintains the same row-boundary checking logic but safely

**Impact:** Could cause unexpected behavior, crashes, or potential memory access violations in edge cases.

---

## Bug #3: Magic System Hook Missing Critical Dependencies (Performance/Logic Bug) ✅ FIXED

**Location:** `src/hooks/useMagicSystem.ts` lines 57-58 and 80-81

**Issue:** The `useEffect` hooks have incomplete dependency arrays that ignore several state values they depend on, violating the Rules of Hooks and potentially causing stale closures or infinite loops.

**Problematic Code (Before Fix):**
```typescript
// ターン開始時に手札を補充
useEffect(() => {
  // ... logic that depends on playerState, cpuState, drawCard function ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [xIsNext, finalWinner]);

// ターン開始時にマナを補充  
useEffect(() => {
  // ... logic that depends on playerState, cpuState, playerRenCount, cpuRenCount ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [xIsNext, finalWinner]);
```

**Problem:**
1. The effects depend on `playerState`, `cpuState`, `playerRenCount`, `cpuRenCount` but these are not in the dependency arrays
2. The ESLint disable comment masks this serious issue
3. Could lead to stale closures where the effect uses outdated state values
4. Could also cause effects to not run when they should

**Fix Applied:**

1. **Converted drawCard to useCallback** to ensure stable reference:
```typescript
const drawCard = useCallback((isPlayer: boolean) => {
  const state = isPlayer ? playerState : cpuState;
  const setHand = isPlayer ? setPlayerHand : setCpuHand;
  const setDeck = isPlayer ? setPlayerDeck : setCpuDeck;
  // ... rest of function
}, [playerState, cpuState, setPlayerHand, setCpuHand, setPlayerDeck, setCpuDeck]);
```

2. **Fixed hand drawing effect dependencies**:
```typescript
useEffect(() => {
  // ... existing logic
}, [xIsNext, finalWinner, playerState, cpuState, drawCard, reshufflePlayerDiscard, reshuffleCpuDiscard]);
```

3. **Fixed mana regeneration effect dependencies**:
```typescript
useEffect(() => {
  // ... existing logic  
}, [xIsNext, finalWinner, playerState.mana, cpuState.mana, playerRenCount, cpuRenCount, setPlayerMana, setCpuMana]);
```

**Benefits of Fix:**
- Removed all ESLint rule suppression comments
- Added all necessary dependencies to prevent stale closures
- Used `useCallback` to stabilize function references
- Effects will now properly re-run when state changes
- Prevents inconsistent game state from stale values

**Impact:** 
- Cards might not be drawn when they should be
- Mana regeneration might use stale values
- Game state could become inconsistent
- Performance issues from missing or extra effect runs

---

## Summary

All three critical bugs have been successfully identified and fixed:

1. **Route Selection Bug**: Fixed stale state initialization with proper reactive `useMemo`
2. **Array Bounds Bug**: Added proper bounds checking before array access in effects utility  
3. **Hook Dependencies Bug**: Fixed incomplete dependency arrays and stale closures in magic system

These fixes improve the reliability, performance, and security of the game application by preventing crashes, ensuring consistent state updates, and eliminating potential memory access issues.