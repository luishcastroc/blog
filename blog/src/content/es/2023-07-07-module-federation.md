---
title: Desbloqueando el Poder de los Micro-Frontends, Un Viaje Guiado del Monolito al Modular
slug: module-federation
otherSlug: module-federation
description: Resumen breve sobre Micro Frontends con Module Federation y Nx Mono Repos.
author: Luis Castro
coverImage: v1691372381/mf-cover.webp
date: 07-07-2023
---

En el mundo del desarrollo web, las aproximaciones arquitectónicas están en constante evolución. Un enfoque transformador que está ganando terreno es el cambio de las estructuras monolíticas tradicionales a micro-frontends. En este artículo, nos adentramos en el fascinante mundo de los micro-frontends basándonos en el artículo de investigación "Micro-Frontends: Una revisión literaria multivocal" de Severi Peltonen, Luca Mezzalira y Davide Taibi.

## ¿Qué son los Micro-Frontends?

Los micro-frontends son un patrón arquitectónico modular para aplicaciones frontend. A diferencia de los frontends monolíticos, están compuestos por sub-aplicaciones independientes y autónomas. Cada micro-frontend puede ser desarrollado, probado y desplegado de forma independiente por diferentes equipos, lo que permite una mayor flexibilidad y escalabilidad.

## ¿Por qué pasar de Frontends Monolíticos a Micro-Frontends?

La transición a micro-frontends es impulsada por los desafíos que presentan los frontends monolíticos a medida que crecen en complejidad. Los micro-frontends ofrecen una solución para gestionar y escalar el desarrollo frontend dividiéndolo en partes más pequeñas y manejables. Al adoptar micro-frontends, las organizaciones pueden permitir que los equipos trabajen de forma independiente, fomentando la innovación y acelerando los ciclos de desarrollo.

Sin embargo, la adopción de micro-frontends trae consigo su propio conjunto de desafíos. A medida que el sistema se vuelve más distribuido, la complejidad aumenta y se requiere una cuidadosa coordinación para garantizar la consistencia e integración sin fisuras.

## Explorando Micro-Frontends con Module Federation

Un enfoque para implementar micro-frontends es aprovechando el poderoso plugin Module Federation de Webpack. Este plugin permite que las aplicaciones JavaScript carguen dinámicamente código de otros proyectos en tiempo de ejecución. Combinando la magia de Module Federation con un marco de construcción como Nx (en el que nos centraremos en este artículo), los desarrolladores pueden liberar el potencial completo de los micro-frontends. Sin embargo, si estás interesado en explorar otras soluciones, puedes consultar la informativa serie de 10 artículos sobre [La Revolución de los Microfrontend: Module Federation en Webpack 5](https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-module-federation-in-webpack-5/) de Angular Architects.

## Embarcándonos en el Viaje de Micro-Frontends con Nx y Module Federation

Para embarcarse en el viaje de micro-frontends, los desarrolladores pueden utilizar Nx, un marco de construcción potente que aporta estructura y organización a las aplicaciones. Con la arquitectura monorepo de Nx, los desarrolladores pueden gestionar eficientemente múltiples micro-frontends dentro de un único repositorio de código. Al integrar el complemento Module Federation, los micro-frontends pueden interactuar e intercambiar funcionalidad sin problemas, creando una experiencia de usuario cohesiva a través de diferentes sub-aplicaciones.

## El Caso de Uso de Angular

Personalmente, me encanta Angular y, con todos los cambios que el equipo está introduciendo, está mejorando aún más. Puedes consultar estos cambios aquí [Qué hay de nuevo en Angular 16](https://dev.to/this-is-angular/whats-new-in-angular-16-375b). Así que vamos a ver cómo, utilizando las herramientas `Nx`, podemos generar un proyecto Module Federation listo para comenzar a programar con todos los beneficios (así como las desventajas que mencionaré) de una arquitectura monorepo y micro frontend.

Primero, necesitamos generar un nuevo espacio de trabajo nx:

```shell
npx create-nx-workspace@latest --preset=empty --name=mf-example && cd mf-example && npm i @nx/angular
```

Una vez que todo se ejecuta, deberíamos tener un espacio de trabajo **Nx** adecuado sin aplicaciones, ¿simple, verdad? Llamémoslo `shell npm init` con azúcar.

Ahora necesitamos empezar a agregar nuestros proyectos. Para este ejemplo, añadiré un host y dos remotos. Los llamaremos **main** (para el host), **dashboard** y **settings**.

Primero añadiremos la aplicación **main** con este comando:

```shell
nx g host main --standalone --standaloneConfig --style=scss --addTailwind
```

ahora añadiremos los remotos con este comando:

```shell
nx g remote dashboard --host=main --standalone --standaloneConfig --style=scss --addTailwind
```

```shell
nx g remote settings --host=main --standalone --standaloneConfig --style=scss --addTailwind
```

Deberíamos tener una estructura de carpetas como esta:

```shell
.
├── README.md
├── apps
│   ├── dashboard
│   ├── dashboard-e2e
│   ├── main
│   ├── main-e2e
│   ├── settings
│   └── settings-e2e
├── jest.config.ts
├── jest.preset.js
├── libs
├── nx.json
├── package-lock.json
├── package.json
├── tools
│   └── tsconfig.tools.json
└── tsconfig.base.json
```

## Enfoque del Mono Repositorio

Así que, ya que estamos usando Nx para nuestro proyecto, podemos obtener todas las ventajas de un monorepositorio combinado con una arquitectura micro-frontend. Sin embargo, este enfoque viene con algunas consideraciones que se mencionan en el artículo de Angular Architects.

Específicamente, los equipos necesitan acordar una versión de las dependencias, como Angular (en nuestro ejemplo, estamos usando esta decisión), y establecer un ciclo de actualización común para ellas. En otras palabras, sacrificamos algo de libertad para prevenir conflictos de versión y evitar aumentar el tamaño de los paquetes.

Antes de ejecutar nuestra aplicación, mejoremos su apariencia instalando una biblioteca de componentes para Tailwind CSS. Utilizaremos [daysi ui](https://daisyui.com/), que proporciona un conjunto de componentes UI listos para usar.

Una vez instalada y configurada la biblioteca, haremos un pequeño cambio dentro del archivo `app.component.html` en nuestra aplicación principal.

```html
<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl normal-case">MF</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a routerLink="/">Home</a></li>
      <li><a routerLink="dashboard">Dashboard</a></li>
      <li><a routerLink="settings">Settings</a></li>
    </ul>
  </div>
</div>
<router-outlet></router-outlet>
```

Ahora, continuando con el ejemplo, podemos ejecutar la aplicación host `nx serve main`. Este comando ejecutará la aplicación principal y las otras dos aplicaciones para generar la **Aplicación Completa**.

Deberías ver algo como esto:

## Aplicación Principal

![Aplicación Principal](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fv2dpvg2isgx0vm0jita.png)

Si haces clic en los menús, deberías ver que la página cambia:

## Aplicación del Panel de Control

![Aplicación del Panel de Control](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/640358vp61ymlso2sd05.png)

## Aplicación de Configuración

![Aplicación de Configuración](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/238k4mo1b9o9oia3sdj8.png)

Como vemos, la página se comporta como se supone que debe comportarse para el usuario y ni siquiera notamos la diferencia, pero en el interior está ocurriendo mucho y **home**, **dashboard** y **settings** son aplicaciones independientes que se ejecutan en paralelo.

Puedes ejecutar las aplicaciones remotas con este comando:
`nx serve dashboard` y `nx serve settings`

Si quieres seguir jugando con esto, echa un vistazo a este repositorio [Ejemplo MF Angular](https://github.com/luishcastroc/mf-angular-ex)

## Comentarios Finales

La transición de frontends monolíticos a micro-frontends representa un cambio de paradigma en el desarrollo web. Aunque ofrece numerosos beneficios como flexibilidad, escalabilidad y flujos de trabajo de equipos independientes, se debe considerar cuidadosamente para gestionar la complejidad aumentada y garantizar experiencias de usuario consistentes.

Al concluir esta exploración en el mundo de los micro-frontends, reconocemos la importancia de este patrón arquitectónico en la configuración del futuro del desarrollo web. Abre nuevas posibilidades para construir aplicaciones modulares, mantenibles y escalables.

1. Peltonen, S., Mezzalira, L., & Taibi, D. (2021). Micro-Frontends: Una revisión literaria multivocal. Information and Software Technology, 136, 106571. [Enlace al artículo original](https://www.sciencedirect.com/science/article/pii/S0950584921000549)
