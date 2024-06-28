---
title: Making a Wack-A-Molee with AnalogJs - Part 2
slug: the-wack-a-molee-pt2
otherSlug: el-wack-a-molee-pt2
description: Building a little Wack-A-Molee game using AnalogJs and Canvas - Part 2
author: Luis Castro
coverImage: v1712246484/wack-a-molee-pt2.png
date: 06-26-2024
---

## 👀The Sequel

As promised, we're now working on the sequel article for the **Wack-A-Molee** game made with Analog. Like Terminator 2, The Dark Knight, or Spider-Man 2, I hope this sequel is better than the first part. So, let's get started and look at the code. In this second part, we'll explore the project structure, integrate the component built in the first part, and finally, we'll play a little game!

At the end we should have something like this:

<p style="display:flex; flex-direction:row; gap:1rem; flex-wrap: wrap; justify-content:center; align-items:center">
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee1.png" 
        alt="Wack-a-Molee game, background with grass and a fence, a little animated mole, title Wack-a-Mole and Play button" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee2.png" 
        alt="Wack-a-Molee game, little wholes in the grass with one mole popping, with score on top, time bar, level, pause button and health bar" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee-pause.png" 
        alt="Wack-a-Molee game, game paused, big blue square in the middle with the phrase Game Paused, Ready? buttons to refresh and continue" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee-gameover.png" 
        alt="Wack-a-Molee game, game paused, big blue square in the middle with the phrase Game Over, button to restart" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee-clear.png" 
        alt="Wack-a-Molee game, game paused, big blue square in the middle with the phrase Cleared and the score, buttons to refresh and continue" />
</p>

> **Note**: No moles were hurt as part of this project.

## 🐨Wack-a-Molee THE SEQUEL!!

Let's start where we left off. In the first part, I showed the initial challenge in building the game: the lack of a library for animating the sprite, at least one with a user-friendly approach like the one used in the React Native app. I demonstrated how I solved the issue, and there's a little StackBlitz project to play around with and get familiar with the code. Constructive feedback is welcome; we're all here to learn. If you haven't seen it yet, check out [part 1](https://mrrobot.dev/blog/the-wack-a-molee-pt1).

### Project Structure

The Analog project has a simple structure. If you know Analog, you should be familiar with the pages folder that controls the routing. If you don't, what are you waiting for? Give it a try! In my case, I'm using an Nx project (personal preference), so the structure might look a little different, but essentially it is the same as any other Analog project.

```shell
.
├── README.md
├── game
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── project.json
│   ├── src
│   │   ├── app
│   │   │   ├── app.component.spec.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.server.ts
│   │   │   ├── app.config.ts
│   │   │   ├── components
│   │   │   │   ├── animated-sprite.component.ts
│   │   │   │   ├── clear-level.component.ts
│   │   │   │   ├── game-container.component.ts
│   │   │   │   ├── game-over.component.ts
│   │   │   │   ├── health-bar.component.ts
│   │   │   │   ├── level.component.ts
│   │   │   │   ├── mole.component.ts
│   │   │   │   ├── pause.component.ts
│   │   │   │   ├── score.component.ts
│   │   │   │   ├── timer.component.ts
│   │   │   │   ├── toggle-button.component.ts
│   │   │   │   └── welcome.component.ts
│   │   │   └── pages
│   │   │       ├── (home).page.ts
│   │   │       └── game.page.ts
│   │   ├── main.server.ts
│   │   ├── main.ts
│   │   ├── styles.scss
│   │   ├── test-setup.ts
│   │   └── vite-env.d.ts
│   ├── tailwind.config.cjs
│   ├── tsconfig.app.json
│   ├── tsconfig.editor.json
│   ├── tsconfig.json
│   ├── tsconfig.spec.json
│   └── vite.config.ts
├── nx.json
├── package.json
├── pnpm-lock.yaml
└── tsconfig.base.json
```

Let's dig a little bit on the core aspects of the project

## 🧠 Core

The heart and brain of the app will be inside components. Pages will only serve the purpose of routing to the place we want to be. With that in mind, let's describe the components based on the structure of the game image we just saw.

- **animated-sprite.component**: If you read part 1, then you probably already know about this one, but if not, let me give you a clue. This is the **CORE** of the core, so it's the one in charge of the animations.
- **clear-level.component**: This one will show the pretty image that lets the user know they cleared the level.
- **game-container.component**: This one is in charge of putting everything together and is also the owner of the logic that makes everything work. We will talk about that later.
- **game-over.component**: Kind of self-explanatory but is in charge of telling you that you lost.
- **health-bar.component**: This one will show you the health bar and will make it fill or get empty.
- **level.component**: This one is in charge of telling you that you go to the next level, YEI!!.
- **mole.component**: This one, as the name says, is in charge of handling the mole and the different states the mole might have:
  - **Popping**: When the mole simply pops.
  - **Idle**: You only see the hole.
  - **Hiding**: Well this one explain itself, is the mole hiding.
  - **Dizzy**: If you hit the mole at the proper time it will get "dizzy".
  - **Faint**: This happens after getting dizzy.
  - **Attack**: If the mole is angry enough it will attack to try to make you lose health.
  - **Heal**: Mole will transform into a some sort of x-men sentinel and if you hit it it will heal you (if you have any dagame)
- **pause.component**: It presents the paused screen.
- **score.component**: The little score bar.
- **timer.component**: The timer bar.
- **toggle-button.component**: the pause button.
- **welcome.component**: the initial screen.

I hope i'm not missing anything but pretty much these are the **CORE** elements I'll use to build this thing.

## 🧩Building the Pieces

### Game Container

Let's start with the **BOSS** the one that will give the orders here and will handle all the state changes in the game, it looks like this:

```typescript
const DEFAULT_TIME = 30;

interface GameState {
  level: number;
  score: number;
  time: number;
  cleared: boolean;
  paused: boolean;
  gameOver: boolean;
  health: number;
  molesAllowed: number;
  damage: number;
}

const DEFAULT_STATE: GameState = {
  level: 1,
  score: 0,
  time: DEFAULT_TIME,
  cleared: false,
  paused: false,
  gameOver: false,
  health: 100,
  molesAllowed: 3,
  damage: 5,
};

@Component({
  selector: 'game-container',
  standalone: true,
  imports: [
    MoleComponent,
    LevelComponent,
    TimerComponent,
    ScoreComponent,
    ToggleButtonComponent,
    HealthBarComponent,
    ClearLevelComponent,
    GameOverComponent,
    PauseComponent,
  ],
  template: `<div class="container flex h-[100dvh] flex-col items-center">
    <div
      class="flex w-full flex-1 flex-col bg-[url('/img/background.png')] bg-cover bg-no-repeat md:w-[650px]">
      <div
        class="flex basis-[200px] flex-col content-center gap-4 px-6 pb-2 pt-12">
        <div class="flex flex-row items-center gap-[4px] md:gap-6">
          <game-level [level]="state().level" />
          <game-timer [time]="state().time" />
          <game-score [score]="state().score" />
          <game-toggle-button (click)="state().paused ? resume() : pause()" />
        </div>
        <div class="flex flex-row items-center justify-center">
          <game-health-bar [health]="state().health" />
        </div>
      </div>
      <div
        class="relative grid cursor-[url('/img/hammer.png'),_auto] grid-cols-[repeat(3,_minmax(110px,_1fr))] items-center justify-items-center gap-4 px-4 py-0 md:grid-cols-[repeat(3,_minmax(140px,_1fr))]">
        @for (mole of moles(); track $index) {
          <game-mole
            #moleComponent
            (finishPopping)="onFinishPopping()"
            (damageReceived)="onDamage()"
            (moleHealing)="onHeal()"
            (takeScore)="onScore()"
            [frameWidth]="moleWidth()" />
        }
      </div>
    </div>
    @if (state().cleared) {
      <game-clear-level
        [score]="state().score"
        [level]="state().level"
        (nextLevel)="nextLevel()"
        (reset)="reset()" />
    }
    @if (state().gameOver) {
      <game-game-over
        [score]="state().score"
        [level]="state().level"
        (reset)="reset()" />
    }
    @if (state().paused) {
      <game-pause (reset)="reset()" (resume)="resume()" />
    }
  </div>`,
  styles: `
    :host {
      @apply flex flex-col items-center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameContainerComponent implements OnDestroy {
  moleComponents = viewChildren<MoleComponent>('moleComponent');
  private moleIntervalSubscription!: Subscription;
  private timerIntervalSubscription!: Subscription;
  moleQty = 12;
  moleWidth = signal(0);
  moles = signal<Array<number>>(Array.from({ length: this.moleQty }));
  molesPopping = 0;
  state = signal<GameState>({ ...DEFAULT_STATE });
  #responsive = inject(BreakpointObserver);
  private timeConditionMet = false;

  constructor() {
    this.#responsive.observe([Breakpoints.Handset]).subscribe({
      next: result => {
        if (result.matches) {
          this.moleWidth.set(100);
        } else {
          this.moleWidth.set(0);
        }
      },
    });

    afterNextRender(() => {
      this.setupTicks();
    });
  }

  setupTicks() {
    let speed = 750 - this.state().level * 50;
    if (speed < 350) {
      speed = 350;
    }

    this.clearIntervals();

    this.moleIntervalSubscription = interval(speed).subscribe({
      next: () => {
        this.popRandomMole();
      },
    });

    this.timerIntervalSubscription = interval(1000).subscribe({
      next: () => {
        this.timerTick();
      },
    });
  }

  clearIntervals() {
    if (this.moleIntervalSubscription) {
      this.moleIntervalSubscription.unsubscribe();
    }
    if (this.timerIntervalSubscription) {
      this.timerIntervalSubscription.unsubscribe();
    }
  }

  randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  onFinishPopping(): void {
    this.molesPopping -= 1;
  }

  popRandomMole(): void {
    const molesArray = this.moleComponents();
    if (molesArray.length !== this.moleQty) {
      return;
    }

    const randomIndex = this.randomBetween(0, this.moleQty - 1);
    const mole = molesArray[randomIndex];
    if (!mole.isAppearing && this.molesPopping < this.state().molesAllowed) {
      this.molesPopping += 1;
      mole.pop();
    }
  }

  popAllMoles(): void {
    const molesArray = this.moleComponents();
    for (let i = 0; i < this.state().molesAllowed; i++) {
      if (this.molesPopping < 3) {
        this.molesPopping += 1;
        molesArray[i].pop();
      }
    }
  }

  timerTick(): void {
    if (this.state().time === 0) {
      this.clearIntervals();
      if (this.state().score > 0) {
        this.state.update(state => ({ ...state, cleared: true }));
      } else {
        this.gameOver();
      }
    } else {
      this.state.update(state => ({ ...state, time: (state.time -= 1) }));

      // Check if time is less than 30% of the full time and the condition has not been met
      if (!this.timeConditionMet && this.state().time < 0.3 * DEFAULT_TIME) {
        this.state.update(state => ({ ...state, molesAllowed: 4 }));
        this.popAllMoles();
        this.timeConditionMet = true;
      }
    }
  }

  reset() {
    this.molesPopping = 0;
    this.timeConditionMet = false;
    this.state.update(() => ({ ...DEFAULT_STATE }));
    this.setupTicks();
  }

  pause() {
    this.clearIntervals();
    this.state.update(state => ({ ...state, paused: true }));
  }

  resume() {
    this.molesPopping = 0;
    this.state.update(state => ({ ...state, paused: false }));
    this.setupTicks();
  }

  nextLevel() {
    this.molesPopping = 0;
    this.timeConditionMet = false;
    this.state.update(state => ({
      ...state,
      level: (state.level += 1),
      cleared: false,
      gameOver: false,
      time: DEFAULT_TIME,
      molesAllowed: 3,
    }));
    this.setupTicks();
  }

  onScore() {
    this.state.update(state => ({ ...state, score: (state.score += 1) }));
  }

  onDamage() {
    if (this.state().cleared || this.state().gameOver || this.state().paused) {
      return;
    }

    const targetHealth =
      this.state().health - this.state().damage < 0
        ? 0
        : this.state().health - this.state().damage;

    this.state.update(state => ({ ...state, health: targetHealth }));

    if (targetHealth <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.clearIntervals();
    this.timeConditionMet = false;
    this.state.update(state => ({ ...state, gameOver: true }));
  }

  onHeal() {
    this.state.update(state => ({
      ...state,
      health: state.health + 10 > 100 ? 100 : state.health + 10,
    }));
  }

  ngOnDestroy() {
    this.clearIntervals();
  }
}
```

I know, kind of big, I might end up doing part 3 of the series 🤔, but anyway let's check what's happening here.

#### Step 1: Define Constants and Interface

```typescript
const DEFAULT_TIME = 30; // Default time for each game level in seconds

interface GameState {
  level: number; // Current level of the game
  score: number; // Current score of the player
  time: number; // Remaining time for the current level
  cleared: boolean; // Indicates if the level is cleared
  paused: boolean; // Indicates if the game is paused
  gameOver: boolean; // Indicates if the game is over
  health: number; // Player's health
  molesAllowed: number; // Number of moles allowed to appear simultaneously
  damage: number; // Damage taken by the player when missing a mole
}

// Initial state of the game
const DEFAULT_STATE: GameState = {
  level: 1,
  score: 0,
  time: DEFAULT_TIME,
  cleared: false,
  paused: false,
  gameOver: false,
  health: 100,
  molesAllowed: 3,
  damage: 5,
};
```

We start by defining constants and an interface for the game state. `DEFAULT_TIME` sets the initial time for each game level. The `GameState` interface outlines the structure of the state object, and `DEFAULT_STATE` initializes the default values for a new game.

#### Step 2: Component State and Dependencies

```typescript
export class GameContainerComponent implements OnDestroy {
  moleComponents = viewChildren<MoleComponent>('moleComponent'); // Reference to all mole components
  private moleIntervalSubscription!: Subscription; // Subscription for mole popping intervals
  private timerIntervalSubscription!: Subscription; // Subscription for the game timer
  moleQty = 12; // Total number of mole positions
  moleWidth = signal(0); // Width of the mole (responsive design)
  moles = signal<Array<number>>(Array.from({ length: this.moleQty })); // Array representing moles
  molesPopping = 0; // Count of currently popping moles
  state = signal<GameState>({ ...DEFAULT_STATE }); // Game state signal
  #responsive = inject(BreakpointObserver); // Injecting breakpoint observer for responsive design
  private timeConditionMet = false; // Condition to check if special time condition is met

  constructor() {
    // Setup responsive behavior for mole width
    this.#responsive.observe([Breakpoints.Handset]).subscribe({
      next: result => {
        if (result.matches) {
          this.moleWidth.set(100); // Set mole width for handset view
        } else {
          this.moleWidth.set(0); // Reset mole width for other views
        }
      },
    });

    // Setup game ticks after the next render
    afterNextRender(() => {
      this.setupTicks();
    });
  }
```

The class maintains the game state, mole components, and various signals and subscriptions for handling game logic. The constructor sets up responsive behavior and initializes game ticks after the next render.

#### Step 3: Setup and Clear Intervals

```typescript
setupTicks()
{
  let speed = 750 - this.state().level * 50; // Calculate speed based on level
  if (speed < 350) {
    speed = 350; // Minimum speed threshold
  }

  this.clearIntervals(); // Clear existing intervals

  // Setup interval for popping moles
  this.moleIntervalSubscription = interval(speed).subscribe({
    next: () => {
      this.popRandomMole();
    },
  });

  // Setup interval for game timer
  this.timerIntervalSubscription = interval(1000).subscribe({
    next: () => {
      this.timerTick();
    },
  });
}

clearIntervals()
{
  if (this.moleIntervalSubscription) {
    this.moleIntervalSubscription.unsubscribe(); // Unsubscribe mole interval
  }
  if (this.timerIntervalSubscription) {
    this.timerIntervalSubscription.unsubscribe(); // Unsubscribe timer interval
  }
}
```

`setupTicks` initializes intervals for popping moles and updating the timer based on the current level. `clearIntervals` clears any active subscriptions to avoid memory leaks.

#### Step 4: Game Logic Methods

```typescript
randomBetween(min
:
number, max
:
number
):
number
{
  return Math.floor(Math.random() * (max - min + 1) + min); // Generate random number between min and max
}

onFinishPopping()
:
void {
  this.molesPopping -= 1; // Decrement the count of currently popping moles
}

popRandomMole()
:
void {
  const molesArray = this.moleComponents();
  if(molesArray.length !== this.moleQty
)
{
  return; // Ensure the moles array is correctly sized
}

const randomIndex = this.randomBetween(0, this.moleQty - 1); // Pick a random mole
const mole = molesArray[randomIndex];
if (!mole.isAppearing && this.molesPopping < this.state().molesAllowed) {
  this.molesPopping += 1; // Increment the count of currently popping moles
  mole.pop(); // Trigger the mole to pop up
}
}

popAllMoles()
:
void {
  const molesArray = this.moleComponents();
  for(let i = 0; i < this.state().molesAllowed; i++
)
{
  if (this.molesPopping < 3) {
    this.molesPopping += 1; // Increment the count of currently popping moles
    molesArray[i].pop(); // Trigger the mole to pop up
  }
}
}
```

These methods handle the random selection of moles, popping them, and managing the count of currently popping moles.

#### Step 5: Timer Tick Method

```typescript
timerTick()
:
void {
  if(this.state().time === 0
)
{
  this.clearIntervals(); // Clear intervals when time is up
  if (this.state().score > 0) {
    this.state.update(state => ({ ...state, cleared: true })); // Mark level as cleared if score is positive
  } else {
    this.gameOver(); // Trigger game over if score is zero
  }
}
else
{
  this.state.update(state => ({ ...state, time: (state.time -= 1) })); // Decrement the timer

  // Increase moles allowed when time is less than 30% and condition has not been met
  if (!this.timeConditionMet && this.state().time < 0.3 * DEFAULT_TIME) {
    this.state.update(state => ({ ...state, molesAllowed: 4 }));
    this.popAllMoles(); // Pop all moles when condition is met
    this.timeConditionMet = true; // Mark the condition as met
  }
}
}
```

`timerTick` updates the game timer, checks if the time is up, and handles the logic for clearing the level or triggering game over. It also increases the allowed moles when the time condition is met.

#### Step 6: Game Control Methods

```typescript
reset()
{
  this.molesPopping = 0;
  this.timeConditionMet = false;
  this.state.update(() => ({ ...DEFAULT_STATE })); // Reset the game state
  this.setupTicks(); // Setup intervals again
}

pause()
{
  this.clearIntervals(); // Clear intervals when paused
  this.state.update(state => ({ ...state, paused: true })); // Mark game as paused
}

resume()
{
  this.molesPopping = 0;
  this.state.update(state => ({ ...state, paused: false })); // Mark game as resumed
  this.setupTicks(); // Setup intervals again
}

nextLevel()
{
  this.molesPopping = 0;
  this.timeConditionMet = false;
  this.state.update(state => ({
    ...state,
    level: (state.level += 1), // Increment level
    cleared: false,
    gameOver: false,
    time: DEFAULT_TIME, // Reset time for new level
    molesAllowed: 3, // Reset moles allowed
  }));
  this.setupTicks(); // Setup intervals again
}

onScore()
{
  this.state.update(state => ({ ...state, score: (state.score += 1) })); // Increment score
}

onDamage()
{
  if (this.state().cleared || this.state().gameOver || this.state().paused) {
    return; // Do nothing if game is cleared, over, or paused
  }

  const targetHealth =
    this.state().health - this.state().damage < 0
      ? 0
      : this.state().health - this.state().damage; // Calculate new health

  this.state.update(state => ({ ...state, health: targetHealth })); // Update health

  if (targetHealth <= 0) {
    this.gameOver(); // Trigger game over if health is zero
  }
}

gameOver()
{
  this.clearIntervals(); // Clear intervals when game is over
  this.timeConditionMet = false;
  this.state.update(state => ({ ...state, gameOver: true })); // Mark game as over
}

onHeal()
{
  this.state.update(state => ({
    ...state,
    health: state.health + 10 > 100 ? 100 : state.health + 10, // Heal the player
  }));
}
```

These methods control the game's state transitions, such as resetting, pausing, resuming, progressing to the

next level, and handling scoring, damage, and healing.

#### Step 7: Cleanup on Destroy

```typescript
ngOnDestroy()
{
  this.clearIntervals(); // Clear intervals to prevent memory leaks
}
```

Finally, `ngOnDestroy` ensures that intervals are cleared when the component is destroyed to prevent memory leaks.

---

### 🐨The mole (since there's no proper mole emoji we will use a koala, don't judge me).

In order to make everything work we need the one element that will provide the name to this game, yeah you know, **The Mole** and it looks like this:

```typescript
@Component({
  selector: 'game-mole',
  standalone: true,
  imports: [AnimatedSpriteComponent],
  template: ` <game-animated-sprite
    (click)="whack()"
    #mole
    [animations]="animations"
    [columns]="6"
    [rows]="8"
    [imgSrc]="'/img/sprites.png'"
    [initialFrame]="0"
    [frameWidth]="frameWidth()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoleComponent {
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accesses the AnimatedSpriteComponent
  finishPopping = output({ alias: 'finishPopping' }); // Emits when popping is finished
  damage = output({ alias: 'damageReceived' });
  score = output({ alias: 'takeScore' });
  heal = output({ alias: 'moleHealing' });
  frameWidth = input(0);

  animations = {
    idle: [0],
    appear: [1, 2, 3, 4],
    hide: [4, 3, 2, 1, 0],
    dizzy: [36, 37, 38],
    faint: [42, 43, 44, 0],
    attack: [11, 12, 13, 14, 15, 16],
    heal: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  };

  isAppearing = false;
  isFeisty = false;
  isHealing = false;
  isWhacked = false;
  isAttacking = false;
  isHiding = false;

  private subscriptions: Subscription[] = []; // Store all subscriptions

  // Initiates the mole popping sequence
  pop() {
    this.resetStates(); // Reset all states to ensure a clean start
    this.isAppearing = true;

    // Determine if the mole is feisty or healing
    this.isFeisty = Math.random() < 0.5;
    this.isHealing = !this.isFeisty && Math.random() < 0.08;

    // Play the appropriate animation based on the mole's state
    if (this.isHealing) {
      this.mole()?.play('heal', 24, () => {
        this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
      });
    } else {
      this.mole()?.play('appear', 24, () => {
        // If the mole is feisty and hasn't been whacked, it will attack
        if (this.isFeisty && !this.isWhacked) {
          this.subscriptions.push(
            timer(600).subscribe(() => {
              if (!this.isWhacked) {
                this.isAttacking = true;
                this.mole()?.play('attack', 13, () => {
                  this.damage.emit();
                  this.hideMole();
                });
              }
            })
          );
        } else {
          // Otherwise, the mole will hide after a delay
          this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
        }
      });
    }
  }

  // Handles the whack event
  whack() {
    // Only whack if the mole is appearing and not already whacked or attacking
    if (!this.isAppearing || this.isWhacked || this.isAttacking) return;

    this.isWhacked = true;
    this.isFeisty = false;
    this.score.emit();
    if (this.isHealing) this.heal.emit();

    // Play the dizzy and faint animations upon whack
    this.mole()?.play('dizzy', 24, () => {
      this.mole()?.play('faint', 24, () => {
        this.isAppearing = false;
        this.finishPopping.emit();
      });
    });
  }

  // Hides the mole
  hideMole() {
    // Only hide if not already hiding
    if (this.isHiding) return;
    this.isHiding = true;
    this.mole()?.play('hide', 24, () => {
      this.isAppearing = false;
      this.finishPopping.emit();
    });
  }

  // Resets all state flags
  resetStates() {
    this.isWhacked = false;
    this.isAttacking = false;
    this.isHiding = false;
    this.isHealing = false;
    this.clearSubscriptions(); // Clear all subscriptions
  }

  // Clear all subscriptions
  clearSubscriptions() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
```

Let's now dig a little bit inside the code:

#### Step 1: Define Component Properties and Outputs

```typescript
export class MoleComponent {
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Access the AnimatedSpriteComponent
  finishPopping = output({ alias: 'finishPopping' }); // Emits when popping is finished
  damage = output({ alias: 'damageReceived' }); // Emits when the mole deals damage
  score = output({ alias: 'takeScore' }); // Emits when the mole is whacked for points
  heal = output({ alias: 'moleHealing' }); // Emits when the mole heals the player
  frameWidth = input(0); // Width of the mole frame

  animations = {
    idle: [0],
    appear: [1, 2, 3, 4],
    hide: [4, 3, 2, 1, 0],
    dizzy: [36, 37, 38],
    faint: [42, 43, 44, 0],
    attack: [11, 12, 13, 14, 15, 16],
    heal: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  };

  isAppearing = false;
  isFeisty = false;
  isHealing = false;
  isWhacked = false;
  isAttacking = false;
  isHiding = false;

  private subscriptions: Subscription[] = []; // Store all subscriptions
```

We define properties to manage the mole's state and animations. The outputs are events that the mole emits to inform the parent component about its actions.

#### Step 2: Mole Popping Logic

```typescript
  // Initiates the mole popping sequence
pop()
{
  this.resetStates(); // Reset all states to ensure a clean start
  this.isAppearing = true;

  // Determine if the mole is feisty or healing
  this.isFeisty = Math.random() < 0.5;
  this.isHealing = !this.isFeisty && Math.random() < 0.08;

  // Play the appropriate animation based on the mole's state
  if (this.isHealing) {
    this.mole()?.play('heal', 24, () => {
      this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
    });
  } else {
    this.mole()?.play('appear', 24, () => {
      // If the mole is feisty and hasn't been whacked, it will attack
      if (this.isFeisty && !this.isWhacked) {
        this.subscriptions.push(
          timer(600).subscribe(() => {
            if (!this.isWhacked) {
              this.isAttacking = true;
              this.mole()?.play('attack', 13, () => {
                this.damage.emit();
                this.hideMole();
              });
            }
          })
        );
      } else {
        // Otherwise, the mole will hide after a delay
        this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
      }
    });
  }
}
```

The `pop` method initiates the mole's popping sequence, determining whether the mole is feisty or healing and playing the appropriate animation. It uses timers to manage the sequence of events.

#### Step 3: Handling the Whack Event

```typescript
  // Handles the whack event
whack()
{
  // Only whack if the mole is appearing and not already whacked or attacking
  if (!this.isAppearing || this.isWhacked || this.isAttacking) return;

  this.isWhacked = true;
  this.isFeisty = false;
  this.score.emit(); // Emit score event
  if (this.isHealing) this.heal.emit(); // Emit heal event if mole is healing

  // Play the dizzy and faint animations upon whack
  this.mole()?.play('dizzy', 24, () => {
    this.mole()?.play('faint', 24, () => {
      this.isAppearing = false;
      this.finishPopping.emit(); // Emit finishPopping event
    });
  });
}
```

The `whack` method handles the event when the player clicks on the mole. It plays the appropriate animations and emits events based on the mole's state.

#### Step 4: Hiding the Mole

```typescript
  // Hides the mole
hideMole()
{
  // Only hide if not already hiding
  if (this.isHiding) return;
  this.isHiding = true;
  this.mole()?.play('hide', 24, () => {
    this.isAppearing = false;
    this.finishPopping.emit(); // Emit finishPopping event
  });
}
```

The `hideMole` method hides the mole, playing the hide animation and emitting the `finishPopping` event.

#### Step 5: Resetting States and Clearing Subscriptions

```typescript
  // Resets all state flags
resetStates()
{
  this.isWhacked = false;
  this.isAttacking = false;
  this.isHiding = false;
  this.isHealing = false;
  this.clearSubscriptions(); // Clear all subscriptions
}

// Clear all subscriptions
clearSubscriptions()
{
  this.subscriptions.forEach(sub => sub.unsubscribe());
  this.subscriptions = [];
}
}
```

The `resetStates` method resets all state flags to their default values, and `clearSubscriptions` unsubscribes from all active subscriptions to avoid memory leaks.

### 🥹 Don't forget about the others

We're still missing some components like the score, toggle, timer, clear, and gameover, but these components are pretty much shells and share some behavior between them (at least the clear and gameover). So, let's dive into some of them and then we will share the final product.

The Clear component looks something like this:

```ts
@Component({
  selector: 'game-clear-level',
  standalone: true,
  template: `<div class="clear-screen">
    <div class="cleared-level-container">
      <span class="cleared-level-text">Level</span>
      <span class="cleared-level-text">{{ level() }}</span>
    </div>

    <div class="panel">
      <span class="panel-title">Cleared</span>
      <span class="panel-text">Score: {{ score() }}</span>

      <div class="panel-buttons-container">
        <button class="panel-button" (click)="reset.emit()">
          <img
            class="panel-button-icon"
            [src]="'/img/icon_restart.png'"
            alt="Restart Icon" />
        </button>
        <button class="panel-button" (click)="nextLevel.emit()">
          <img
            class="panel-button-icon"
            [src]="'/img/icon_play.png'"
            alt="Play Icon" />
        </button>
      </div>
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearLevelComponent {
  level = input.required<number>();
  score = input.required<number>();
  nextLevel = output();
  reset = output();
}
```

As you can see is just an egg-shell that receives some data and emits some data, the **GameOver** have similar behavior.

Now let's check the score and the health-bar:

```ts
@Component({
  selector: 'game-score',
  standalone: true,
  template: `<img
      class="absolute left-0 z-[2] h-10 w-10 md:h-12 md:w-12"
      src="/img/icon_score.png"
      alt="Score icon, a tiny golden coin" />
    <div
      class="absolute left-[20px] right-[5px] flex h-6 max-w-[8rem] items-center justify-center rounded-[13px] bg-white text-[0.8rem] md:text-[1rem]">
      {{ score() }}
    </div>`,
  styles: `
    :host {
      @apply relative flex flex-1 items-center justify-center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  score = input.required<number>();
}
```

The score is pretty much the same, it presents some data that depends on the input that receives.

```ts
@Component({
  selector: 'game-health-bar',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="ml-[4px] mt-[1px] h-6 w-full rounded-[10px] bg-white">
      <div
        class="absolute ml-[4px] h-6 rounded-[10px] bg-[#ff1a1a]"
        [style.width.%]="health()"></div>
    </div>
    <img
      src="/img/icon_health.png"
      alt="Health icon, a red hearth"
      class="absolute left-0 top-[-7px] h-10 w-12" /> `,
  styles: `
    :host {
      @apply relative flex-1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthBarComponent {
  health = input.required<number>();
}
```

Pretty much all the remaining components are the same, an egg-shell with some data to present (properly styled I hope).

### 🎮 The Initial Screen and To Play

Finally i wanted to provide a little initial screen so you can mentally prepare yourself to hit some moles so here I go.

```ts
@Component({
  selector: 'game-welcome',
  standalone: true,
  imports: [RouterLink, AnimatedSpriteComponent],
  template: `<div class="container flex flex-col items-center">
    <div
      class="flex h-[100dvh] w-[650px] flex-col items-center justify-center gap-5 bg-[url('/img/background.png')] bg-cover">
      <span class="text-shadow text-6xl">Wack-A-Mole</span>
      <game-animated-sprite
        [animations]="animations"
        [columns]="6"
        [rows]="8"
        [imgSrc]="'/img/sprites.png'"
        #mole />
      <button
        routerLink="/game"
        type="button"
        class="flex flex-row items-center justify-center gap-4">
        <span class="text-shadow text-6xl">Play</span>
        <div
          class="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border-white bg-[#ff1a1a]">
          <img src="/img/icon_play.png" alt="Play Icon" class="w-4" />
        </div>
      </button>
    </div>
  </div>`,
  styles: `
    :host {
      @apply flex flex-col items-center;
    }

    .text-shadow {
      text-shadow:
        -1px -1px 0 #fff,
        1px -1px 0 #fff,
        -1px 1px 0 #fff,
        1px 1px 0 #fff;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements AfterViewInit {
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accesses the AnimatedSpriteComponent

  animations = {
    idle: [0],
    appear: [1, 2, 3, 4],
    hide: [4, 3, 2, 1, 0],
    dizzy: [36, 37, 38],
    faint: [42, 43, 44, 0],
    attack: [11, 12, 13, 14, 15, 16],
    heal: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  };

  private mainAnimations = ['attack', 'dizzy', 'heal', 'appear'];

  ngAfterViewInit(): void {
    this.startSequence();
  }

  startSequence(): void {
    this.playRandomAnimation();
  }

  playRandomAnimation(): void {
    const nextAnimation = this.getRandomAnimation();
    this.playAnimation(nextAnimation);
  }

  playAnimation(mainAnimation: string): void {
    this.mole()?.play(mainAnimation, 12, () => {
      timer(1000).subscribe(() => {
        this.playHideAnimation();
      });
    });
  }

  playHideAnimation(): void {
    this.mole()?.play('hide', 12, () => {
      timer(1000).subscribe(() => {
        this.playRandomAnimation();
      });
    });
  }

  getRandomAnimation(): string {
    const randomIndex = Math.floor(Math.random() * this.mainAnimations.length);
    return this.mainAnimations[randomIndex];
  }
}
```

As you can see welcome have a little more logic so let's check what is this thing doing.

#### Step 1: Define Component Properties and Outputs

```typescript
export class WelcomeComponent implements AfterViewInit {
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accesses the AnimatedSpriteComponent

  animations = {
    idle: [0],
    appear: [1, 2, 3, 4],
    hide: [4, 3, 2, 1, 0],
    dizzy: [36, 37, 38],
    faint: [42, 43, 44, 0],
    attack: [11, 12, 13, 14, 15, 16],
    heal: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  };

  private mainAnimations = ['attack', 'dizzy', 'heal', 'appear']; // Main animations for the mole
```

We define properties for managing the mole's animations and a list of main animations to randomly play. The `mole` property is used to access the `AnimatedSpriteComponent`.

#### Step 2: Implement Lifecycle Hook and Animation Sequence

```typescript
  ngAfterViewInit()
:
void {
  this.startSequence();
}

startSequence()
:
void {
  this.playRandomAnimation();
}
```

The `ngAfterViewInit` lifecycle hook initializes the animation sequence after the component's view has been initialized. `startSequence` begins the sequence by playing a random animation.

#### Step 3: Random Animation Logic

```typescript
  playRandomAnimation()
:
void {
  const nextAnimation = this.getRandomAnimation();
  this.playAnimation(nextAnimation);
}

playAnimation(mainAnimation
:
string
):
void {
  this.mole()?.play(mainAnimation, 12, () => {
    timer(1000).subscribe(() => {
      this.playHideAnimation();
    });
  });
}

playHideAnimation()
:
void {
  this.mole()?.play('hide', 12, () => {
    timer(1000).subscribe(() => {
      this.playRandomAnimation();
    });
  });
}

getRandomAnimation()
:
string
{
  const randomIndex = Math.floor(Math.random() * this.mainAnimations.length);
  return this.mainAnimations[randomIndex];
}
}
```

- `playRandomAnimation`: Chooses a random animation from the main animations list and plays it.
- `playAnimation`: Plays the selected animation at 12 frames per second. Once the animation completes, it sets a timer to play the hide animation.
- `playHideAnimation`: Plays the hide animation. Once it completes, it sets a timer to play another random animation.
- `getRandomAnimation`: Returns a random animation from the `mainAnimations` list.

Finally the **Wack-A-Molee** is done and you can play around with it in here:

[Wack-A-Molee Game](https://analog-wack-a-mole.vercel.app/) and the code if you want to fork or star or something... [github repo](https://github.com/luishcastroc/analog-wack-a-mole)

## 🌟 Conclusion: Wrapping Up Part 2

We did it 🎉! We built the game, or at least something functional. We used Signals, Signal inputs, Signal Queries, Signal outputs, and SFC. We also built a component to reuse for little sprite sheet animations. I hope this article helped you get some inspiration. Let's see what I can try to build next!

---

If you found this article insightful, don't hesitate to connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Let's embark on this journey of discovery and innovation together! 💻🚀📘

Feeling generous? Show some love and [buy me a coffee](https://www.buymeacoffee.com/luishcastrv). Your support is greatly cherished! ☕️
