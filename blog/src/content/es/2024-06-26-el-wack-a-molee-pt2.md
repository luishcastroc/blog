---
title: Haciendo un Wack-A-Molee con AnalogJs - Parte 2
slug: el-wack-a-molee-pt2
otherSlug: the-wack-a-molee-pt2
description: Haciendo un pequeño juego de Wack-A-Molee usando AnalogJs y Canvas - Parte 2
author: Luis Castro
coverImage: v1712246484/wack-a-molee-pt2.png
date: 06-26-2024
---

## 👀La Secuela

Como lo prometí, ahora trabajaremos en la secuela del artículo en el que codeamos el juego **Wack-A-Molee** hecho con Analog. Así como Terminator 2, The Dark Knight o Spider-Man 2, espero esta secuela sea mejor que la primera parte. Así que, empecemos mirando el código. En esta segunda parte, exploraremos la estructura del proyecto, integraremos el componente que construimos en la parte 1, y finalmente, jugaremos nuestro pequeño juego!

Cuando lo terminemos tendremos algo como esto:

<p style="display:flex; flex-direction:row; gap:1rem; flex-wrap: wrap; justify-content:center; align-items:center">
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee1.png" 
        alt="Juego Wack-a-Molee, fondo con césped y una cerca, un pequeño topo animado, título Wack-a-Mole y botón de jugar" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee2.png" 
        alt="Juego Wack-a-Molee, pequeños agujeros en el césped con un topo apareciendo, con marcador arriba, barra de tiempo, nivel, botón de pausa y barra de salud" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee-pause.png" 
        alt="Juego Wack-a-Molee, juego pausado, gran cuadrado azul en el medio con la frase Juego Pausado, botones de refrescar y continuar" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee-gameover.png" 
        alt="Juego Wack-a-Molee, juego pausado, gran cuadrado azul en el medio con la frase Juego Terminado, botón para reiniciar" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/c_scale,w_412/f_avif/q_auto:eco/v1719000572/wack-a-molee-clear.png" 
        alt="Juego Wack-a-Molee, juego pausado, gran cuadrado azul en el medio con la frase Nivel Completado y el marcador, botones para refrescar y continuar" />
</p>

> **Nota**: Ningún topo fue lastimado como parte de este proyecto.

## 🐨Wack-a-Molee LA SECUELA!!

Comencemos donde nos quedamos, mostré el reto inicial al hacer el juego: la falta de una librería para animar los "sprites", o al menos una con un enfoque amigable para el usuario como la utilizada en la aplicación React Native. Mostré como resolver el problema, y hay un pequeño proyecto en StackBlitz para jugar un poco con la solución y familiarizarse con el código. Cualquier comentario es bienvenido; Todos estamos aquí para aprender. Si aún no lo pruebas, checa la [parte 1](https://mrrobot.dev/blog/the-wack-a-molee-pt1).

### Estructura del Proyecto

El proyecto de Analog tiene una estructura simple. Si conoces Analog, deberías estar familiarizado con la carpeta de pages que controla el enrutamiento. Si no lo conoces, ¿qué esperas? ¡Pruébalo! En mi caso, estoy usando un proyecto Nx (preferencia personal), por lo que la estructura podría verse un poco diferente, pero esencialmente es la misma que cualquier otro proyecto de Analog.

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

Vamos a profundizar un poco en los aspectos centrales del proyecto.

## 🧠 La Clave

El corazón y cerebro de la aplicación estarán dentro de los componentes. Las páginas solo servirán para el propósito de enrutamiento hacia el lugar donde queremos estar. Con eso en mente, describamos los componentes basados en la estructura de la imagen del juego que acabamos de ver.

- **animated-sprite.component**: Si leíste la parte 1, entonces probablemente ya conoces este, pero si no, déjame darte una pista. Este es el **NÚCLEO** del núcleo, por lo que es el encargado de las animaciones.
- **clear-level.component**: Este mostrará la bonita imagen que le deja saber al usuario que completó el nivel.
- **game-container.component**: Este se encarga de juntar todo y también es el dueño de la lógica que hace que todo funcione. Hablaremos de eso más adelante.
- **game-over.component**: Algo autoexplicativo, pero se encarga de decirte que perdiste.
- **health-bar.component**: Este mostrará la barra de salud y hará que se llene o vacíe.
- **level.component**: Este se encarga de decirte que pasaste al siguiente nivel, ¡YAY!.
- **mole.component**: Este, como dice el nombre, se encarga de manejar el topo y los diferentes estados que puede tener:
  - **Popping**: Cuando el topo simplemente aparece.
  - **Idle**: Solo ves el agujero.
  - **Hiding**: Bueno, esto se explica por sí mismo, es el topo escondiéndose.
  - **Dizzy**: Si golpeas al topo en el momento adecuado, se mareará.
  - **Faint**: Esto sucede después de marearse.
  - **Attack**: Si el topo está lo suficientemente enojado, atacará para intentar hacerte perder salud.
  - **Heal**: El topo se transformará en una especie de centinela de los X-Men y si lo golpeas te sanará (si tienes algún daño).
- **pause.component**: Presenta la pantalla de pausa.
- **score.component**: La pequeña barra de puntuación.
- **timer.component**: La barra de tiempo.
- **toggle-button.component**: el botón de pausa.
- **welcome.component**: la pantalla inicial.

Espero no estar olvidando nada pero estos son los elementos **CLAVE** que usaré para construir este juego.

## 🧩Construyendo las Piezas

### Contenedor del Juego

Empecemos con el **JEFE**, el que dará las órdenes aquí y manejará todos los cambios de estado en el juego, se ve así:

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

Ya sé, es un componente grande, probablemente hagamos parte 3 de la serie 🤔, pero en fin chequemos que sucede aquí.

#### Paso 1: Definir Constantes e Interfaz

```typescript
const DEFAULT_TIME = 30; // Tiempo predeterminado para cada nivel del juego en segundos

interface GameState {
  level: number; // Nivel actual del juego
  score: number; // Puntuación actual del jugador
  time: number; // Tiempo restante para el nivel actual
  cleared: boolean; // Indica si el nivel está completado
  paused: boolean; // Indica si el juego está en pausa
  gameOver: boolean; // Indica si el juego ha terminado
  health: number; // Salud del jugador
  molesAllowed: number; // Número de topos permitidos que aparezcan simultáneamente
  damage: number; // Daño recibido por el jugador al perder un topo
}

// Estado inicial del juego
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

Empezamos definiendo constantes y una interfaz para el estado del juego. `DEFAULT_TIME` establece el tiempo inicial para cada nivel del juego. La interfaz `GameState` describe la estructura del objeto de estado, y `DEFAULT_STATE` inicializa los valores predeterminados para un nuevo juego.

#### Paso 2: Estado del Componente y Dependencias

```typescript
export class GameContainerComponent implements OnDestroy {
  moleComponents = viewChildren<MoleComponent>('moleComponent'); // Referencia a todos los componentes de topo
  private moleIntervalSubscription!: Subscription; // Suscripción para los intervalos de aparición de topos
  private timerIntervalSubscription!: Subscription; // Suscripción para el temporizador del juego
  moleQty = 12; // Número total de posiciones de topos
  moleWidth = signal(0); // Ancho del topo (diseño adaptable)
  moles = signal<Array<number>>(Array.from({ length: this.moleQty })); // Array que representa los topos
  molesPopping = 0; // Contador de topos apareciendo actualmente
  state = signal<GameState>({ ...DEFAULT_STATE }); // Señal del estado del juego
  #responsive = inject(BreakpointObserver); // Inyectando observador de puntos de interrupción para diseño adaptable
  private timeConditionMet = false; // Condición para comprobar si se ha cumplido la condición especial de tiempo

  constructor() {
    // Configurar comportamiento adaptable para el ancho del topo
    this.#responsive.observe([Breakpoints.Handset]).subscribe({
      next: result => {
        if (result.matches) {
          this.moleWidth.set(100); // Establecer ancho del topo para vista de móvil
        } else {
          this.moleWidth.set(0); // Restablecer ancho del topo para otras vistas
        }
      },
    });

    // Configurar ticks del juego después del siguiente renderizado
    afterNextRender(() => {
      this.setupTicks();
    });
  }
```

La clase mantiene el estado del juego, los componentes de topos y varias señales y suscripciones para manejar la lógica del juego. El constructor configura el comportamiento adaptable e inicializa los ticks del juego después del siguiente renderizado.

#### Paso 3: Configurar y Limpiar Intervalos

```typescript
setupTicks()
{
  let speed = 750 - this.state().level * 50; // Calcular velocidad basada en el nivel
  if (speed < 350) {
    speed = 350; // Umbral de velocidad mínima
  }

  this.clearIntervals(); // Limpiar intervalos existentes

  // Configurar intervalo para aparición de topos
  this.moleIntervalSubscription = interval(speed).subscribe({
    next: () => {
      this.popRandomMole();
    },
  });

  // Configurar intervalo para el temporizador del juego
  this.timerIntervalSubscription = interval(1000).subscribe({
    next: () => {
      this.timerTick();
    },
  });
}

clearIntervals()
{
  if (this.moleIntervalSubscription) {
    this.moleIntervalSubscription.unsubscribe(); // Cancelar suscripción de intervalo de topos
  }
  if (this.timerIntervalSubscription) {
    this.timerIntervalSubscription.unsubscribe(); // Cancelar suscripción de intervalo del temporizador
  }
}
```

`setupTicks` inicializa intervalos para la aparición de topos y la actualización del temporizador según el nivel actual. `clearIntervals` limpia cualquier suscripción activa para evitar fugas de memoria.

#### Paso 4: Métodos de Lógica del Juego

```typescript
randomBetween(min
:
number, max
:
number
):
number
{
  return Math.floor(Math.random() * (max - min + 1) + min); // Generar número aleatorio entre min y max
}

onFinishPopping()
:
void {
  this.molesPopping -= 1; // Disminuir el contador de topos apareciendo actualmente
}

popRandomMole()
:
void {
  const molesArray = this.moleComponents();
  if(molesArray.length !== this.moleQty
)
{
  return; // Asegurarse de que el array de topos tenga el tamaño correcto
}

const randomIndex = this.randomBetween(0, this.moleQty - 1); // Elegir un topo aleatorio
const mole = molesArray[randomIndex];
if (!mole.isAppearing && this.molesPopping < this.state().molesAllowed) {
  this.molesPopping += 1; // Incrementar el contador de topos apareciendo actualmente
  mole.pop(); // Activar la aparición del topo
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
    this.molesPopping += 1; // Incrementar el contador de topos apareciendo actualmente
    molesArray[i].pop(); // Activar la aparición del topo
  }
}
}
```

Estos métodos manejan la selección aleatoria de topos, su aparición y la gestión del contador de topos apareciendo actualmente.

#### Paso 5: Método del Tick del Temporizador

```typescript
timerTick()
:
void {
  if(this.state().time === 0
)
{
  this.clearIntervals(); // Limpiar intervalos cuando el tiempo se acaba
  if (this.state().score > 0) {
    this.state.update(state => ({ ...state, cleared: true })); // Marcar nivel como completado si la puntuación es positiva
  } else {
    this.gameOver(); // Activar fin del juego si la puntuación es cero
  }
}
else
{
  this.state.update(state => ({ ...state, time: (state.time -= 1) })); // Disminuir el temporizador

  // Aumentar topos permitidos cuando el tiempo es menor al 30% y la condición no se ha cumplido
  if (!this.timeConditionMet && this.state().time < 0.3 * DEFAULT_TIME) {
    this.state.update(state => ({ ...state, molesAllowed: 4 }));
    this.popAllMoles(); // Aparecer todos los topos cuando se cumple la condición
    this.timeConditionMet = true; // Marcar la condición como cumplida
  }
}
}
```

`timerTick` actualiza el temporizador del juego, verifica si se ha agotado el tiempo y maneja la lógica para completar el nivel o activar el fin del juego. También aumenta los topos permitidos cuando se cumple la condición de tiempo.

#### Paso 6: Métodos de Control del Juego

```typescript
reset()
{
  this.molesPopping = 0;
  this.timeConditionMet = false;
  this.state.update(() => ({ ...DEFAULT_STATE })); // Restablecer el estado del juego
  this.setupTicks(); // Configurar intervalos nuevamente
}

pause()
{
  this.clearIntervals(); // Limpiar intervalos cuando está en pausa
  this.state.update(state => ({ ...state, paused: true })); // Marcar juego como pausado
}

resume()
{
  this.molesPopping = 0;
  this.state.update(state => ({ ...state, paused: false })); // Marcar juego como reanudado
  this.setupTicks(); // Configurar intervalos nuevamente
}

nextLevel()
{
  this.molesPopping = 0;
  this.timeConditionMet = false;
  this.state.update(state => ({
    ...state,
    level: (state.level += 1), // Incrementar nivel
    cleared: false,
    gameOver: false,
    time: DEFAULT_TIME, // Restablecer tiempo para nuevo nivel
    molesAllowed: 3, // Restablecer topos permitidos
  }));
  this.setupTicks(); // Configurar intervalos nuevamente
}

onScore()
{
  this.state.update(state => ({ ...state, score: (state.score += 1) })); // Incrementar puntuación
}

onDamage()
{
  if (this.state().cleared || this.state().gameOver || this.state().paused) {
    return; // No hacer nada si el juego está completado, terminado o pausado
  }

  const targetHealth =
    this.state().health - this.state().damage < 0
      ? 0
      : this.state().health - this.state().damage; // Calcular nueva salud

  this.state.update(state =>

    ({ ...state, health: targetHealth })); // Actualizar salud

  if (targetHealth <= 0) {
    this.gameOver(); // Activar fin del juego si la salud es cero
  }
}

gameOver()
{
  this.clearIntervals(); // Limpiar intervalos cuando el juego ha terminado
  this.timeConditionMet = false;
  this.state.update(state => ({ ...state, gameOver: true })); // Marcar juego como terminado
}

onHeal()
{
  this.state.update(state => ({
    ...state,
    health: state.health + 10 > 100 ? 100 : state.health + 10, // Sanar al jugador
  }));
}
```

Estos métodos controlan las transiciones de estado del juego, como restablecer, pausar, reanudar, progresar al siguiente nivel y manejar la puntuación, el daño y la sanación.

#### Paso 7: Limpieza al Destruir

```typescript
ngOnDestroy()
{
  this.clearIntervals(); // Limpiar intervalos para evitar fugas de memoria
}
```

Finalmente, `ngOnDestroy` asegura que los intervalos se limpien cuando el componente se destruye para evitar fugas de memoria.

---

### 🐨El topo (ya que no hay un emoji de topo adecuado, usaremos un koala, no me juzgues).

Para que todo funcione necesitamos el elemento que dará nombre a este juego, sí, ya sabes, **El Topo** y se ve así:

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
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accede al AnimatedSpriteComponent
  finishPopping = output({ alias: 'finishPopping' }); // Emite cuando termina de aparecer
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

  private subscriptions: Subscription[] = []; // Almacena todas las suscripciones

  // Inicia la secuencia de aparición del topo
  pop() {
    this.resetStates(); // Restablece todos los estados para asegurar un inicio limpio
    this.isAppearing = true;

    // Determina si el topo es agresivo o curativo
    this.isFeisty = Math.random() < 0.5;
    this.isHealing = !this.isFeisty && Math.random() < 0.08;

    // Reproduce la animación adecuada según el estado del topo
    if (this.isHealing) {
      this.mole()?.play('heal', 24, () => {
        this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
      });
    } else {
      this.mole()?.play('appear', 24, () => {
        // Si el topo es agresivo y no ha sido golpeado, atacará
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
          // De lo contrario, el topo se esconderá después de un retraso
          this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
        }
      });
    }
  }

  // Maneja el evento de golpe
  whack() {
    // Solo golpea si el topo está apareciendo y no ha sido golpeado o está atacando
    if (!this.isAppearing || this.isWhacked || this.isAttacking) return;

    this.isWhacked = true;
    this.isFeisty = false;
    this.score.emit();
    if (this.isHealing) this.heal.emit();

    // Reproduce las animaciones de mareo y desmayo al golpear
    this.mole()?.play('dizzy', 24, () => {
      this.mole()?.play('faint', 24, () => {
        this.isAppearing = false;
        this.finishPopping.emit();
      });
    });
  }

  // Esconde el topo
  hideMole() {
    // Solo se esconde si no se está escondiendo ya
    if (this.isHiding) return;
    this.isHiding = true;
    this.mole()?.play('hide', 24, () => {
      this.isAppearing = false;
      this.finishPopping.emit();
    });
  }

  // Restablece todas las banderas de estado
  resetStates() {
    this.isWhacked = false;
    this.isAttacking = false;
    this.isHiding = false;
    this.isHealing = false;
    this.clearSubscriptions(); // Limpia todas las suscripciones
  }

  // Limpia todas las suscripciones
  clearSubscriptions() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
```

Vamos a profundizar un poco en el código:

#### Paso 1: Definir Propiedades del Componente y Salidas

```typescript
export class MoleComponent {
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accede al AnimatedSpriteComponent
  finishPopping = output({ alias: 'finishPopping' }); // Emite cuando termina de aparecer
  damage = output({ alias: 'damageReceived' }); // Emite cuando el topo causa daño
  score = output({ alias: 'takeScore' }); // Emite cuando el topo es golpeado por puntos
  heal = output({ alias: 'moleHealing' }); // Emite cuando el topo cura al jugador
  frameWidth = input(0); // Ancho del marco del topo

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

  private subscriptions: Subscription[] = []; // Almacena todas las suscripciones
```

Definimos propiedades para manejar el estado del topo y las animaciones. Las salidas son eventos que el topo emite para informar al componente padre sobre sus acciones.

#### Paso 2: Lógica de Aparición del Topo

```typescript
  // Inicia la secuencia de aparición del topo
pop()
{
  this.resetStates(); // Restablece todos los estados para asegurar un inicio limpio
  this.isAppearing = true;

  // Determina si el topo es agresivo o curativo
  this.isFeisty = Math.random() < 0.5;
  this.isHealing = !this.isFeisty && Math.random() < 0.08;

  // Reproduce la animación adecuada según el estado del topo
  if (this.isHealing) {
    this.mole()?.play('heal', 24, () => {
      this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
    });
  } else {
    this.mole()?.play('appear', 24, () => {
      // Si el topo es agresivo y no ha sido golpeado, atacará
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
        // De lo contrario, el topo se esconderá después de un retraso
        this.subscriptions.push(timer(1000).subscribe(() => this.hideMole()));
      }
    });
  }
}
```

El método `pop` inicia la secuencia de aparición del topo, determinando si el topo es agresivo o curativo y reproduciendo la animación adecuada. Utiliza temporizadores para gestionar la secuencia de eventos.

#### Paso 3: Manejar el Evento de Golpe

```typescript
  // Maneja el evento de golpe
whack()
{
  // Solo golpea si el topo está apareciendo y no ha sido golpeado o está atacando
  if (!this.isAppearing || this.isWhacked || this.isAttacking) return;

  this.isWhacked = true;
  this.isFeisty = false;
  this.score.emit(); // Emitir evento de puntuación
  if (this.isHealing) this.heal.emit(); // Emitir evento de curación si el topo está curando

  // Reproduce las animaciones de mareo y desmayo al golpear
  this.mole()?.play('dizzy', 24, () => {
    this.mole()?.play('faint', 24, () => {
      this.isAppearing = false;
      this.finishPopping

        .emit(); // Emitir evento de fin de aparición
    });
  });
}
```

El método `whack` maneja el evento cuando el jugador golpea al topo. Reproduce las animaciones adecuadas y emite eventos según el estado del topo.

#### Paso 4: Esconder el Topo

```typescript
  // Esconde el topo
hideMole()
{
  // Solo se esconde si no se está escondiendo ya
  if (this.isHiding) return;
  this.isHiding = true;
  this.mole()?.play('hide', 24, () => {
    this.isAppearing = false;
    this.finishPopping.emit(); // Emitir evento de fin de aparición
  });
}
```

El método `hideMole` esconde el topo, reproduciendo la animación de esconder y emitiendo el evento `finishPopping`.

#### Paso 5: Restablecer Estados y Limpiar Suscripciones

```typescript
  // Restablece todas las banderas de estado
resetStates()
{
  this.isWhacked = false;
  this.isAttacking = false;
  this.isHiding = false;
  this.isHealing = false;
  this.clearSubscriptions(); // Limpiar todas las suscripciones
}

// Limpiar todas las suscripciones
clearSubscriptions()
{
  this.subscriptions.forEach(sub => sub.unsubscribe());
  this.subscriptions = [];
}
}
```

El método `resetStates` restablece todas las banderas de estado a sus valores predeterminados, y `clearSubscriptions` cancela todas las suscripciones activas para evitar fugas de memoria.

### 🥹 No olvides los otros

Todavía nos faltan algunos componentes como el score, toggle, timer, clear y gameover, pero estos componentes son prácticamente cascarones y comparten algo de comportamiento entre ellos (al menos el clear y gameover). Así que, vamos a profundizar en algunos de ellos y luego compartiremos el producto final.

El componente Clear se ve algo así:

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

Como podemos ver, es solo un cascarón que recibe algunos datos y emite algunos datos, el **GameOver** tiene un comportamiento similar.

Ahora vamos a ver el score y la barra de salud:

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
      @apply relative flex flex-1 items-center justificar-center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
  score = input.required<number>();
}
```

El score es prácticamente lo mismo, presenta algunos datos que dependen del input que recibe.

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
      alt="Health icon, a red heart"
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

Prácticamente, todos los componentes restantes son iguales, un cascarón con algunos datos para presentar (adecuadamente estilizados, espero).

### 🎮 La Pantalla Inicial

Finalmente, quería proporcionar una pequeña pantalla inicial para que puedas prepararte mentalmente para golpear algunos topos, así que aquí voy.

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
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accede a AnimatedSpriteComponent

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

Como podemos ver, welcome tiene un poco más de lógica, así que vamos a ver qué está haciendo.

#### Paso 1: Definir Propiedades del Componente y Salidas

```typescript
export class WelcomeComponent implements AfterViewInit {
  mole = viewChild<AnimatedSpriteComponent>('mole'); // Accede a AnimatedSpriteComponent

  animations = {
    idle: [0],
    appear: [1, 2, 3, 4],
    hide: [4, 3, 2, 1, 0],
    dizzy: [36, 37, 38],
    faint: [42, 43, 44, 0],
    attack: [11, 12, 13, 14, 15, 16],
    heal: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
  };

  private mainAnimations = ['attack', 'dizzy', 'heal', 'appear']; // Animaciones principales para el topo
```

Definimos propiedades para manejar las animaciones del topo y una lista de animaciones principales para reproducir aleatoriamente. La propiedad `mole` se usa para acceder a `AnimatedSpriteComponent`.

#### Paso 2: Implementar el Gancho del Ciclo de Vida y la Secuencia de Animación

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

El ciclo de vida `ngAfterViewInit` inicializa la secuencia de animación después de que la vista del componente se ha inicializado. `startSequence` comienza la secuencia reproduciendo una animación aleatoria.

#### Paso 3: Lógica de Animación Aleatoria

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

- `playRandomAnimation`: Elige una animación aleatoria de la lista de animaciones principales y la reproduce.
- `playAnimation`: Reproduce la animación seleccionada a 12 fotogramas por segundo. Una vez que la animación se completa, establece un temporizador para reproducir la animación de ocultar.
- `playHideAnimation`: Reproduce la animación de ocultar. Una vez que se completa, establece un temporizador para reproducir otra animación aleatoria.
- `getRandomAnimation`: Devuelve una animación aleatoria de la lista `mainAnimations`.

Finalmente, el **Wack-A-Molee** está listo y puedes jugar con él aquí:

[Juego Wack-A-Molee](https://analog-wack-a-mole.vercel.app/) y el código si quieres hacer un fork o darle una estrella o algo... [repositorio en github](https://github.com/luishcastroc/analog-wack-a-mole)

## 🌟 Conclusión: Terminando la Parte 2

¡Lo hicimos 🎉! Construimos el juego, o al menos algo funcional. Usamos Signals, Signal inputs, Signal Queries, Signal outputs y SFC. También construimos un componente para reutilizar en pequeñas animaciones de sprite sheet. Espero que este artículo te haya inspirado. ¡Vamos a ver qué puedo intentar construir a continuación!

---

Si encontraste este artículo interesante, no dudes en conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). ¡Embarquémonos juntos en este viaje de descubrimiento e innovación! 💻🚀📘

¿Te sientes generoso? Muestra algo de amor y [cómprame un café](https://www.buymeacoffee.com/luishcastrv). ¡Tu apoyo es muy apreciado! ☕️
