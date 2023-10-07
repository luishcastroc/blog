---
title: Entendiendo el Nuevo Flujo de Control y Carga Diferida en Angular
slug: angular-flujo-de-control-carga-diferida
otherSlug: angular-control-flow-deferred-loading
description: Un breve análisis del nuevo flujo de control en Angular y la introducción de la sintaxis de bloques diferidos.
author: Luis Castro
coverImage: v1696602521/control-flow.webp
date: 10-06-2023
---

## Introducción

Angular se está preparando para su nueva versión (versión 17) y con ella llega la introducción de dos características emocionantes: la renovada sintaxis de **Flujo de Control** y la sintaxis de **Bloques Diferidos**. En este artículo, profundizaremos en ambos, arrojando luz sobre sus funcionalidades y potencial.

Pero antes de sumergirnos en lo nuevo, retrocedamos un paso y revisemos la sintaxis actual del flujo de control.

## 📚 **La Sintaxis Actual del Flujo de Control**

Un elemento fundamental del framework es su flujo de control. Actualmente, Angular orquesta esto a través de directivas estructurales. Estas directivas, a menudo vistas como las estrellas del framework, han atendido eficientemente las necesidades de los desarrolladores. Han proporcionado soluciones a una miríada de escenarios. Sin embargo, vienen con ciertos compromisos, que el equipo de Angular tiene como objetivo abordar con la nueva sintaxis.

En la actualidad, tenemos tres directivas estructurales principales:

- **ngIf**: La directiva `*ngIf` agrega o elimina condicionalmente contenido del DOM, según la veracidad de la expresión.
- **ngFor**: La directiva `*ngFor` instancia una plantilla para cada elemento de un iterable.
- **ngSwitch**: La directiva `*ngSwitch` intercambia la estructura DOM en su plantilla según la evaluación de una expresión específica.

### ¿Entonces, por qué el cambio?

1. **Comentarios de los Desarrolladores**: El flujo de control basado en microsintaxis, aunque efectivo, no es tan intuitivo como el de otros frameworks.
2. **Nuevas Características**: Los cambios anticipados no solo buscan refinar la experiencia del desarrollador, sino también introducir nuevas funcionalidades.
3. **Adaptación a las Aplicaciones Sin Zona**: Las técnicas tradicionales de flujo de control fallan con las aplicaciones sin zona. En lugar de hacer ajustes menores al sistema existente, el equipo de Angular visualiza una revisión integral, orientada hacia un flujo de control integrado y más elegante.

## 🎉 **La Nueva Sintaxis del Flujo de Control**

Ahora, hablemos de lo nuevo, para la nueva sintaxis de flujo de control, tenemos lo siguiente:

- **@if**: con la nueva sintaxis esto reemplazará a la directiva ngIf.

```html
@if (user.type === 'primary') {
<user-profile [data]="user" />
} @else if (user.type === 'secondary') {
<user-profile [data]="user" [type]="secondary" />
} @else {
<p>The profile doesn't exist!</p>
}
```

Se ve bien verdad? Pero espera, hay más! 🤩

- **@for**: con la nueva sintaxis esto reemplazará a la directiva ngFor, y tiene varias diferencias en comparación con su predecesora.

```html
@for (user of users; track user.id) {
<user-profile [data]="user" />
}
```

Tambien puedes hace `track` por indice usando la variable `$index`:

```html
@for (user of users; track $index) {
<user-profile [data]="user" />
}
```

### Bloque @empty

Además, la nueva sintaxis de `@for` tiene un nuevo bloque `@empty` que se puede usar para mostrar un mensaje cuando el iterable está vacío.

```html
@for (something of []; track $index) {
<span class="square">{{ something }}!</span>
} @empty {
<span class="square">
  Este arreglo está vacío así que esto se mostrará al usar &#64;for con un
  bloque &#64;empty block</span
>
}
```

Un par de cosas para notar aquí (además de la sintaxis) ahora tenemos un `track` que es obligatorio y reemplaza el uso de la función `trackBy`. Determina la clave de fila que `@for` utilizará para asociar los elementos de la matriz con las vistas que crea, moviéndolos según sea necesario.

### $index y otras variables

Dentro de las vistas de fila, hay varias variables implícitas que siempre están disponibles:

| Variable | Significado                             |
| -------- | --------------------------------------- |
| $index   | Índice de la fila actual                |
| $first   | Si la fila actual es la primera fila    |
| $last    | Si la fila actual es la última fila     |
| $even    | Si el índice de la fila actual es par   |
| $odd     | Si el índice de la fila actual es impar |

Estas variables siempre están disponibles con estos nombres, pero se pueden alias a través de un segmento let:

```html
@for (item of items; track item.id; let idx = $index, e = $even) {
<span>Item #{{ idx }}: {{ item.name }}</span>
}
```

> **Track**: El equipo de Angular ha descubierto que no usar trackBy en los bucles NgFor sobre datos inmutables a menudo conduce a problemas de rendimiento. Para solucionar esto, trackBy ahora es obligatorio para estos bucles. La única excepción es cuando el bucle itera sobre Iterable<Signal<unknown>>; en este caso, trackBy está realmente prohibido para optimizar las actualizaciones de fila.

Super verdad? Continuemos! 🤓

- **@switch**: con la nueva sintaxis esto reemplazará a la directiva ngSwitch.

```html
@switch (count) { @case (0) {
<span class="square">{{ options[count].label }}</span>
} @case (1) {
<span class="square_red">{{ options[count].label }}</span>
} @default{
<span class="square_green">{{ options[count].label }}</span>
} }
```

Honestamente, creo que los cambios se ven muy bien, separan el elemento del flujo de control y lo hacen más legible y fácil de entender.

## 🎉 **Bloques Diferidos**

Ahora hablemos de uno de los rockstars de la próxima versión el `@defer`.

El diseño web moderno prioriza una experiencia de usuario óptima durante la carga de la aplicación, con métricas como Core Web Vitals que miden este rendimiento. Para mejorar esto, los desarrolladores a menudo diferencian elementos de la interfaz de usuario menos esenciales para priorizar la carga de componentes clave. Por ejemplo, una página podría cargar un video principal antes que la sección de comentarios. Aunque Angular ofrece características de carga diferida, estos métodos pueden ser intrincados. Por lo tanto, Angular está proponiendo un enfoque unificado de carga diferida, `@defer`, compatible tanto con la representación del lado del cliente como del servidor.

### ¿Cómo funciona?

Los usamos en la plantilla con el siguiente bloque `@defer(condición){...cosas diferidas}`. Una vez que hacemos esto, Angular hará que la magia ocurra y las dependencias (componentes, directivas, etc.) referenciadas dentro del bloque diferido se cargarán de manera diferida. Esto incluye todas las dependencias dentro del bloque diferido, lo que incluiría componentes, directivas y tuberías utilizadas dentro de esas dependencias.

¡¡Y personalmente creo que eso es súper genial!! 🤩

aquí hay un ejemplo:

```html
@defer (on interaction(deferButton)) {
<app-lazy />
}
```

Este pequeño bloque cargará el componente `app-lazy` una vez que el usuario interactúe con el elemento `deferButton`.

Pero hay más! 🤓

El bloque `@defer` intercambia el contenido del marcador de posición con el contenido cargado de forma diferida cuando se activa. Los desarrolladores pueden establecer esta activación usando dos opciones: `on` y `when`.

**when**: Una condición imperativa que activa el intercambio cuando se vuelve verdadera. Una vez intercambiado, no se revertirá incluso si la condición se vuelve falsa.
**on**: Un disparador declarativo, como un evento. Los disparadores predefinidos incluyen acciones como interacción o entrada en el área de visualización. Se pueden combinar múltiples disparadores, como interacción o un temporizador.
Esto garantiza una carga de contenido eficiente basada en la interacción del usuario o condiciones establecidas.

Ejemplos de esto son:

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

También podemos usar `on` y `when` juntos:

```html
<button #deferButton>
  Muestra el Componente usando &#64;defer al interactuar
</button>

@defer (when cond; on interaction(deferButton)){
<some-cmp />
}
```

### Activando Bloques Diferidos

Entonces, sabemos cómo usar el bloque `@defer`, ¿pero cómo lo activamos? Bueno, tenemos algunas opciones:

| Disparador  | Descripción                                                                        |
| ----------- | ---------------------------------------------------------------------------------- |
| idle        | Activa la carga diferida una vez que el navegador ha alcanzado un estado inactivo. |
| interaction | Activa la carga diferida en eventos como clic, enfoque, toque e ingreso.           |
| immediate   | Activa la carga diferida inmediatamente, una vez que el cliente ha terminado       |
|             | de renderizar.                                                                     |
| timer(x)    | Activa después de una duración especificada.                                       |
| hover       | Activa la carga diferida cuando el mouse pasa por encima de un área de activación. |
| viewport    | Activa el bloque diferido cuando el contenido especificado entra en el viewport.   |

Veamos un par de ejemplos:

#### viewport:

En este caso, el bloque diferido se cargará una vez que el elemento de saludo entre en el viewport.

```html
<div #greeting>Hello!</div>

@defer (on viewport(greeting)){
<greetings-cmp />
}
```

#### timer:

En este caso, el bloque diferido se cargará después de 5 segundos.

```html
@defer (on timer(5s)){
<some-cmp />
}
```

### Bloque @placeholder

Los bloques `@defer`, por defecto, están vacíos hasta que se activan. Sin embargo, con los bloques `@placeholder`, los desarrolladores pueden dictar lo que se muestra de antemano. Esto podría ser cualquier contenido, desde nodos DOM hasta componentes.

```html
@defer (when cond){
<some-cmp />
} @placeholder (minimum 500ms){
<img src="placeholder.png" />
}
```

### Bloque @loading

El bloque `@loading` indica el contenido que se mostrará mientras el bloque `@defer` recopila sus dependencias requeridas para mostrar su contenido principal. Si se omite, el bloque `@defer` seguirá mostrando el contenido del bloque `@placeholder` (si está disponible) hasta que su contenido principal esté listo.

```html
@defer (when cond){
<some-cmp />
} @loading {
<div class="loading">Loading the component...</div>
}
```

### Bloque @error

El bloque `@error` muestra una interfaz de usuario para instancias en las que la carga diferida no tiene éxito. Al igual que los bloques `@placeholder` y `@loading`, es opcional. Sin él, el bloque `@defer` no mostrará nada cuando se produzca un error de carga.

```html
@defer (when cond){
<calendar-cmp />
} @error{
<p>Failed to load the component</p>
<p><strong>Error:</strong> {{$error.message}}</p>
}
```

> **Nota**: Los bloques `@loading` , `@placeholder` y `@error` cargan su contenido de forma anticipada. Esto significa que se cargarán tan pronto como se renderice el bloque `@defer`, independientemente de si el bloque `@defer` está activado o no.

## Precarga de Recursos

Otra característica para la carga diferida es la capacidad de precargar dependencias antes de la interacción de un usuario. Esto es especialmente útil para reducir el retraso cuando un bloque diferido se vuelve activo. La sintaxis `prefetch` funciona junto con la condición principal `defer` y utiliza disparadores (`when` y/o `on`) similares a `defer`.

La distinción es que `when` y `on` controlan la representación mientras que `prefetch` determina cuándo buscar recursos. Esto le permite precargar recursos incluso antes de que un usuario vea o interactúe con un bloque diferido, asegurando una disponibilidad más rápida. Nota: convertir `prefetch when` en falso no ocultará el contenido. Para ocultar el contenido, úselo en conjunto con `if`.

```html
@defer (when cond; prefetch when cond){
<some-cmp />
}
```

## Migración

Lo que me encanta de Angular es que siempre intentan que el proceso de migración sea lo más fluido posible, y esta vez no es una excepción. El equipo de Angular está trabajando en un esquema para ayudarnos a migrar nuestro código actual a la nueva sintaxis. Este esquema debería estar disponible cuando se lance la versión.

Además, según los RFC y los comentarios del equipo de Angular, las directivas estructurales no van a ninguna parte, por lo que podemos seguir usándolas como lo hacemos hoy.

## 🎈 **Conclusión**

La introducción de la nueva sintaxis de Flujo de Control y los bloques Diferidos es un testimonio del compromiso de Angular para proporcionar herramientas de vanguardia a los desarrolladores. Estos cambios no solo simplifican la legibilidad del código sino que también mejoran el rendimiento, especialmente para aplicaciones a gran escala. Al comprender estas nuevas adiciones, los desarrolladores pueden aprovechar al máximo el ecosistema en evolución de Angular.

¡Son tiempos emocionantes para Angular y no puedo esperar a ver qué viene a continuación! 🤩

Si quieres saber más sobre ambos RFCs, puedes consultarlos aquí:

- [RFC de Flujo de Control](https://github.com/angular/angular/discussions/50719)
- [RFC de Bloques Diferidos](https://github.com/angular/angular/discussions/50716)

Además, puedes verlos en acción con este ejemplo de [StackBlitz](https://stackblitz.com/edit/angular-at?file=src%2Fmain.ts) preparado por [@Jean\_\_Meche](https://twitter.com/Jean__Meche).

Si encontraste esta exploración perspicaz y deseas profundizar en el vasto universo de Angular, no dudes en conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). ¡Embarquémonos juntos en este viaje de descubrimiento e innovación! 💻🚀📘

¿Te sientes generoso? Muestra algo de amor y [cómprame un café](https://www.buymeacoffee.com/luishcastrv). ¡Tu apoyo es muy apreciado! ☕️
