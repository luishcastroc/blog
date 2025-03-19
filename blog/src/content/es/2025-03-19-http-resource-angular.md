---
title: Explorando la API Resource de Angular
slug: http-resource-angular
otherSlug: angular-http-resource
description: Una introducción a la API Resource experimental de Angular e integración HTTP.
author: Luis Castro
coverImage: v1712246484/angular-resource.jpg
date: 03-19-2025
---

## Introducción

Ha pasado un tiempo desde mi último artículo, pero no podía dejar pasar la oportunidad de hablar sobre esta emocionante nueva característica con la que Angular está experimentando.

Angular introduce continuamente nuevas características con el objetivo de simplificar los flujos de trabajo de los desarrolladores y mejorar el rendimiento. Una de sus adiciones experimentales más prometedoras es la **API Resource**, diseñada específicamente para simplificar la obtención de datos asíncronos con reactividad integrada. En este artículo, desglosaremos esta característica experimental y exploraremos cómo podría encajar en las aplicaciones de Angular.

Pero primero, vamos a entender rápidamente por qué Angular está explorando este nuevo enfoque.

## 📖 ¿Por qué una nueva API resource?

Actualmente, los desarrolladores de Angular dependen en gran medida de los Observables y del `HttpClient` para operaciones asíncronas. Si bien son potentes, los Observables pueden introducir complejidad, especialmente en escenarios que involucran actualizaciones reactivas, manejo preciso de errores o transmisión eficiente.

La API Resource experimental tiene como objetivo abordar estos desafíos mediante:

- Proporcionar una API sencilla e intuitiva.
- Facilitar la obtención de datos reactivos.
- Incluir un seguimiento de estado integrado (carga, error, éxito).
- Mejorar el rendimiento a través de una reactividad más fina.

> Es esencial enfatizar que esta API es experimental y está en evolución. Todas las características clave como el debounce y las mutaciones aún no están completamente implementadas, ya que el enfoque inicial es puramente la obtención de datos.

Veamos qué está disponible actualmente.

## 🎯 Interfaz principal de Resource

En el núcleo de esta API se encuentra la interfaz `Resource`, que encapsula la obtención de datos reactivos:

```typescript
interface Resource<T> {
  readonly value: Signal<T>;
  readonly status: Signal<ResourceStatus>;
  readonly error: Signal<Error | undefined>;
  readonly isLoading: Signal<boolean>;
  hasValue(): boolean;
}
```

### Puntos clave:

- **value**: Contiene datos reactivos como una señal.
- **status**: Indica el estado actual (Inactivo, Cargando, Resuelto, Error).
- **error**: Captura cualquier error durante las operaciones de obtención.
- **isLoading**: Indicador de carga fácil de usar.

Esta configuración simplifica en gran medida el manejo de datos asíncronos en las plantillas de Angular.

## 🛠️ Creación de recursos

Angular proporciona una función sencilla `resource`:

```typescript
const userResource = resource({
  request: () => userId(),
  loader: async ({ value }) => fetchUser(value),
  defaultValue: null,
});
```

- **request**: Entrada reactiva para la obtención.
- **loader**: Función asíncrona que realiza la obtención.
- **defaultValue**: Valor de marcador de posición inicial antes de que se complete la obtención.

Puedes rastrear fácilmente los estados de los recursos en las plantillas:

```typescript
@if (userResource.isLoading()) {
  Loading...
  } @else if (userResource.hasValue()){
     {{ userResource.value().name }}
     } @else if (userResource.status() === ResourceStatus.Error) {
      Error: {{ userResource.error().message }}
  }
```

## 🚀 HTTP Resource especializados

Angular simplifica aún más la obtención de HTTP con `httpResource`:

```typescript
const products = httpResource('/api/products');
```

Integra directamente con el `HttpClient` existente de Angular, admite patrones reactivos y analiza automáticamente las respuestas JSON de forma predeterminada.

Puedes personalizar tus solicitudes:

```typescript
const productDetail = httpResource({
  url: `/api/products/${productId()}`,
  method: 'GET',
  headers: { Authorization: 'Bearer token' },
});
```

### Tipos de respuesta adicionales

`httpResource` también admite diferentes formatos de respuesta:

- **ArrayBuffer**: `httpResource.arrayBuffer()`
- **Blob**: `httpResource.blob()`
- **Text**: `httpResource.text()`

Ejemplo de obtención de datos binarios:

```typescript
const fileData = httpResource.arrayBuffer('/file.bin');
```

## 🎛️ Funciones avanzadas

### Seguridad de tipos con validación en tiempo de ejecución

Para una seguridad de tipos mejorada, la API Resource de Angular se integra sin problemas con bibliotecas de validación en tiempo de ejecución como Zod:

```typescript
const ProductSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
});

const product = httpResource('/api/product', { parse: ProductSchema.parse });
```

### Resource 'Streaming'

Resource puede manejar respuestas en 'streaming':

```typescript
const streamResource = resource({
  stream: async ({ value }) => fetchStreamedData(value),
});
```

### Integración de RxJS

Los Observables existentes pueden integrarse fácilmente con `rxResource`:

```typescript
const observableResource = rxResource({
  stream: param => observableService.getData(param),
});
```

## 🌟 Estado y manejo de errores

Resource distingue claramente entre diferentes estados de carga (carga inicial vs. recarga):

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

El seguimiento explícito del estado simplifica el manejo de errores en las plantillas:

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

## ⚙️ Prefetching y carga diferida

Resource se integra sin problemas con la carga diferida (`@defer` blocks), optimizando el rendimiento de la aplicación:

```html
<button #loadBtn>Load Data</button>

@defer (on interaction(loadBtn)) {
<data-cmp [data]="resource.value()"></data-cmp>
}
```

Prefetching mejora aún más el rendimiento:

```html
@defer (prefetch on viewport(elementRef)) {
<component-cmp />
}
```

## 📌 Migración y limitaciones

Esta API es experimental, así que ten en cuenta lo siguiente:

- Los Observables se integran sin problemas.
- Las directivas estructurales siguen siendo compatibles.
- Las características esenciales como las mutaciones y el debounce aún no están implementadas.

Ejerce precaución al adoptar APIs experimentales, especialmente en entornos de producción.

Si deseas participar en la discusión o contribuir al desarrollo de esta característica, puedes unirte al [RFC de la API Resource de Angular](https://github.com/angular/angular/discussions/60121). Ya he aprendido mucho de la discusión y espero que tú también puedas aprender.

## 🚦 Conclusión

La API Resource experimental de Angular presenta una nueva dirección emocionante para la gestión de datos asíncronos, abordando la complejidad existente y mejorando el rendimiento. Aunque sigue evolucionando, definitivamente vale la pena seguirle la pista.

Angular sigue comprometido con mejorar la experiencia del desarrollador, facilitando la creación de aplicaciones mejores y más rápidas. 🚀✨

¿Quieres discutir esto más a fondo o compartir tus pensamientos? Conéctate conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/) o [BlueSky](https://bsky.app/profile/mrrobot.dev). ¡Vamos a explorar esto juntos! 💻☕️

Si encontraste esta guía útil, siéntete libre de [comprarme un café](https://www.buymeacoffee.com/luishcastrv). ¡Tu apoyo significa mucho! ☕️🙏
