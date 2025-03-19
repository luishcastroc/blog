---
title: Exploring Angular Resource API
slug: angular-http-resource
otherSlug: http-resource-angular
description: An introduction to Angulars experimental Resource API and HTTP integration.
author: Luis Castro
coverImage: v1712246484/angular-resource.jpg
date: 03-19-2025
---

## Introduction

It's been a while since my last article, but I couldn't pass up the opportunity to discuss this exciting new feature Angular is experimenting with.

Angular continuously introduces new features aimed at simplifying developer workflows and enhancing performance. One of its most promising experimental additions is the **Resource API**, designed specifically to streamline asynchronous data fetching with built-in reactivity. In this article, we'll break down this experimental feature and explore how it could fit into Angular applications.

But first, let's quickly understand why Angular is exploring this new approach.

## 📖 Why a New Resource API?

Currently, Angular developers rely heavily on Observables and the `HttpClient` for asynchronous operations. While powerful, Observables can introduce complexity, particularly in scenarios involving reactive updates, precise error handling, or efficient streaming.

The experimental Resource API aims to address these challenges by:

- Providing a straightforward and intuitive API.
- Facilitating reactive data fetching.
- Including built-in status tracking (loading, error, success).
- Improving performance through finer-grained reactivity.

> It's essential to emphasize that this API is experimental and evolving. Certain key features like debouncing and mutations aren't fully implemented yet, as the initial focus is purely on data fetching.

Let's explore what's currently available.

## 🎯 Core Resource Interface

At the core of this API is the `Resource` interface, encapsulating reactive data fetching:

```typescript
interface Resource<T> {
  readonly value: Signal<T>;
  readonly status: Signal<ResourceStatus>;
  readonly error: Signal<Error | undefined>;
  readonly isLoading: Signal<boolean>;
  hasValue(): boolean;
}
```

### Key points:

- **value**: Holds reactive data as a Signal.
- **status**: Indicates current state (Idle, Loading, Resolved, Error).
- **error**: Captures any errors during fetch operations.
- **isLoading**: Easy-to-use loading indicator.

This setup greatly simplifies handling async data in Angular templates.

## 🛠️ Creating Resources

Angular provides a straightforward `resource` function:

```typescript
const userResource = resource({
  request: () => userId(),
  loader: async ({ value }) => fetchUser(value),
  defaultValue: null,
});
```

- **request**: Reactive input for fetching.
- **loader**: Async function performing the fetch.
- **defaultValue**: Initial placeholder value before the fetch completes.

You can easily track resource states in templates:

```typescript
@if (userResource.isLoading()) {
  Loading...
  } @else if (userResource.hasValue()){
     {{ userResource.value().name }}
     } @else if (userResource.status() === ResourceStatus.Error) {
      Error: {{ userResource.error().message }}
  }
```

## 🚀 Specialized HTTP Resources

Angular simplifies HTTP fetching further with `httpResource`:

```typescript
const products = httpResource('/api/products');
```

It integrates directly with Angular's existing `HttpClient`, supporting reactive patterns and automatically parsing JSON responses by default.

You can customize your requests:

```typescript
const productDetail = httpResource({
  url: `/api/products/${productId()}`,
  method: 'GET',
  headers: { Authorization: 'Bearer token' },
});
```

### Additional Response Types

`httpResource` also supports different response formats:

- **ArrayBuffer**: `httpResource.arrayBuffer()`
- **Blob**: `httpResource.blob()`
- **Text**: `httpResource.text()`

Example of fetching binary data:

```typescript
const fileData = httpResource.arrayBuffer('/file.bin');
```

## 🎛️ Advanced Features

### Type Safety with Runtime Validation

For enhanced type safety, Angular’s Resource API integrates smoothly with runtime validation libraries like Zod:

```typescript
const ProductSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
});

const product = httpResource('/api/product', { parse: ProductSchema.parse });
```

### Resource Streaming

Resources can handle streaming responses:

```typescript
const streamResource = resource({
  stream: async ({ value }) => fetchStreamedData(value),
});
```

### RxJS Integration

Existing Observables can easily integrate with `rxResource`:

```typescript
const observableResource = rxResource({
  stream: param => observableService.getData(param),
});
```

## 🌟 Status and Error Handling

Resources clearly distinguish between different loading states (initial load vs. reload):

```typescript
enum ResourceStatus {
  Idle,
  Loading,
  Reloading,
  Resolved,
  Error,
  Local,
}
```

Explicit state tracking simplifies error handling in templates:

```typescript
@let resourceStatus = resource.status();
@let error = resource.error();
@if (resourceStatus === ResourceStatus.Loading) {
   Loading...
} @else if (resourceStatus === ResourceStatus.Resolved) {
  Data Loaded
} @else if (resourceStatus === ResourceStatus.Error) {
  Error: {{ error.message }}
}
```

## ⚙️ Prefetching and Deferred Loading

Resources seamlessly integrate with deferred loading (`@defer` blocks), optimizing application performance:

```html
<button #loadBtn>Load Data</button>

@defer (on interaction(loadBtn)) {
<data-cmp [data]="resource.value()"></data-cmp>
}
```

Prefetching further improves performance:

```html
@defer (prefetch on viewport(elementRef)) {
<component-cmp />
}
```

## 📌 Migration and Limitations

This API is experimental, so please consider the following:

- Observables integrate smoothly.
- Structural directives remain compatible.
- Essential features like mutations and debouncing aren't yet implemented.

Exercise caution when adopting experimental APIs, especially in production environments.

if you want to participate in the discussion or contribute to the development of this feature, you can join the [Angular Resource API RFC](https://github.com/angular/angular/discussions/60121). i alredy learn a lot from the discussion and i hope you can learn too.

## 🚦 Conclusion

Angular’s experimental Resource API presents an exciting new direction for async data management, addressing existing complexity and enhancing performance. While still evolving, it's definitely worth keeping an eye on.

Angular remains committed to improving the developer experience—making it easier to build better, faster applications. 🚀✨

Want to discuss this further or share your thoughts? Connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/), or [BlueSky](https://bsky.app/profile/mrrobot.dev). Let’s explore this together! 💻☕️

If you found this guide helpful, feel free to [buy me a coffee](https://www.buymeacoffee.com/luishcastrv). Your support means a lot! ☕️🙏
