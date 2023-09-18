---
title: Learning Angular's Dependency Injection with TypeScript
slug: angular-di-typescript
otherSlug: angular-di-con-typescript
description: A deep dive into Angular's Dependency Injection system, recreated using pure TypeScript. Understand the core concepts and the power of DI.
aauthor: Luis Castro
coverImage: v1692660417/angular-di-typescript.webp
date: 09-18-2023
---

## Introduction

Angular's Dependency Injection (DI) system is one of its most powerful features, enabling modularity, flexibility, and maintainability in applications. But how does it work under the hood? In this article, we'll recreate Angular's DI using pure TypeScript, shedding light on its core concepts and mechanics.

## 🌱 **The Power of Dependency Injection**

Dependency Injection is a design pattern that promotes inversion of control. Instead of a class instantiating its dependencies, they are injected from the outside. This leads to more modular, testable, and maintainable code. Angular's DI system takes this pattern to the next level, offering a hierarchical injector system that allows for provider overrides at different levels.

## 🎉 **Building the DI System in TypeScript**

To understand Angular's DI system, we'll build a simplified version using TypeScript. Our system will consist of providers (services), injectors, a hierarchy of injectors and some decorators that will simulate some of the Angular decorators (yeah like `@Host` or `@Self`).

### **1. The Injectable Decorator**

The Injectable decorator is a crucial part of our DI system. It automatically registers the decorated class with the root injector, making it available for injection into other classes.

```ts
import Injector from './injectors/injector';

export function Injectable(): ClassDecorator {
  // A decorator is a function that returns another function. The decorator function is called with the target class as its argument.
  return function (target: any) {
    // Get the root injector.
    const rootInjector = Injector.getRootInstance();

    // Add the provider to the root injector.
    rootInjector.addProvider(target, new target());
  };
}
```

### 2. The Injector Classes

Our DI system includes a root `Injector` class and specialized injectors for modules (`ModuleInjector`) and elements (`ElementInjector`). We also have a `NullInjector` and `EnvironmentInjector` for handling cases where a provider is not found. These specialized injectors inherit from the root `Injector` class and can override providers at different levels.

#### Understanding the Different Types of Injectors

##### 1. Null Injector (`NullInjector`)

The `NullInjector` is a special kind of injector that lacks providers. If you attempt to retrieve a provider from it, an error is thrown. This serves as a useful fallback mechanism to ensure that if a provider is not found in any of the parent injectors, an error will be generated. This makes it easier to debug issues related to missing providers. In the Angular hierarchy, this is the top-level injector.

```ts
export default class NullInjector {
  getProvider(provider: any) {
    throw new Error(`No provider for ${provider}`);
  }
}
```

##### 2. Root Injector (`Injector`)

The `Injector` class serves as the root of our Dependency Injection system. It's responsible for registering providers and resolving dependencies. It has a static `_rootInstance` to ensure a singleton root injector, a `_providers` map to store registered providers, and a `_parent` property to maintain a hierarchical structure of injectors.

```ts
import NullInjector from './null-injector';
import { ProviderMetadata } from './provider-metadata.model';

/**
 * Injector class to handle dependency injection.
 */
export default class Injector {
  /** A static property that stores the root injector instance. */
  private static _rootInstance: Injector | null = null;

  /** A map of providers to their associated instances. */
  private _providers: Map<any, any> = new Map();

  /** A map of view providers to their associated instances. */
  private _viewProviders: Map<any, any> = new Map();

  /** The parent injector, or a null injector if this is the root. */
  private _parent: Injector | NullInjector;

  /**
   * Creates an Injector instance.
   *
   * @param {Injector | NullInjector} [parent] - The parent injector. If not provided, creates a NullInjector.
   */
  constructor(parent?: Injector | NullInjector) {
    this._parent = parent || new NullInjector();
  }

  /**
   * Gets the map of registered providers.
   *
   * @returns {Map<any, any>} The map of providers to their associated instances.
   */
  public getProviders(): Map<any, any> {
    return this._providers;
  }

  /**
   * Retrieves the root instance of the Injector.
   *
   * @returns {Injector} The root injector instance.
   */
  static getRootInstance(): Injector {
    if (!this._rootInstance) {
      this._rootInstance = new Injector();
    }
    return this._rootInstance;
  }

  /**
   * Resolves a dependency based on the token.
   *
   * @template T - Type of the provider.
   * @param {any} token - The token used to look up the provider.
   * @returns {T | undefined} - Instance associated with the provider or undefined if not found.
   */
  static resolve<T>(token: any): T | undefined {
    const rootInstance = this.getRootInstance();
    return rootInstance.getProvider(token);
  }

  /**
   * Registers a new provider and its associated instance.
   *
   * @param {any} provider - The provider to register.
   * @param {any} value - The instance associated with the provider.
   * @param {boolean} isViewProvider - If the provider is a viewProvider or not
   */
  addProvider(
    provider: any,
    value: any,
    isViewProvider: boolean = false
  ): void {
    if (isViewProvider) {
      this._viewProviders.set(provider, value);
    } else {
      this._providers.set(provider, value);
    }
  }

  /**
   * Retrieves an instance associated with the provider.
   *
   * @template T - Type of the provider.
   * @param {new () => T} provider - The provider to retrieve.
   * @param {ProviderMetadata} [metadata={}] - Metadata options.
   * @param {boolean} [hostOnly=false] - If true, only look in the current injector and its parent.
   * @returns {T | undefined} - Instance associated with the provider or undefined if not found.
   */
  getProvider<T>(
    provider: new () => T,
    metadata: ProviderMetadata = {},
    hostOnly: boolean = false
  ): T | undefined {
    let value: T | undefined;

    // If 'self' metadata is true, only look in the current injector
    if (metadata.self) {
      return this._providers.get(provider);
    }

    // If 'skipSelf' metadata is true, skip the current injector
    if (metadata.skipSelf) {
      return this._parent.getProvider(provider, { self: true }, hostOnly);
    }

    // If 'host' metadata is true and hostOnly flag is set
    if (metadata.host && hostOnly) {
      return (
        this._viewProviders.get(provider) ||
        this._parent.getProvider(provider, { self: true }, true)
      );
    } else {
      value =
        this._providers.get(provider) || this._viewProviders.get(provider);
    }

    if (value) return value;

    if (metadata.self) {
      return undefined;
    }

    return this._parent.getProvider(provider, metadata, hostOnly);
  }
}
```

##### 3. Element Injector (`ElementInjector`)

The `ElementInjector` is a specialized injector that inherits from the root `Injector` class. It's designed to provide dependencies to components and directives within a specific DOM element. It can override providers at the element level, allowing for more granular control.

```ts
import Injector from './injector';

export default class ElementInjector extends Injector {
  constructor(parent: Injector) {
    super(parent);
  }

  getProvider(provider, metadata = {}, hostOnly = false) {
    let value = this.getProviders().get(provider);
    if (!value) {
      value = super.getProvider(provider, metadata, hostOnly);
    }
    return value;
  }
}
```

##### 4. Module Injector (`ModuleInjector`)

The `ModuleInjector` is another specialized injector that also inherits from the root `Injector`. It's used to provide dependencies to components within a specific module. This allows for module-level dependency overrides, giving you the flexibility to provide different implementations of a service for different modules.

```ts
import Injector from './injector';

export default class ModuleInjector extends Injector {
  constructor(parent: Injector) {
    super(parent);
  }

  getProvider(provider, metadata = {}, hostOnly = false) {
    let value = this.getProviders().get(provider);
    if (!value) {
      value = super.getProvider(provider, metadata, hostOnly);
    }
    return value;
  }
}
```

##### 5. Environment Injector (`EnvironmentInjector`)

The `EnvironmentInjector` in Angular is a specific type of injector that's part of the environment injector hierarchy, which exists outside of the component tree. It can be used to provide dependencies to standalone components, lazy-loaded routes, and other parts of your application that are not part of the component hierarchy.

```ts
import Injector from './injector';
import { ProviderMetadata } from './provider-metadata.model';

/**
 * Specialized injector that first checks an environment-specific injector
 * before falling back to the standard injector hierarchy.
 */
export class EnvironmentInjector extends Injector {
  private _environmentInjector: Injector | null | undefined;

  /**
   * Creates an instance of EnvironmentInjector.
   *
   * @param {Injector} parentInjector - The parent injector.
   * @param {Injector | null} [environmentInjector] - An optional environment-specific injector.
   */
  constructor(parentInjector: Injector, environmentInjector?: Injector | null) {
    super(parentInjector);
    this._environmentInjector = environmentInjector;
  }

  /**
   * Retrieves a provider.
   *
   * @template T - The type of the provider.
   * @param {new () => T} provider - The class of the provider.
   * @param {ProviderMetadata} [metadata={}] - Optional metadata.
   * @param {boolean} [hostOnly=false] - Whether to restrict to the host injector.
   * @returns {T | undefined} - The provider instance, or undefined if not found.
   */
  getProvider<T>(
    provider: new () => T,
    metadata: ProviderMetadata = {},
    hostOnly: boolean = false
  ): T | undefined {
    let value: T | undefined;

    // Check the environment injector first, if it is provided
    if (this._environmentInjector) {
      value = this._environmentInjector.getProvider(
        provider,
        metadata,
        hostOnly
      );
    }

    if (value) return value;

    // Behave as the original getProvider() method if the environment injector is not provided or the provider is not found in the environment injector
    return super.getProvider(provider, metadata, hostOnly);
  }
}
```

By understanding these different types of injectors, you'll gain a comprehensive insight into how Angular's DI system works. Each injector has its role and scope, and knowing how to use them effectively is key to mastering Dependency Injection in Angular.

### **3. Services (Providers)**

Services are the classes that will be injected into our components. We'll create a few services to demonstrate how the DI system works.

**_HeroService_**

```ts
import { Injectable } from '../decorators';

@Injectable()
class HeroService {
  getHero() {
    console.log('Fetching hero from HeroService...');
    return 'Superman';
  }
}

export default HeroService;
```

**_SidekickService_**

```ts
import { Injectable } from '../decorators';

@Injectable()
class SidekickService {
  getSidekick() {
    console.log('Fetching sidekick from SidekickService...');
    return 'Robin';
  }
}

export default SidekickService;
```

**_LoggerService_**

```ts
import { Injectable } from '../decorators';

@Injectable()
export class LoggerService {
  constructor(private log: string) {}

  printName() {
    console.log(`Logging this: ${this.log}`);
  }
}
```

**_VillainService_**

```ts
import { Injectable } from '../decorators';

@Injectable()
export class VillainService {
  getVillain() {
    console.log('Fetching villain from VillainService...');
    return 'Joker';
  }
}
```

**_DebugService_**

```ts
import { Injectable } from '../decorators';

@Injectable()
export class DebugService {
  constructor(private log: string) {}

  printName() {
    console.log(`Debugging this: ${this.log}`);
  }
}
```

**_MutantService_**

```ts
import { Injectable } from '../decorators';

@Injectable()
export class MutantsService {
  getMutant() {
    console.log('Fetching a mutant from MutantsService...');
    return 'Leonardo';
  }
}
```

### **4. Demonstrating the DI System**

Finally, we'll demonstrate how the DI system works by setting up a hierarchy of injectors and injecting services into a component.

```ts
import { createMyComponent } from './create-component';
import { Host, Optional, Self, SkipSelf } from './decorators';
import ElementInjector from './injectors/element-injector';
import Injector from './injectors/injector';
import ModuleInjector from './injectors/module-injector';
import NullInjector from './injectors/null-injector';
import { DebugService } from './services/debug.service';
import { HeroService } from './services/hero.service';
import { LoggerService } from './services/logger.service';
import { SidekickService } from './services/sidekick.service';
import { VillainService } from './services/villain.service';

class MyComponent {
  constructor(
    private heroService: HeroService,
    @SkipSelf() private loggerService: LoggerService,
    @Self() private villainService?: VillainService,
    @Optional() public sideKicksService?: SidekickService,
    @Host() public debugService?: DebugService
  ) {}

  ngOnInit() {
    // Fetch hero, sidekick, villain and logger info
    console.log(this.heroService.getHero());
    if (this.sideKicksService) {
      console.log(this.sideKicksService.getSidekick());
    }
    if (this.villainService) {
      console.log(this.villainService.getVillain());
    }
    if (this.loggerService) {
      this.loggerService.printName();
    }
    if (this.debugService) {
      // New addition
      this.debugService.printName();
    }
  }
}

// Special injector without providers
const nullInjector = new NullInjector();

// Top-level injector; parent of all injectors
const rootInjector = new Injector(nullInjector);

// Module injector, a child of the root, provides dependencies for a module
const moduleInjector = new ModuleInjector(rootInjector);

// Service registration for the module scope
moduleInjector.addProvider(LoggerService, new LoggerService('Module Provider'));
moduleInjector.addProvider(DebugService, new DebugService('Module Provider'));
moduleInjector.addProvider(HeroService, new HeroService());

// Element injector, a child of the module, provides dependencies for components in a DOM element
const elementInjector: Injector = new ElementInjector(moduleInjector);
elementInjector.addProvider(
  LoggerService,
  new LoggerService('Element Provider')
);
elementInjector.addProvider(DebugService, new DebugService('Element Provider'));
elementInjector.addProvider(VillainService, new VillainService());

// Uncomment to inspect the providers in the element and module injector
// console.log('Element Injector Providers:', [...elementInjector['_providers'].keys()]);
// console.log('Module Injector Providers:', [...moduleInjector['_providers'].keys()]);

//Create a new Environment Injector used to provide dependencies to standalone components, lazy-loaded routes, and other parts of your application that are not part of the component hierarchy
const environmentInjector = new EnvironmentInjector(rootInjector);

// Register a provider with the environment injector
environmentInjector.addProvider(MutantsService, new MutantsService());

// Create and initialize the component
const myComponent = createMyComponent(
  MyComponent,
  elementInjector,
  [new HeroService(), environmentInjector],
  true
);

// Uncomment these for debugging DI hierarchy
// console.log('Null injector:', nullInjector);
// console.log('Root injector:', rootInjector);
// console.log('Module injector:', moduleInjector);
// console.log('Element injector:', elementInjector);
```

#### 4.1 🌳 Hierarchical Injectors: The Backbone of Angular DI

Angular employs a hierarchical structure for its injectors, enabling a granular level of control for dependencies. Our example mimics this using four custom injector classes: `NullInjector`, `Injector`, `ModuleInjector`, and `ElementInjector`. These classes are arranged in the following hierarchy:

```shell
NullInjector
└── Injector
    └── ModuleInjector
        └── ElementInjector
```

Here, `NullInjector` is a special top-level injector devoid of any providers, while the Injector class serves as the parent for all other injectors. ModuleInjector provides dependencies at the module scope, and ElementInjector does so at the component or DOM level. This hierarchy allows for provider overrides at any level.

#### 4.2 🧬 Decoding Service Injection: The Nitty-Gritty

In our `MyComponent` class, several services are brought into play:

- **HeroService**: Directly injected and uses the provider from `ModuleInjector`. This allows for a centralized place for this often-used service.

- **LoggerService**: Decorated with `@SkipSelf()`, this service bypasses the immediate injector (`ElementInjector`) and grabs the provider from its parent (`ModuleInjector`).

- **VillainService**: The use of `@Self()` restricts the search to `ElementInjector`. This makes the injection more specific, ensuring that only local providers are considered.

- **SidekickService**: Annotated with `@Optional()`, this service is more forgiving. If not found, the component won't break; it simply won't have a `SidekickService`.

- **DebugService**: Using `@Host()`, the search is limited to the current `ElementInjector` and its parents, but not to ancestor injectors like `ModuleInjector`.

- **MutantsService**: This service is provided by the EnvironmentInjector, which is not part of the standard injector hierarchy. It's designed to supply dependencies to parts of the application that are outside the component tree, like standalone components or lazy-loaded routes.

#### 4.3 🚀 Executing the Code: What Happens Under the Hood?

When this code runs, several things happen sequentially:

1. **Injector instances are created**, respecting the established hierarchy.
2. **Service providers are registered** with these injectors.
3. The `MyComponent` class is instantiated, and its constructor receives the services according to the specified decorators.
4. Finally, `ngOnInit` is invoked, interacting with the services to fetch and log data.

This execution flow underscores the intricate but efficient nature of Angular's DI system.

if you want to play with it or to see the full code, you can find it in [this stackblitz project](https://stackblitz.com/edit/angular-di-typescript-lhcc?devToolsHeight=33&file=index.ts)

## 🎈 **Conclusion**

Recreating Angular's DI system in TypeScript provides valuable insights into its inner workings. We've seen how providers are registered, how injectors maintain a hierarchy, and how dependencies are resolved. With this understanding, you can harness the full power of Angular's DI in your applications. For further details, you can dive deeper into the [official Angular Dependency Injection documentation](https://angular.io/guide/dependency-injection).

If you have any questions or feedback, feel free to connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Let's continue to explore the intricacies of Angular and elevate our coding skills together! 💻🚀📘

If you like my content and want to support me, you can do so by [buying me a coffee](https://www.buymeacoffee.com/luishcastrv) ☕️. I would really appreciate it!
