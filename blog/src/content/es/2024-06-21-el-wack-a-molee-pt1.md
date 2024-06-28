---
title: Haciendo un Wack-A-Molee con AnalogJs - Parte 1
slug: el-wack-a-molee-pt1
otherSlug: the-wack-a-molee-pt1
description: Haciendo un pequeño juego de Wack-A-Molee usando AnalogJs y Canvas - Parte 1
author: Luis Castro
coverImage: v1712246484/wack-a-molee-banner.png
date: 06-21-2024
---

## 📚 La Idea

**La búsqueda de inspiración:**
Después de algún tiempo sin escribir, estaba buscando algunos temas sobre los que podría escribir, y fue entonces cuando mi hija vino a preguntarme, "Papá, ¿sabes cómo hacer videojuegos?" Me sorprendió e impresionó la pregunta. "Por supuesto que puedo", fue la respuesta. "Por supuesto, nunca lo he intentado", fue la realidad. Así que empecé a pensar en qué hacer a continuación.

## 🐨 Wack-a-Molee

Dado que es mi primera vez y no sé nada sobre animaciones, el primer juego que me vino a la mente, por su simplicidad y porque parece ser más fácil de implementar para móviles, fue [Whac-A-Molee](https://en.wikipedia.org/wiki/Whac-A-Mole).

Si no conoces la mecánica del clásico **Whac-A-Molee**, es muy simples. Los jugadores necesitan golpear con un mazo una serie de animales que aparecen al azar.

### Empezando

Con la idea en mente, empecé a buscar en Google, YouTube (ya sabes, lo usual) para obtener inspiración y opciones, porque claramente no quería empezar desde cero y tener que diseñar mis propios sprites y cosas.

Y terminé encontrando este proyecto hecho con React Native por **Tamas Szikszai**. Todo el crédito es para él por el concepto, los sprites y el diseño general. Definitivamente no estoy robando el trabajo de alguien, así que aquí está, si quieres ver su canal, haz clic [aquí](https://www.youtube.com/channel/UCG4CEAVeZsfzKH4NpPwgs7w).

Con la idea y un mejor comienzo, ¡vamos a ello! 🎮:

El proyecto original usa **React Native** y una pequeña biblioteca llamada **rn-sprite-sheet** y nosotros estamos usando **AnalogJs** y eso es todo.

## 🦾 Mecánicas

Estoy usando prácticamente las mismas mecánicas que **Tamas** usa; sin embargo, estoy añadiendo un par de cosas, así que vamos a explicar esto:

- **Jugabilidad**: El juego tendrá prácticamente 12 topos apareciendo al azar, y necesitas golpearlos para hacer que se vayan lo más rápido posible. Esto está dividido en 50 niveles; cada nivel aumenta la velocidad de aparición de los topos, haciendo que sea un poco más difícil de terminar. Además, tienes una barra de salud, así que si pierdes toda tu salud, estás fuera. Fácil, ¿verdad? (Eso espero).
- **Tipos de Topo**: Tienes básicamente 3 tipos de topos:
  - **Regular**: Este aparecerá y, después de un tiempo, se esconderá.
  - **Enfadado**: Este aparecerá, pero atacará y reducirá tu salud si no lo golpeas primero.
  - **Centinela**: (Sí, parece uno de los Centinelas de X-Men). Este beberá algo y se convertirá en un centinela. Si lo golpeas, ganarás algo de salud.
- **Cambios respecto a la versión de React Native**: A diferencia de la implementación original, esta tiene una pantalla inicial. Además, cuando quede el 30% del tiempo, al menos 4 topos aparecerán al mismo tiempo.

Divertido, ¿verdad? Así que vamos a profundizar un poco en la explicación de cómo funcionará esto. Honestamente no leí el post de **Tamas** ya que no pago por Medium, pero vi su video. Sí, ya publiqué el enlace, así que para ahorrar un poco de tiempo, explicaré lo básico de cómo funciona el código, y partiremos desde ahí.

## 🧩 La Biblioteca de Animación

Con las mecánicas bien establecidas y un punto de partida sólido, nos encontramos con el primer obstáculo, que es la biblioteca de animación de sprites. Estoy bastante seguro de que hay muchas opciones para hacer esto en Angular y JavaScript en general; sin embargo, con mi falta de experiencia en el tema, encontré Canvas como la opción más fácil de entender. ¿Cómo funciona eso? Vamos a profundizar en lo que hice y cómo funciona.

### El Enfoque de Canvas

```ts
@Component({
  selector: 'game-animated-sprite',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedSpriteComponent implements AfterViewInit, OnDestroy {
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  imgSrc = input.required<string>();
  rows = input.required<number>();
  columns = input.required<number>();
  animations = input.required<{ [key: string]: number[] }>();
  loopMode = input(false);
  frameWidth = input<number | null>(null);
  frameHeight = input<number | null>(null);
  initialFrame = input<number>(0);

  private img = new Image();
  private ctx!: CanvasRenderingContext2D;
  private width!: number;
  private height!: number;
  private originalAspectRatio!: number;
  private subscription!: Subscription;
  private currentLoopIndex = 0;
  private currentAnimationType!: string;
  private frameSequence!: number[];

  valueEffect = effect(() => {
    const [w, h, imgSrc] = [
      this.frameWidth(),
      this.frameHeight(),
      this.imgSrc(),
    ];
    untracked(() => {
      this.calculateDimensions();
    });
  });

  ngAfterViewInit(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (canvas) {
      this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      this.img.src = this.imgSrc();
      this.img.onload = () => {
        this.originalAspectRatio =
          this.img.naturalWidth / this.img.naturalHeight;
        this.calculateDimensions();
        this.drawFrame(this.initialFrame());
      };
    }
  }

  private calculateDimensions(): void {
    const [frameHeight, frameWidth] = [this.frameHeight(), this.frameWidth()];
    if (this.img.complete) {
      if (frameWidth && !frameHeight) {
        this.width = frameWidth;
        this.height = this.width / esta.originalAspectRatio;
      } else if (!frameWidth && frameHeight) {
        this.height
        es
        frameHeight;
        this
        width
        es
        esta.height * esta.originalAspectRatio;
      } else if (frameWidth y
      frameHeight
    )
      {
        esta
        width
        es
        frameWidth;
        esta
        height
        es
        frameHeight;
      }
    else
      {
        esta
        width
        es
        esta.img.naturalWidth / esta.columns();
        esta
        height
        es
        esta.img.naturalHeight / esta.rows();
      }

      const canvas = esta.canvasRef()?.nativeElement;
      if (canvas) {
        canvas.width
        es
        esta.width;
        canvas.height
        es
        esta.height;
      }
    }
  }

  play(animationType: string, fps = 24, onFinish?: () => void): void {
    esta.clearSubscription();
    esta.currentLoopIndex = 0;
    esta.currentAnimationType
    es
    animationType;
    esta.frameSequence
    es
    esta.animations()[animationType];
    esta.startAnimation(esta.frameSequence, fps, onFinish);
  }

  pause(): void {
    esta.clearSubscription();
  }

  resume(): void {
    if (esta.currentAnimationType y
    esta.frameSequence
  )
    {
      esta.startAnimation(esta.frameSequence);
    }
  }

  reset(): void {
    esta.clearCanvas();
    esta.currentLoopIndex
    es
    0;
  }

  private startAnimation(
    frameSequence: number[],
    fps = 24,
    onFinish?: () => void
  ): void {
    const frameRate = 1000 / fps;
    esta.subscription
    es
    interval(frameRate)
      .pipe(
        tap(() => esta.clearCanvas()),
        map(() => frameSequence[esta.currentLoopIndex]),
        tap(frameIndex => esta.drawFrame(frameIndex)),
        tap(() => {
          esta.currentLoopIndex++;
          if (esta.currentLoopIndex >= frameSequence.length) {
            if (esta.loopMode()) {
              esta.currentLoopIndex = 0;
            } else {
              esta.subscription.unsubscribe();
              if (onFinish) {
                onFinish();
              }
            }
          }
        })
      )
      .subscribe();
  }

  private clearCanvas(): void {
    const canvas = esta.canvasRef()?.nativeElement;
    if (canvas) {
      esta.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  private drawFrame(frameIndex: number): void {
    const frameX = Math.floor(frameIndex % esta.columns());
    const frameY = Math.floor(frameIndex / esta.columns());
    const naturalFrameWidth
    es
    Math.floor(
      esta.img.naturalWidth / esta.columns()
    );
    const naturalFrameHeight
    es
    Math.floor(esta.img.naturalHeight / esta.rows());

    const padding = 1;

    esta.ctx.drawImage(
      esta.img,
      frameX * naturalFrameWidth + padding,
      frameY * naturalFrameHeight + padding,
      naturalFrameWidth - padding * 2,
      naturalFrameHeight - padding * 2,
      0,
      0,
      esta.width,
      esta.height
    );
  }

  private clearSubscription(): void {
    if (esta.subscription) {
      esta

        .subscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    esta.clearSubscription();
  }
}
```

Así que este es el componente que prácticamente anima al pequeño topo, pero también podría funcionar con otras hojas de sprites (probé con una de Zelda, así que sé que funcionará).
Vamos a profundizar en los detalles de cómo funciona esto o al menos las partes **CORE**.

### Explicación Detallada

#### Entradas y Propiedades

```typescript
canvasRef
es
viewChild<ElementRef<HTMLCanvasElement>>('canvas');
imgSrc
es
input.required<string>();
rows
es
input.required<number>();
columns
es
input.required<number>();
animations
es
input.required<{ [key: string]: number[] }>();
loopMode
es
input(false);
frameWidth
es
input<number | null>(null);
frameHeight
es
input<number | null>(null);
initialFrame
es
input<number>(0);
```

- **Entradas**: Se definen varias entradas para controlar el comportamiento del sprite:

  - `imgSrc`: URL de la hoja de sprites.
  - `rows` y `columns`: Definen la cuadrícula de la hoja de sprites.
  - `animations`: Un objeto que mapea nombres de animaciones a secuencias de frames.
  - `loopMode`: Un booleano para determinar si las animaciones deben repetirse.
  - `frameWidth` y `frameHeight`: Dimensiones para cada frame.
  - `initialFrame`: El frame inicial de la animación.

- **Referencia al Canvas**: `canvasRef` se usa para obtener el elemento nativo del canvas.

#### Métodos Principales

1. **calculateDimensions**

```ts
 private
calculateDimensions()
:
void {
  const [frameHeight, frameWidth] = [esta.frameHeight(), esta.frameWidth()];
  if(esta.img.complete
)
{
  if (frameWidth y
  no
  frameHeight
)
  {
    esta.width
    es
    frameWidth;
    esta.height
    es
    esta.width / esta.originalAspectRatio;
  }
else
  if (no frameWidth
  y
  frameHeight
)
  {
    esta.height
    es
    frameHeight;
    esta.width
    es
    esta.height * esta.originalAspectRatio;
  }
else
  if (frameWidth y
  frameHeight
)
  {
    esta.width
    es
    frameWidth;
    esta.height
    es
    frameHeight;
  }
else
  {
    esta.width
    es
    esta.img.naturalWidth / esta.columns();
    esta.height
    es
    esta.img.naturalHeight / esta.rows();
  }

  const canvas = esta.canvasRef()?.nativeElement;
  if (canvas) {
    canvas.width
    es
    esta.width;
    canvas.height
    es
    esta.height;
  }
}
}
}
```

- **calculateDimensions**: Este método ajusta las dimensiones del canvas según el tamaño del frame o las dimensiones naturales de la imagen.

  - Si se proporcionan `frameWidth` y `frameHeight`, usa esas dimensiones.
  - Si solo se proporciona `frameWidth`, calcula `frameHeight` para mantener la relación de aspecto de la imagen.
  - Si solo se proporciona `frameHeight`, calcula `frameWidth` de manera similar.
  - Si no se proporciona ninguno, calcula las dimensiones del frame basándose en el número de filas y columnas de la hoja de sprites.

Esto asegura que la imagen esté correctamente escalada y mostrada dentro del canvas.

2. **startAnimation**

```typescript
private
startAnimation(
  frameSequence
:
number[],
  fps = 24,
  onFinish ? : () => void
):
void {
  const frameRate es 1000 / fps;
  esta.subscription es interval(frameRate)
    .pipe(
      tap(() => esta.clearCanvas()),
      map(() => frameSequence[esta.currentLoopIndex]),
      tap(frameIndex => esta.drawFrame(frameIndex)),
      tap(() => {
        esta.currentLoopIndex++;
        if (esta.currentLoopIndex >= frameSequence.length) {
          if (esta.loopMode()) {
            esta.currentLoopIndex
            es
            0;
          } else {
            esta.subscription.unsubscribe();
            if (onFinish) {
              onFinish();
            }
          }
        }
      })
    )
    .subscribe();
}
```

- **startAnimation**: Gestiona las actualizaciones de frames de la animación usando RxJS `interval`. Asegura que los frames se dibujen a la tasa correcta y maneja la lógica del fin de la animación.

  - `interval(frameRate)`: Crea un observable que emite valores a la tasa de frames especificada.
  - `tap(() => esta.clearCanvas())`: Limpia el canvas antes de dibujar cada frame.
  - `map(() => frameSequence[esta.currentLoopIndex])`: Mapea el índice actual del bucle al frame correspondiente en la secuencia de frames.
  - `tap(frameIndex => esta.drawFrame(frameIndex))`: Dibuja el frame actual.
  - `tap(() => { ... })`: Actualiza el índice del bucle y maneja la repetición o finalización de la animación.

El uso de `interval` de RxJS permite un control preciso sobre la temporización de la animación.

3. **drawFrame**

```typescript
private
drawFrame(frameIndex
:
number
):
void {
  const frameX es Math.floor(frameIndex % esta.columns());
  const frameY es Math.floor(frameIndex / esta.columns());
  const naturalFrameWidth es Math.floor(
    esta.img.naturalWidth / esta.columns()
  );
  const naturalFrameHeight es Math.floor(esta.img.naturalHeight / esta.rows());

  const padding es 1;

  esta.ctx.drawImage(
    esta.img,
    frameX * naturalFrameWidth + padding,
    frameY * naturalFrameHeight + padding,
    naturalFrameWidth - padding * 2,
    naturalFrameHeight - padding * 2,
    0,
    0,
    esta.width,
    esta.height
  );
}
```

- **drawFrame**: Dibuja un frame específico de la hoja de sprites en el canvas.

  - `frameX` y `frameY` se calculan para determinar la posición del frame dentro de la hoja de sprites.
  - `naturalFrameWidth` y `naturalFrameHeight` representan las dimensiones de cada frame dentro de la hoja de sprites.
  - `esta.ctx.drawImage(...)`: Dibuja el frame calculado en el canvas, escalándolo para ajustarse a las dimensiones especificadas.

El `padding` se usa para asegurar que los frames se dibujen correctamente sin superposición.

Pero no creas una palabra de lo que digo, pruébalo tú mismo 🥸 [aquí](https://stackblitz.com/edit/animated-sprite-angular-canvas?file=src%2Fcanvas-animation.component.ts,src%2Fmole.component.ts)

## 🌟 Conclusión: Finalizando la Parte 1

En esta primera parte de nuestra serie sobre cómo crear un juego de Wack-A-Molee con AnalogJs y Canvas, hemos sentado las bases al entender las mecánicas básicas del juego y explorar el componente principal responsable de las animaciones de sprites. Hemos desglosado el `AnimatedSpriteComponent`, viendo cómo usa canvas para renderizar y animar sprites de manera eficiente.

Hemos usado algunas de las características más recientes de **Angular** como Signal Inputs y Signal Queries.

En la próxima parte de la serie, profundizaremos en las mecánicas del juego, añadiendo interactividad y lógica para dar vida al juego de Wack-A-Molee. ¡Sigue atento mientras continuamos construyendo este divertido juego paso a paso!

---

Si encontraste este artículo interesante, no dudes en conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). ¡Embarquémonos juntos en este viaje de descubrimiento e innovación! 💻🚀📘

¿Te sientes generoso? Muestra algo de amor y [cómprame un café](https://www.buymeacoffee.com/luishcastrv). ¡Tu apoyo es muy apreciado! ☕️
