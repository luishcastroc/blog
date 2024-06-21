---
title: Making a Wack-A-Molee with AnalogJs - Part 1
slug: the-wack-a-molee-pt1
otherSlug: el-wack-a-molee-pt1
description: Building a little Wack-A-Molee game using AnalogJs and Canvas - Part 1
author: Luis Castro
coverImage: v1712246484/wack-a-molee-banner.png
date: 06-21-2024
---

## 📚The Idea

**The search for inspiration:**
After some time without writing, I was kind of looking for some subjects I could write about, and that's when my daughter came to ask me, "Dad, do you know how to make video games?" I was both surprised and impressed by the question. "Of course I can," was the answer. "Of course, I've never tried," was the reality. So I started to think about what to do next.

## 🐨Wack-a-Molee

Since it is my first time and I know zero about animations, the first game that came to my mind, because of simplicity and because it seems to be easier to implement for mobile, was [Whac-A-Molee](https://en.wikipedia.org/wiki/Whac-A-Mole).

If you don't know the mechanics for classic **Whac-A-Molee**, they are very simple. Players need to hit a series of randomly popping-up animals with a mallet.

### Getting Started

With the idea in my mind, I started to check Google, YouTube (you know, the usual) for inspiration and options, because clearly, I didn't want to start from scratch and have to design my own sprites and stuff.

And I ended up finding this project made with React Native by **Tamas Szikszai**. All the credit goes to him for the concept, sprites, and overall design. I'm definitely not stealing someone's work, so here is that if you want to check out his channel, click [Here](https://www.youtube.com/channel/UCG4CEAVeZsfzKH4NpPwgs7w).

With the idea and a better start, let's get on with it!! 🎮:

The original project is using **React Native** and a little library called **rn-sprite-sheet** and we're using **AnalogJs** and that's pretty much it.

## 🦾Mechanics

I'm pretty much using the same mechanics that **Tamas** uses; however, I'm adding a couple of things, so let's explain this:

- **Gameplay**: The game will be pretty much 12 moles popping randomly, and you need to hit them to make them go away as fast as you can. This is divided into 50 levels; each level increases the speed of the moles popping, making it a little harder to finish. Additionally, you have a healing bar, so if you lose all your health, you're gone. Easy, right? (I hope).
- **Types of Mole**: You pretty much have 3 types of moles:
  - **Regular**: This will pop and, after some time, it will hide.
  - **Angry**: This one will pop, but it will attack and reduce your health if you don't hit it first.
  - **Sentinel**: (Yeah, he looks like one of the X-Men Sentinels). This will drink some stuff and become a sentinel. If you hit him, you will gain some health.
- **Changes from the React Native One**: Different from the original implementation, this one has an initial screen. As well, when there's 30% of the time left, at least 4 moles will pop at the same time.

Funny, right? So let's dig a little bit into the explanation of how this will work. I honestly didn't read the blog post from **Tamas** since I do not personally pay for Medium, but I saw his video. Yeah, I already posted the link, so to save a little time, I'll explain the basics of how the code works, and we will go from there.

## 🧩The Animation Library

With the mechanics well established and a solid starting point, we hit the first obstacle, which is the sprite animation library. I'm pretty sure there are many options to do this in Angular and JavaScript in general; however, with my lack of experience in the subject, I found Canvas to be the easiest to understand. So how does that work? Let's dig into what I did and how it works.

### The Canvas Approach

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
        this.height = this.width / this.originalAspectRatio;
      } else if (!frameWidth && frameHeight) {
        this.height = frameHeight;
        this.width = this.height * this.originalAspectRatio;
      } else if (frameWidth && frameHeight) {
        this.width = frameWidth;
        this.height = frameHeight;
      } else {
        this.width = this.img.naturalWidth / this.columns();
        this.height = this.img.naturalHeight / this.rows();
      }

      const canvas = this.canvasRef()?.nativeElement;
      if (canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
      }
    }
  }

  play(animationType: string, fps = 24, onFinish?: () => void): void {
    this.clearSubscription();
    this.currentLoopIndex = 0;
    this.currentAnimationType = animationType;
    this.frameSequence = this.animations()[animationType];
    this.startAnimation(this.frameSequence, fps, onFinish);
  }

  pause(): void {
    this.clearSubscription();
  }

  resume(): void {
    if (this.currentAnimationType && this.frameSequence) {
      this.startAnimation(this.frameSequence);
    }
  }

  reset(): void {
    this.clearCanvas();
    this.currentLoopIndex = 0;
  }

  private startAnimation(
    frameSequence: number[],
    fps = 24,
    onFinish?: () => void
  ): void {
    const frameRate = 1000 / fps;
    this.subscription = interval(frameRate)
      .pipe(
        tap(() => this.clearCanvas()),
        map(() => frameSequence[this.currentLoopIndex]),
        tap(frameIndex => this.drawFrame(frameIndex)),
        tap(() => {
          this.currentLoopIndex++;
          if (this.currentLoopIndex >= frameSequence.length) {
            if (this.loopMode()) {
              this.currentLoopIndex = 0;
            } else {
              this.subscription.unsubscribe();
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
    const canvas = this.canvasRef()?.nativeElement;
    if (canvas) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  private drawFrame(frameIndex: number): void {
    const frameX = Math.floor(frameIndex % this.columns());
    const frameY = Math.floor(frameIndex / this.columns());
    const naturalFrameWidth = Math.floor(
      this.img.naturalWidth / this.columns()
    );
    const naturalFrameHeight = Math.floor(this.img.naturalHeight / this.rows());

    const padding = 1;

    this.ctx.drawImage(
      this.img,
      frameX * naturalFrameWidth + padding,
      frameY * naturalFrameHeight + padding,
      naturalFrameWidth - padding * 2,
      naturalFrameHeight - padding * 2,
      0,
      0,
      this.width,
      this.height
    );
  }

  private clearSubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.clearSubscription();
  }
}
```

So this is the component that pretty much animates the little mole, but it might as well work with other sprite sheets (

I tested it with a Zelda one, so I know it will).
Let's dig into the details of how this works or at least the **CORE** parts.

### Detailed Explanation

#### Inputs and Properties

```typescript
canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
imgSrc = input.required<string>();
rows = input.required<number>();
columns = input.required<number>();
animations = input.required<{ [key: string]: number[] }>();
loopMode = input(false);
frameWidth = input<number | null>(null);
frameHeight = input<number | null>(null);
initialFrame = input<number>(0);
```

- **Inputs**: Several inputs are defined to control the sprite's behavior:

  - `imgSrc`: URL of the sprite sheet image.
  - `rows` and `columns`: Define the sprite sheet's grid.
  - `animations`: An object mapping animation names to frame sequences.
  - `loopMode`: A boolean to determine if animations should loop.
  - `frameWidth` and `frameHeight`: Dimensions for each frame.
  - `initialFrame`: The starting frame of the animation.

- **Canvas Reference**: `canvasRef` is used to get the native canvas element.

#### Core Methods

1. **calculateDimensions**

```ts
 private calculateDimensions(): void {
    const [frameHeight, frameWidth] = [this.frameHeight(), this.frameWidth()];
    if (this.img.complete) {
      if (frameWidth && !frameHeight) {
        this.width = frameWidth;
        this.height = this.width / this.originalAspectRatio;
      } else if (!frameWidth && frameHeight) {
        this.height = frameHeight;
        this.width = this.height * this.originalAspectRatio;
      } else if (frameWidth && frameHeight) {
        this.width = frameWidth;
        this.height = frameHeight;
      } else {
        this.width = this.img.naturalWidth / this.columns();
        this.height = this.img.naturalHeight / this.rows();
      }

      const canvas = this.canvasRef()?.nativeElement;
      if (canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
      }
    }
  }
}
```

- **calculateDimensions**: This method adjusts the canvas dimensions based on the frame size or the image's natural dimensions.

  - If both `frameWidth` and `frameHeight` are provided, use those dimensions.
  - If only `frameWidth` is provided, calculate `frameHeight` to maintain the image's aspect ratio.
  - If only `frameHeight` is provided, calculate `frameWidth` similarly.
  - If neither are provided, calculate the frame dimensions based on the number of rows and columns in the sprite sheet.

This ensures that the image is properly scaled and displayed within the canvas.

2. **startAnimation**

```typescript
private startAnimation(
    frameSequence: number[],
    fps = 24,
    onFinish?: () => void
  ): void {
    const frameRate = 1000 / fps;
    this.subscription = interval(frameRate)
      .pipe(
        tap(() => this.clearCanvas()),
        map(() => frameSequence[this.currentLoopIndex]),
        tap(frameIndex => this.drawFrame(frameIndex)),
        tap(() => {
          this.currentLoopIndex++;
          if (this.currentLoopIndex >= frameSequence.length) {
            if (this.loopMode()) {
              this.currentLoopIndex = 0;
            } else {
              this.subscription.unsubscribe();
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

- **startAnimation**: Manages the animation frame updates using RxJS `interval`. It ensures frames are drawn at the correct rate and handles the end-of-animation logic.

  - `interval(frameRate)`: Creates an observable that emits values at the specified frame rate.
  - `tap(() => this.clearCanvas())`: Clears the canvas before drawing each frame.
  - `map(() => frameSequence[this.currentLoopIndex])`: Maps the current loop index to the corresponding frame in the frame sequence.
  - `tap(frameIndex => this.drawFrame(frameIndex))`: Draws the current frame.
  - `tap(() => { ... })`: Updates the loop index and handles looping or finishing the animation.

The use of RxJS `interval` allows for precise control over the animation timing.

3. **drawFrame**

```typescript
private drawFrame(frameIndex: number): void {
    const frameX = Math.floor(frameIndex % this.columns());
    const frameY = Math.floor(frameIndex / this.columns());
    const naturalFrameWidth = Math.floor(
      this.img.naturalWidth / this.columns()
    );
    const naturalFrameHeight = Math.floor(this.img.naturalHeight / this.rows());

    const padding = 1;

    this.ctx.drawImage(
      this.img,
      frameX * naturalFrameWidth + padding,
      frameY * naturalFrameHeight + padding,
      naturalFrameWidth - padding * 2,
      naturalFrameHeight - padding * 2,
      0,
      0,
      this.width,
      this.height
    );
  }
```

- **drawFrame**: Draws a specific frame from the sprite sheet on the canvas.

  - `frameX` and `frameY` are calculated to determine the position of the frame within the sprite sheet.
  - `naturalFrameWidth` and `naturalFrameHeight` represent the dimensions of each frame within the sprite sheet.
  - `this.ctx.drawImage(...)`: Draws the calculated frame onto the canvas, scaling it to fit the specified dimensions.

The `padding` is used to ensure frames are drawn correctly without overlapping.

But do not believe a word of what I say, try it yourself 🥸 [here](https://stackblitz.com/edit/animated-sprite-angular-canvas?file=src%2Fcanvas-animation.component.ts,src%2Fmole.component.ts)

## 🌟 Conclusion: Wrapping Up Part 1

In this first part of our series on creating a Wack-A-Molee game with AnalogJs and Canvas, we've laid the groundwork by understanding the basic mechanics of the game and exploring the core component responsible for sprite animations. We've dissected the `AnimatedSpriteComponent`, looking at how it uses canvas to render and animate sprites efficiently.

We've used some of the latest **Angular** features like Signal Inputs and Signal Queries.

In the next part of the series, we'll dive deeper into game mechanics, adding interactivity and logic to bring the Wack-A-Molee game to life. Stay tuned as we continue building this fun game step by step!

---

If you found this article insightful, don't hesitate to connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Let's embark on this journey of discovery and innovation together! 💻🚀📘

Feeling generous? Show some love and [buy me a coffee](https://www.buymeacoffee.com/luishcastrv). Your support is greatly cherished! ☕️
