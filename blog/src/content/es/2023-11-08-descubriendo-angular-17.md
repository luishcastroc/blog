---
title: Presentando Angular 17 - El Renacimiento de Angular
slug: descubriendo-angular-17
otherSlug: unveiling-angular-17
description: Profundizando en las innovadoras características de Angular 17 que mejoran el desarrollo de aplicaciones web.
author: Luis Castro
coverImage: v1696602521/angular-17-new.png
date: 11-08-2023
---

# Presentando Angular 17: El Renacimiento de Angular

El mes pasado fue el 13° aniversario de Angular 🎉, y el framework muestra que no tiene intenciones de desacelerarse.

Angular continúa su avance en la arena del desarrollo web con el lanzamiento de Angular 17. Basándose en la sólida fundación de las versiones anteriores, Angular 17 introduce características que están destinadas a redefinir la experiencia de desarrollo y el rendimiento de las aplicaciones. En este artículo, exploraremos las adiciones innovadoras que **Angular 17** trae a la mesa.

## La Evolución de Angular

La evolución de Angular ha sido nada menos que impresionante. Desde su concepción, ha crecido de un framework a una plataforma, proporcionando un conjunto extensivo de herramientas para que los desarrolladores construyan aplicaciones web dinámicas y robustas. El lanzamiento de Angular 17 representa otro hito significativo en su trayectoria, reforzando su posición en el competitivo paisaje de los frameworks de desarrollo web.

## Innovando con Angular 17

**Angular 17** is not just another update; it's by far the best one so far, introducing features that will settle the future of the framework for good. Here's a closer look at the transformative features introduced:

**Angular 17** no es solo otra actualización; es por mucho la mejor hasta ahora, introduciendo características que definirán el futuro del framework para siempre. Aquí un vistazo más cercano a las características transformadoras introducidas:

**Angular 17** no es solo otra actualización; es un testimonio del compromiso del framework con la innovación y el rendimiento. Aquí un vistazo más cercano a las características transformadoras introducidas:

### Estructuras de Control Declarativas

**Angular 17** presenta una nueva sintaxis declarativa para flujos de control dentro de las plantillas, agilizando la manera en que se maneja la renderización condicional. Esta sintaxis incorpora las familiaridades de directivas estructurales como NgIf y NgFor directamente en el núcleo del lenguaje, ofreciendo una forma más intuitiva y menos verbosa de manejar contenido dinámico.

La hermosa simplicidad de esta nueva sintaxis se ilustra mejor con un ejemplo:

```angular
@if (loggedIn) { 
  The user is logged in 
} 
@else { 
  The user is not logged in 
}
```

### Impulso al Rendimiento con el Algoritmo de Reconciliación

Con la introducción de un nuevo algoritmo de reconciliación, **Angular 17** mejora significativamente el proceso de re-renderizado. Esta mejora se traduce en actualizaciones más rápidas y eficientes de la vista, asegurando una experiencia de usuario más fluida, especialmente para aplicaciones con interfaces de usuario complejas.

Angular es increíblemente rápido ahora:

<p style="display:flex; flex-direction:column; justify-content:center; align-items:center">
<img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NWgsHKl5Zy5dNrOHIU7AAg.png" 
        alt="Angular is crazy fast now" />
</p>

### Vistas Diferidas para una Carga más Perezosa

Enfatizando el rendimiento, **Angular 17** introduce vistas diferidas, permitiendo a los desarrolladores especificar partes de la aplicación para que se carguen de manera perezosa. Esto significa que los recursos críticos pueden ser priorizados, mientras que los elementos no esenciales se cargan según sea necesario, reduciendo los tiempos de carga iniciales y optimizando el uso de recursos.

Puedes leer más sobre vistas diferidas y estructuras de control en el artículo que escribí sobre ello [aquí](https://mrrobot.dev/blog/angular-control-flow-deferred-loading).

### Señales por Todos Lados: El Nuevo Paradigma

Señalando un cambio en el modelo de programación reactiva del framework, **Angular 17** destaca los componentes basados en señales. Este movimiento integra las señales como un concepto central dentro del ecosistema de Angular, ofreciendo una forma más fluida y potente de gestionar los cambios de estado y el flujo de datos en las aplicaciones.

> "La introducción de componentes basados en señales (en versiones futuras) será un cambio radical para Angular. Es una evolución natural del modelo de programación reactiva del framework, y va a marcar una gran diferencia en la forma en que los desarrolladores construyen aplicaciones."

### El Nuevo Logo y Documentación

A medida que las capacidades de Angular se han expandido, también lo ha hecho su identidad. El renacimiento de Angular continúa con una nueva apariencia dinámica y recursos de aprendizaje mejorados. La transformación de Angular ahora se refleja en un nuevo logo, pasando del escudo rojo original a un logo hexagonal moderno con un vibrante degradado de púrpura a rosa, marcando una evolución orientada al futuro.

Paralelamente, Angular ha lanzado un nuevo sitio web de documentación, angular.dev, una vista previa beta de lo que se convertirá en el sitio web predeterminado de Angular en la v18. Este sitio introduce un viaje de aprendizaje interactivo, permitiendo a los desarrolladores aprender Angular a través de WebContainers directamente en el navegador, un paso innovador para mejorar la experiencia de aprendizaje de Angular.

<p style="display:flex; flex-direction:column; justify-content:center; align-items:center">
<img src="https://miro.medium.com/v2/resize:fit:1400/0*UC-tiSyyd6b2JNaA" 
        alt="Angular's new logo animation" />
</p>

### Tutorial Interactivo de Angular con WebContainers

El nuevo tutorial de Angular aprovecha los WebContainers para impulsar una experiencia de codificación interactiva. Este enfoque inmersivo está diseñado para ayudar tanto a los desarrolladores nuevos como a los experimentados a comprender los conceptos de Angular de una manera práctica y directa.

<p style="display:flex; flex-direction:column; justify-content:center; align-items:center">
<img src="https://miro.medium.com/v2/resize:fit:1400/0*aYaIlq4QLLwvNqud" 
        alt="Gif of the interactive Angular tutorial" />
</p>

Estas son solo algunas de las nuevas características de Angular 17, pero hay muchas más y puedes leer sobre ellas en una descripción súper completa en el [blog oficial de Angular](https://blog.angular.io/introducing-angular-v17-4d7033312e4b) (Me tomé la libertad de usar las imagenes del blog porque están súper 😁).

## ¿Qué Sigue para Angular?

El viaje no se detiene aquí. La hoja de ruta de Angular está llena de actualizaciones prometedoras que buscan simplificar aún más los flujos de trabajo de desarrollo, mejorar el rendimiento y potenciar las capacidades multiplataforma. La dedicación a la mejora continua mantiene a Angular en la vanguardia de la innovación en el desarrollo web.

**Angular 17** es más que una actualización; es una visión para el futuro del desarrollo web. Encarna la incansable búsqueda de la excelencia que los desarrolladores de Angular han llegado a esperar. A medida que el framework evoluciona, continúa empoderando a los desarrolladores para construir aplicaciones web más rápidas, eficientes y atractivas.

Mantente atento mientras continuamos descubriendo las capas de **Angular 17** y te proporcionamos información completa sobre sus capacidades.

## Conclusión

Angular 17 marca una nueva era para **Angular**, una que se ve extremadamente prometedora. Las nuevas características introducidas en esta versión y el ritmo que comenzó con la versión 14 son una señal clara de que el framework está aquí para quedarse y que seguirá evolucionando y mejorando.

Estoy realmente emocionado por el futuro de Angular y no puedo esperar para ver qué traerán las próximas versiones.

---

Si encontraste este artículo perspicaz y deseas profundizar en el vasto universo de Angular, no dudes en conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). ¡Embarquémonos juntos en este viaje de descubrimiento e innovación! 💻🚀📘

¿Te sientes generoso? Muestra algo de amor y [cómprame un café](https://www.buymeacoffee.com/luishcastrv). ¡Tu apoyo es muy apreciado! ☕️
