---
title: La Creación de mi Web, ¡¡un viaje con AnalogJs!!
slug: como-hice-mi-blog
otherSlug: the-making-of-my-web
description: Descubriendo AnalogJs, Construyendo Mi Blog.
author: Luis Castro
coverImage: v1691372359/my-blog-cover.webp
date: 08-06-2023
---

## Introducción

Todo comenzó con un simple desplazamiento en Twitter. Entre la multitud de tweets, me encontré con un proyecto OSS llamado **AnalogJs**. Como alguien apasionado por Angular, AnalogJs capturó inmediatamente mi interés. Si tienes curiosidad, puedes profundizar en el proyecto [aquí](https://analogjs.org/).

## Mi Contribución a AnalogJs

Al adentrarme en AnalogJs, me encontré enamorado de su sólida base en Angular, un marco que aprecio profundamente. Mi interés no se limitó solo a usar el metaframework; di un paso más allá y realicé contribuciones al proyecto OSS de AnalogJs. Aunque algunos puedan percibir mis contribuciones como modestas, cada una de ellas me ha impartido lecciones invaluables, actuando como hitos en mi trayectoria como desarrollador. Para aquellos interesados en un relato detallado de mi primera contribución a AnalogJs, lo he narrado en una [entrada de blog separada](/blog), a la que les invito a explorar.

## Construyendo Mi Blog Personal

Sintiéndome inspirado, decidí embarcarme en un proyecto personal: diseñar un sitio web para mí. Un espacio humilde, este blog es donde registraría mi viaje tecnológico y compartiría los conocimientos e ideas que he recopilado con el tiempo.

### El Viaje de Creación de Marca

Antes de sumergirme en la codificación, me concentré en la creación de la marca. Comencé mi viaje pensando en un logo y nombre de dominio adecuados. Un recuerdo me llevó al momento en que había comprado un dominio inspirado en la serie 'Mr. Robot'. Una vez un apasionado fanático, este dominio había sido olvidado, perdido en los vastos corredores de Google Domains. Con el dominio ahora en mano, lo único que quedaba era el logo.

### Diseño y Colaboración con IA

El diseño no es mi punto fuerte, así que recurri a **midjourney** para obtener ayuda. A algunos les puede parecer poco convencional, pero si la idea de integrar IA con diseño suena intrigante, siempre podemos debatirlo en otro momento. Con la ayuda de la IA, se me ocurrió este logo:

<div class="flex flex-col flex-auto justify-center items-center">
  <img src="assets/logo.svg" alt="My Blog Logo" style="heigth: auto; width:15rem;">
</div>

### Del Boceto al Código

Habiendo resuelto la creación de la marca, pasé a la fase de diseño. Soy un poco tradicional, así que bosquejé el diseño en papel antes de traducirlo al código.

Después de plasmar mi diseño inicial en papel, me sumergí en el aspecto de codificación. Esta fase tuvo sus desafíos, algunos triviales y otros más complejos, pero con persistencia, logré traducir mi visión a una realidad digital.

### Tecnologías Detrás de Escena

Construir una aplicación web moderna requiere una combinación de diversas tecnologías que se unen para crear una experiencia fluida. Aquí les presento las tecnologías que utilicé para este proyecto:

#### Marco:

- **AnalogJs**: En el corazón de mi sitio web, AnalogJs, un meta-framework de Angular, potencia toda la estructura de la aplicación y el mecanismo de enrutamiento.

#### Estilo:

- **Tailwind CSS**: Para asegurar un diseño ágil y elegante, he aprovechado el poder de Tailwind CSS para un estilo basado en utilidades.
- **Componentes DaisyUI**: Basándome en Tailwind, DaisyUI proporciona un conjunto integral de componentes de UI que me permitieron diseñar interfaces de usuario consistentes y elegantes sin la necesidad de reinventar la rueda.

#### Servicio de Email:

- **Mailtrap**: Para manejar correos de contacto y asegurarme de que estén efectivamente en un entorno aislado durante la fase de prueba, Mailtrap es mi solución preferida.

#### Despliegue:

- **Vercel**: Para hacer mi sitio web accesible al mundo, elegí Vercel para el despliegue. Conocido por sus características amigables para desarrolladores e integración fluida con varios marcos, garantiza que mi sitio permanezca en línea y funcione de la mejor manera.

Con estas tecnologías, busqué lograr eficiencia, estética y escalabilidad, proporcionando una experiencia agradable para mis visitantes.

### Estructura del Proyecto

Lo primero que hice fue generar mi proyecto usando la versión NxTools del boiler plate de AnalogJs utilizando esto:

```shell
npx create-nx-workspace@latest --preset=@analogjs/platform
```

This is pretty much the project structure that i'm using.

```shell
├── index.html
├── postcss.config.js
├── project.json
├── src
│   ├── app
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.config.server.ts
│   │   ├── app.config.ts
│   │   ├── components
│   │   ├── models
│   │   ├── pages
│   │   └── svg
│   ├── content
│   │   ├── 2023-06-29-my-second-open-source-contribution.md
│   │   └── 2023-07-07-module-federation.md
│   │
│   ├── environments
│   │   ├── environment.prod.ts
│   │   └── environment.ts
│   ├── main.server.ts
│   ├── main.ts
│   ├── public
│   │   └── assets
│   ├── server
│   │   └── routes
│   ├── styles.scss
│   ├── test-setup.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.editor.json
├── tsconfig.json
├── tsconfig.spec.json
└── vite.config.ts
```

Para aquellos familiarizados con Angular, esta estructura podría parecer reconocible. Para aquellos nuevos en esto, permítanme proporcionar una breve descripción:

- **Aplicación Independiente**: A diferencia de las aplicaciones tradicionales de Angular que dependen de NgModules, esta configuración opera como una aplicación independiente. Todo el inicio ocurre dentro de `app.config.ts`.
- **Enrutamiento**: La carpeta `pages` juega un papel crucial en el enrutamiento, aprovechando la característica de enrutamiento basado en archivos de Analog.
- **Manejo de Contenido**: La carpeta `content` alberga mis publicaciones de blog. Una característica notable de **AnalogJs** es su capacidad para tratar archivos markdown como componentes, facilitando una integración de contenido sin problemas.
- **Integración con el Servidor**: La carpeta `server` contiene las rutas API, facilitando la comunicación backend para la aplicación.
- **Componentes**: Esta sección contiene todos los componentes `Angular` utilizados por la aplicación.

### Desafíos en el Camino

Cada proyecto viene con su propio conjunto de desafíos, y este no fue la excepción. Algunos de los problemas que encontré eran obviamente evidentes en retrospectiva, haciéndome preguntar cómo los pasé por alto en primer lugar. Sin embargo, no estuve solo navegando estos obstáculos. Con la inestimable ayuda y orientación de [Brandon Roberts](https://twitter.com/brandontroberts), el creador del marco AnalogJs, logré resolver estos problemas y concretar mi visión. Por lo tanto, la página debería estar ahora completamente funcional, ¡pero no duden en señalar cualquier cosa que encuentren fuera de lugar!

## Conclusión

Construir mi sitio web con AnalogJs fue un gran viaje de descubrimiento y colaboración. A lo largo del camino, me recordaron la importancia de la comunidad y las infinitas oportunidades que ofrece. Ya seas un desarrollador veterano o apenas comiences en el mundo tecnológico, espero que mi historia sirva como un faro de inspiración.

Aunque no tengo una sección de comentarios, siempre valoro las opiniones e interacciones. No duden en seguirme o conectarse conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Para aquellos interesados en profundizar en los detalles técnicos, son bienvenidos a explorar el código del proyecto en mi [GitHub](https://github.com/luishcastroc). ¡Espero nuestros encuentros digitales!

Si te gustó el articulo, puedes apoyarme (comprandome un café)[https://www.buymeacoffee.com/luishcastrv] ☕️. Te lo agradecería mucho!
