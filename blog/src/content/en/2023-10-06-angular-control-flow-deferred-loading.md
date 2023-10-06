---
title: Understanding The New Control Flow And Deferred Loading in Angular
slug: angular-control-flow-deferred-loading
otherSlug: angular-flujo-de-control-carga-diferida
description: A brief analysis of the new control flow in Angular and the introduction of the Deferred blocks syntax.
author: Luis Castro
coverImage: v1696602521/control-flow.webp
date: 10-06-2023
---

## Introduction

Angular is gearing up for its new release (version 17), and with it comes the introduction of two thrilling features: the revamped **Control Flow** syntax and the **Deferred blocks** syntax. In this article, we'll delve deep into both, shedding light on their functionalities and potential.

But before we dive into the new, let's take a step back and revisit the current control flow syntax.

## 📚 **The Current Control Flow Syntax**

A foundational element of the framework is its control flow. Currently, Angular orchestrates this through structural directives. These directives, often seen as the rockstars of the framework, have catered to developers' needs efficiently. They've provided solutions to a myriad of scenarios. However, they come with certain trade-offs, which the Angular team aims to address with the new syntax.

At present, we have three main structural directives:

- **ngIf**: The `*ngIf` directive conditionally adds or removes content from the DOM, based on the expression's truthiness.
- **ngFor**: The `*ngFor` directive instantiates a template for each item in an iterable.
- **ngSwitch**: The `*ngSwitch` directive swaps the DOM structure in your template based on a specific expression's evaluation.

### So, Why the Change?

1. **Developer Feedback**: The prevailing microsyntax-based control flow, although effective, isn't as intuitive as some other frameworks.
2. **New Features**: The anticipated changes not only aim to refine the developer experience but also usher in new functionalities.

3. **Adapting to Zoneless Applications**: The traditional control flow techniques falter with zoneless apps. Rather than making minor adjustments to the existing system, the Angular team envisions a comprehensive overhaul, steering towards a sleeker, built-in control flow.

## 🎉 **The New Control Flow Syntax**

So, now let's get into the new stuff, for the new control flow syntax, we have the following:

- **@if**: with the new syntax this will replace the ngIf directive.

```html
@if (user.type === 'primary') {
<user-profile [data]="user" />
} @else if (user.type === 'secondary') {
<user-profile [data]="user" [type]="secondary" />
} @else {
<p>The profile doesn't exist! }</p>
```

Looking good, right? But wait, there's more! 🤩

- **@for**: with the new syntax this will replace the ngFor directive, and has several differences compared to its structural directive predecessor.

```html
@for (user of users; track user.id) {
<user-profile [data]="user" />
}
```

A couple of things to notice here (besides the syntax) we now have a `track` that is mandatory and replaces the use of the `trackBy` function. It determines the row key which `@for` will use to associate array items with the views it creates, moving them around as needed.

### $index and other variables

Within for row views, there are several implicit variables which are always available:

| Variable | Meaning                                  |
| -------- | ---------------------------------------- |
| $index   | Index of the current row                 |
| $first   | Whether the current row is the first row |
| $last    | Whether the current row is the last row  |
| $even    | Whether the current row index is even    |
| $odd     | Whether the current row index is odd     |

These variables are always available with these names, but can be aliased via a let segment:

```html
@for (item of items; track item.id; let idx = $index, e = $even) {
<span>Item #{{ idx }}: {{ item.name }}</span>
}
```

> **Track**: The Angular team has found that not using trackBy in NgFor loops over immutable data often leads to performance issues. To fix this, trackBy is now mandatory for these loops. The only exception is when the loop iterates over Iterable<Signal<unknown>>; in this case, trackBy is actually disallowed to optimize row updates.

Cool so far? Let's keep going! 🤓

- **@switch**: with the new syntax this will replace the ngSwitch directive.

```html
@switch (count) { @case (0) {
<span class="square">{{ options[count].label }}</span>
} @case (1) {
<span class="square_red">{{ options[count].label }}</span>
} @default{
<span class="square_green">{{ options[count].label }}</span>
} }
```

Honestly i think changes looks great it detach the element from the control flow and make it more readable and easy to understand.

## 🎉 **Deferred Blocks**

Now let's talk about one of the rockstars of the upcoming version the `@defer`.

Modern web design prioritizes optimal user experience during application loading, with metrics like Core Web Vitals measuring this performance. To enhance this, developers often defer less essential UI elements to prioritize loading key components. For instance, a page might load a primary video before the comments section. While Angular offers lazy loading features, these methods can be intricate. Hence, Angular is proposing a unified deferred loading approach, `@defer`, compatible with both client and server-side rendering.

### How does it work?

We use them in the template by the following block `@defer(condition){...deferred stuff }`. Once we do this Angular will make the magic happen and the dependencies (components, directives, etc) referenced within the deferred block are going to be loaded lazily. This includes all dependencies within the deferred block, which would include components, directives, and pipes used within those dependencies.

And i personally believe that's super cool!! 🤩

here's an example:

```html
@defer (on interaction(deferButton)) {
<app-lazy />
}
```

This little block will load the `app-lazy` component once the user interacts with the `deferButton` element.

But there's more! 🤓

The `@defer` block swaps placeholder content with lazily loaded content when activated. Developers can set this activation using two options: `on` and `when`.

**when**: An imperative condition that triggers the swap when it becomes true. Once swapped, it won't revert even if the condition becomes false.
**on**: A declarative trigger, like an event. Predefined triggers include actions like interaction or entering the viewport. Multiple triggers, such as interaction or a timer, can be combined.
This ensures efficient content loading based on user interaction or set conditions.

Examples of this are:

```html
@defer (when cond) {
<some-cmp />
}
```

```html
@defer (on interaction, timer(5s)){
<some-cmp />
}
```

We can also combine them:

```html
@defer (when cond; on interaction(deferButton)){
<some-cmp />
}
```

### @placeholder Blocks

`@defer` blocks, by default, are empty until activated. However, with `@placeholder` blocks, developers can dictate what's displayed beforehand. This could be any content, from DOM nodes to components.

```html
@defer (when cond){
<some-cmp />
} @placeholder (minimum 500ms){
<img src="placeholder.png" />
}
```

**Note**: Content within `@placeholder` loads immediately, not on defer.

### @loading Blocks

The `@loading` block indicates the content to be shown while the `@defer` block is gathering its required dependencies to display its main content. If omitted, the `@defer` block will keep displaying the `@placeholder` content (if available) until its primary content is ready.

```html
@defer (when cond){
<some-cmp />
} @loading {
<div class="loading">Loading the component...</div>
}
```

**Note**: Content within `@loading` loads immediately, not on defer.

### @error Blocks

The `@error` block displays a UI for instances when deferred loading does not succeed. Like the `@placeholder` and `@loading` blocks, it's optional. Without it, the `@defer` block won't show anything upon a loading failure.

```html
@defer (when cond){
<calendar-cmp />
} @error{
<p>Failed to load the component</p>
<p><strong>Error:</strong> {{$error.message}}</p>
}
```

**Note**: Content within `@error` loads immediately, not on defer.

## Migration

What i love about Angular is that they're always trying to make the migration process as smooth as possible, and this time is no exception. The Angular team is working on an schematic to help us migrate our current code to the new syntax. This schematic should be available when the version is released.

As well as per the RFC's and comments from the Angular team the structural directives are not going anywhere, so we can keep using them as we do today.

## 🎈 **Conclusion**

The introduction of the new Control Flow syntax and Deferred blocks is a testament to Angular's commitment to providing state-of-the-art tools for developers. These changes not only simplify code readability but also enhance performance, especially for large-scale applications. By understanding these new additions, developers can harness the full potential of Angular's evolving ecosystem.

This are exciting times for Angular and i can't wait to see what's next! 🤩

If you want to know more about both RFC's you can check them out here:

- [Control Flow RFC](https://github.com/angular/angular/discussions/50719)
- [Deferred Blocks RFC](https://github.com/angular/angular/discussions/50716)

As well you can see them in action with this [StackBlitz](https://stackblitz.com/edit/angular-at?file=src%2Fmain.ts) example prepared by [@Jean\_\_Meche](https://twitter.com/Jean__Meche).

If you found this exploration insightful and wish to delve deeper into Angular's vast universe, don't hesitate to connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Let's embark on this journey of discovery and innovation together! 💻🚀📘

Feeling generous? Show some love and [buy me a coffee](https://www.buymeacoffee.com/luishcastrv). Your support is greatly cherished! ☕️
