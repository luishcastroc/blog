---
title: Aprendiendo la Inyección de Dependencias de Angular con TypeScript
slug: angular-di-con-typescript
otherSlug: angular-di-typescript
description: Un análisis profundo del sistema de Inyección de Dependencias de Angular, recreado usando TypeScript puro. Comprende los conceptos básicos y el poder de la DI.
author: Luis Castro
coverImage: v1692660417/angular-di-typescript.webp
date: 09-18-2023
---

## Introducción

El sistema de Inyección de Dependencias (DI) de Angular es una de sus características más poderosas, que permite modularidad, flexibilidad y mantenabilidad en las aplicaciones. Pero, ¿cómo funciona internamente? En este artículo, recrearemos el DI de Angular utilizando TypeScript puro, arrojando luz sobre sus conceptos y mecánicas fundamentales.

## 🌱 **El Poder de la Inyección de Dependencias**

La Inyección de Dependencias es un patrón de diseño que promueve la inversión de control. En lugar de que una clase instancie sus dependencias, estas se inyectan desde el exterior. Esto conduce a un código más modular, testeable y mantenible. El sistema DI de Angular lleva este patrón al siguiente nivel, ofreciendo un sistema de inyectores jerárquico que permite la anulación de proveedores en diferentes niveles.

## 🎉 **Construyendo el Sistema DI en TypeScript**

Para entender el sistema DI de Angular, construiremos una versión simplificada utilizando TypeScript. Nuestro sistema constará de proveedores (servicios), inyectores, una jerarquía de inyectores y algunos decoradores que simularan los que Angular usa (si como `@Host` y `@Self`).

### **1. El Decorador Injectable**

El decorador Injectable es una parte crucial de nuestro sistema DI. Registra automáticamente la clase decorada con el inyector raíz, haciéndola disponible para la inyección en otras clases.

```ts
import Injector from './injectors/injector';

export function Injectable(): ClassDecorator {
  // Un decorador es una función que devuelve otra función. La función decoradora se llama con la clase objetivo como su argumento.
  return function (target: any) {
    // Obtener el inyector raíz.
    const rootInjector = Injector.getRootInstance();

    // Agregar el proveedor al inyector raíz.
    rootInjector.addProvider(target, new target());
  };
}
```

### 2. Las Clases de Inyectores

Nuestro sistema DI incluye una clase `Injector` raíz e inyectores especializados para módulos (`ModuleInjector`) y elementos (`ElementInjector`), así como el inyector de Ambiente (`EnvironmentInjector`). También tenemos un `NullInjector` para manejar casos en los que no se encuentra un proveedor. Estos inyectores especializados heredan de la clase `Injector` raíz y pueden anular proveedores en diferentes niveles.

#### Entendiendo los Diferentes Tipos de Inyectores

##### 1. Inyector Nulo (`NullInjector`)

El `NullInjector` es un tipo especial de inyector que carece de proveedores. Si intentas recuperar un proveedor de él, se genera un error. Esto sirve como un mecanismo de respaldo útil para asegurar que si un proveedor no se encuentra en ninguno de los inyectores padres, se generará un error. Esto facilita la depuración de problemas relacionados con proveedores faltantes. En la jerarquía de Angular, este es el inyector de nivel superior.

```ts
export default class NullInjector {
  getProvider(provider: any) {
    throw new Error(`No provider for ${provider}`);
  }
}
```

##### 2. Inyector Raíz (`Injector`)

La clase `Injector` sirve como la raíz de nuestro sistema de Inyección de Dependencias. Es responsable de registrar proveedores y resolver dependencias. Tiene una instancia estática `_rootInstance` para asegurar un inyector raíz singleton, un mapa `_providers` para almacenar proveedores registrados, y una propiedad `_parent` para mantener una estructura jerárquica de inyectores.

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

##### 3. Inyector de Elemento (`ElementInjector`)

El `ElementInjector` es un inyector especializado que hereda de la clase `Injector` raíz. Está diseñado para proporcionar dependencias a componentes y directivas dentro de un elemento DOM específico. Puede anular proveedores a nivel de elemento, lo que permite un control más granular.

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

##### 4. Inyector de Módulo (`ModuleInjector`)

El `ModuleInjector` es otro inyector especializado que también hereda de la clase `Injector` raíz. Se utiliza para proporcionar dependencias a componentes dentro de un módulo específico. Esto permite anulaciones de dependencia a nivel de módulo, dándote la flexibilidad de proporcionar diferentes implementaciones de un servicio para diferentes módulos.

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

##### 5. Inyector de Entorno (`EnvironmentInjector`)

El `EnvironmentInjector` en Angular es un tipo específico de inyector que forma parte de la jerarquía de inyectores de entorno, la cual existe fuera del árbol de componentes. Se puede utilizar para proporcionar dependencias a componentes independientes, rutas cargadas de forma diferida (lazy-loaded), y otras partes de tu aplicación que no forman parte de la jerarquía de componentes.

```ts
import Injector from './injector';
import { ProviderMetadata } from './provider-metadata.model';

/**
 * Inyector especializado que primero verifica un inyector específico del entorno
 * antes de recurrir a la jerarquía de inyectores estándar.
 */
export class EnvironmentInjector extends Injector {
  private _environmentInjector: Injector | null | undefined;

  /**
   * Crea una instancia de EnvironmentInjector.
   *
   * @param {Injector} parentInjector - El inyector padre.
   * @param {Injector | null} [environmentInjector] - Un inyector específico del entorno opcional.
   */
  constructor(parentInjector: Injector, environmentInjector?: Injector | null) {
    super(parentInjector);
    this._environmentInjector = environmentInjector;
  }

  /**
   * Recupera un proveedor.
   *
   * @template T - El tipo del proveedor.
   * @param {new () => T} provider - La clase del proveedor.
   * @param {ProviderMetadata} [metadata={}] - Metadatos opcionales.
   * @param {boolean} [hostOnly=false] - Si restringir al inyector del host.
   * @returns {T | undefined} - La instancia del proveedor, o indefinido si no se encuentra.
   */
  getProvider<T>(
    provider: new () => T,
    metadata: ProviderMetadata = {},
    hostOnly: boolean = false
  ): T | undefined {
    let value: T | undefined;

    // Verifica primero el inyector del entorno, si se proporciona
    if (this._environmentInjector) {
      value = this._environmentInjector.getProvider(
        provider,
        metadata,
        hostOnly
      );
    }

    if (value) return value;

    // Comportarse como el método getProvider() original si el inyector del entorno no se proporciona o el proveedor no se encuentra en el inyector del entorno
    return super.getProvider(provider, metadata, hostOnly);
  }
}
```

Al entender estos diferentes tipos de inyectores, obtendrás una visión completa de cómo funciona el sistema DI de Angular. Cada inyector tiene su rol y alcance, y saber cómo usarlos de manera efectiva es clave para dominar la Inyección de Dependencias en Angular.

### **3. Servicios (Proveedores)**

Los servicios son las clases que se inyectarán en nuestros componentes. Crearemos algunos servicios para demostrar cómo funciona el sistema DI.

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

### **4. Demostrando el Sistema DI**

Finalmente, demostraremos cómo funciona el sistema DI configurando una jerarquía de inyectores e inyectando servicios en un componente.

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
    // Obtener información del héroe, compañero, villano y logs o debug
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
      this.debugService.printName();
    }
  }
}

// Inyector especial sin proveedores
const nullInjector = new NullInjector();

// Inyector de nivel superior; padre de todos los inyectores
const rootInjector = new Injector(nullInjector);

// Inyector de módulo, un hijo de la raíz, proporciona dependencias para un módulo
const moduleInjector = new ModuleInjector(rootInjector);

// Registro de servicio para el alcance del módulo
moduleInjector.addProvider(
  LoggerService,
  new LoggerService('Proveedor de Módulo')
);
moduleInjector.addProvider(
  DebugService,
  new DebugService('Proveedor de Módulo')
);
moduleInjector.addProvider(HeroService, new HeroService());

// Inyector de elemento, un hijo del módulo, proporciona dependencias para componentes en un elemento DOM
const elementInjector: Injector = new ElementInjector(moduleInjector);
elementInjector.addProvider(
  LoggerService,
  new LoggerService('Proveedor de Elemento')
);
elementInjector.addProvider(
  DebugService,
  new DebugService('Proveedor de Elemento desde ViewProviders'),
  true
);
elementInjector.addProvider(VillainService, new VillainService());

// Descomentar para inspeccionar los proveedores en el inyector de elemento y módulo
// console.log('Proveedores del Inyector de Elemento:', [...elementInjector['_providers'].keys()]);
// console.log('Proveedores del Inyector de Módulo:', [...moduleInjector['_providers'].keys()]);

// Crea un nuevo Inyector de Entorno utilizado para proporcionar dependencias a componentes independientes, rutas cargadas de forma diferida y otras partes de tu aplicación que no forman parte de la jerarquía de componentes
const environmentInjector = new EnvironmentInjector(rootInjector);

// Registra un proveedor con el inyector del entorno
environmentInjector.addProvider(MutantsService, new MutantsService());

// Crea e inicializa el componente
const myComponent = createMyComponent(
  MyComponent,
  elementInjector,
  [new HeroService(), environmentInjector],
  true
);

// Descomentar estos para depurar la jerarquía de DI
// console.log('Inyector nulo:', nullInjector);
// console.log('Inyector raíz:', rootInjector);
// console.log('Inyector de módulo:', moduleInjector);
// console.log('Inyector de elemento:', elementInjector);
```

#### 4.1 🌳 Inyectores Jerárquicos: La Columna Vertebral del DI de Angular

Angular emplea una estructura jerárquica para sus inyectores, permitiendo un nivel de control granular para las dependencias. Nuestro ejemplo imita esto usando cuatro clases de inyector personalizadas: `NullInjector`, `Injector`, `ModuleInjector` y `ElementInjector`. Estas clases están organizadas en la siguiente jerarquía:

```shell
NullInjector
└── Injector
    └── ModuleInjector
        └── ElementInjector
```

Aquí, `NullInjector` es un inyector de nivel superior especial desprovisto de cualquier proveedor, mientras que la clase Injector sirve como el padre para todos los demás inyectores. ModuleInjector proporciona dependencias en el ámbito del módulo, y ElementInjector lo hace en el nivel del componente o DOM. Esta jerarquía permite anulaciones de proveedores en cualquier nivel.

#### 4.2 🧬 Descifrando la Inyección de Servicios: Los Detalles

En nuestra clase `MyComponent`, se utilizan varios servicios:

- **HeroService**: Inyectado directamente y utiliza el proveedor de `ModuleInjector`. Esto permite un lugar centralizado para este servicio que se usa con frecuencia.

- **LoggerService**: Decorado con `@SkipSelf()`, este servicio omite el inyector inmediato (`ElementInjector`) y toma el proveedor de su padre (`ModuleInjector`).

- **VillainService**: El uso de `@Self()` restringe la búsqueda a `ElementInjector`. Esto hace que la inyección sea más específica, asegurando que solo se consideren proveedores locales.

- **SidekickService**: Anotado con `@Optional()`, este servicio es más tolerante. Si no se encuentra, el componente no se romperá; simplemente no tendrá un `SidekickService`.

- **DebugService**: Usando `@Host()`, la búsqueda se limita al `ElementInjector` actual y sus padres, pero no a inyectores antepasados como `ModuleInjector`.

- **MutantsService**: Este servicio es proporcionado por el `EnvironmentInjector`, que no forma parte de la jerarquía estándar de inyectores. Está diseñado para suministrar dependencias a partes de la aplicación que están fuera del árbol de componentes, como componentes independientes o rutas cargadas de forma diferida.

#### 4.3 🚀 Ejecutando el Código: ¿Qué Sucede Detrás de Escena?

Cuando se ejecuta este código, suceden varias cosas secuencialmente:

1. **Se crean instancias de Injector**, respetando la jerarquía establecida.
2. **Los proveedores de servicios se registran** con estos inyectores.
3. La clase `MyComponent` se instancia y su constructor recibe los servicios según los decoradores especificados.
4. Finalmente, se invoca `ngOnInit`, interactuando con los servicios para obtener y registrar datos.

Este flujo de ejecución subraya la naturaleza intrincada pero eficiente del sistema DI de Angular.

Si quieres jugar con él o ver el código completo, puedes encontrarlo en [este proyecto de stackblitz](https://stackblitz.com/edit/angular-di-typescript-lhcc?devToolsHeight=33&file=index.ts)

## 🎈 **Conclusión**

Recrear el sistema DI de Angular en TypeScript proporciona valiosas ideas sobre su funcionamiento interno. Hemos visto cómo se registran los proveedores, cómo los inyectores mantienen una jerarquía y cómo se resuelven las dependencias. Con este entendimiento, puedes aprovechar todo el poder del DI de Angular en tus aplicaciones. Para más detalles, puedes profundizar en la [documentación oficial de Inyección de Dependencias de Angular](https://angular.io/guide/dependency-injection).

Si tienes alguna pregunta o comentario, no dudes en conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). ¡Sigamos explorando las complejidades de Angular y elevando nuestras habilidades de codificación juntos! 💻🚀📘

Si te gusta mi contenido y quieres apoyarme, puedes hacerlo [comprándome un café](https://www.buymeacoffee.com/luishcastrv) ☕️. ¡Realmente lo apreciaría!
