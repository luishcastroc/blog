---
title: El Stack Dotnet, NX, AnalogJs (Angular) está aquí - Parte 2
slug: el-dna-stack-pt2
otherSlug: the-dna-stack-pt2
description: Un stack ha nacido, construyendo una aplicación fullstack con .NET Core, NX, y AnalogJS (Angular). El Front End
author: Luis Castro
coverImage: v1712246484/dna-stack-2.png
date: 08-13-2024
---

## 🧬 ¿Dónde nos quedamos?

**Introducción:**  
En nuestro último post, configuramos el espacio de trabajo de NX, generamos la aplicación de Analog y la aplicación .NET, y construimos nuestra API usando C# y Entity Framework. Ahora, continuaremos desarrollando nuestra aplicación de notas porque, seamos sinceros, tener una buena aplicación de notas es esencial.

## 🧩 La A en el DNA

Si has leído mi blog antes, sabes que soy un colaborador activo de **AnalogJS**. Siempre me emociona probar lo que el equipo crea, y esta vez no es la excepción. Vamos a sumergirnos en una de las características que encuentro más interesantes en este meta framework—estoy hablando de las [Rutas API](https://analogjs.org/docs/features/api/overview).

## 📝 El Front End de Notas

Cuando generamos la aplicación, obtuvimos una app funcional y con buen diseño que puede agregar, eliminar y recuperar notas. Sin embargo, aún no utiliza un backend ni persiste los datos. Así que ahora, integraremos todo para usar la API que creamos en [Parte 1 del DNA Stack](/blog/the-dna-stack-pt1).

## 🔌 Conectando nuestro Front End

Empecemos por revisar lo que tenemos. Dado que el template es básicamente el predeterminado, vamos a saltarnos esa parte y enfocarnos en la lógica del componente:

```ts
export class AnalogWelcomeComponent {
  private _trpc = injectTrpcClient();
  public triggerRefresh$ = new Subject<void>();
  public notes$ = this.triggerRefresh$.pipe(
    switchMap(() => this._trpc.note.list.query()),
    shareReplay(1)
  );
  public newNote = '';

  constructor() {
    void waitFor(this.notes$);
    this.triggerRefresh$.next();
  }

  public noteTrackBy = (index: number, note: Note) => {
    return note.id;
  };

  public addNote(form: NgForm) {
    if (!form.valid) {
      form.form.markAllAsTouched();
      return;
    }
    this._trpc.note.create
      .mutate({ note: this.newNote })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
    this.newNote = '';
    form.form.reset();
  }

  public removeNote(id: number) {
    this._trpc.note.remove
      .mutate({ id })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
  }
}
```

Aquí, tenemos casi todo configurado (gracias al equipo de Analog), pero actualmente está usando tRPC. Haremos algunos cambios para que funcione con nuestro backend .NET. Notarás que tenemos una propiedad que desencadena la recarga de las notas cada vez que agregamos o eliminamos una nota, y también activa la actualización inicial dentro del constructor.

Comencemos eliminando los archivos que manejan la funcionalidad de tRPC. Eliminaremos **apps/notes/src/trpc-client.ts**, la carpeta **apps/notes/src/server/trpc**, y finalmente la carpeta **apps/notes/src/server/routes/trpc**.

Dentro de nuestro **AnalogWelcomeComponent**, eliminaremos estos dos imports:

```ts
import { waitFor } from '@analogjs/trpc';
import { injectTrpcClient } from '../../trpc-client';
```

Nos detendremos ahí por ahora y volveremos a esto más tarde.

## 🛠️ Las Rutas API del Servidor

Nuestras rutas del servidor nos ayudarán a comunicarnos con nuestro backend de manera sencilla. Primero, navega a **apps/notes/src/server/routes/v1**. Dentro de nuestra carpeta API, crearemos algunos archivos y una carpeta para definir las rutas que necesitamos (GET, POST, DELETE). La estructura debería verse así:

```shell
.
├── notes
│   └── [id].delete.ts
├── notes.get.ts
└── notes.post.ts
```

La ruta dentro de la carpeta representa la llamada API para eliminar, mientras que las de dentro de `v1` manejan la recuperación de notas y la funcionalidad de agregar.

Ahora, necesitamos permitir que **AnalogJs** reconozca adecuadamente esta API interna actualizando algunos archivos de configuración.

Primero, modifiquemos **main.server.ts** para que se vea así:

```ts
import 'zone.js/node';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { renderApplication } from '@angular/platform-server';
import { provideServerContext } from '@analogjs/router/server';
import { ServerContext } from '@analogjs/router/tokens';

import { config } from './app/app.config.server';
import { AppComponent } from './app/app.component';

if (import.meta.env.PROD) {
  enableProdMode();
}

export function bootstrap() {
  return bootstrapApplication(AppComponent, config);
}

export default async function render(
  url: string,
  document: string,
  serverContext: ServerContext
) {
  const html = await renderApplication(bootstrap, {
    document,
    url,
    platformProviders: [provideServerContext(serverContext)],
  });

  return html;
}
```

Luego, actualicemos **app.config.ts** para que se vea así:

```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFileRouter(),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
  ],
};
```

Aquí está lo que estamos haciendo: estamos informando a nuestra aplicación Analog sobre el contexto de nuestras rutas API utilizando **provideServerContext** y **requestContextInterceptor** (ambos proporcionados por Analog). Con estos dos cambios, nuestra aplicación Analog ahora puede comunicarse sin problemas con nuestras rutas API.

Comencemos con la recuperación de todas las notas en **notes.get.ts**. Pero primero, agrega un pequeño archivo **error.ts** dentro de la carpeta de rutas con este código:

```ts
import { createError } from 'h3';

export function handleFetchError(
  err: any,
  defaultMessage: string = 'An error occurred'
) {
  if (err instanceof Error) {
    const httpError = err as {
      statusCode?: number;
      statusMessage?: string;
      data?: any;
    };

    return createError({
      statusCode: httpError.statusCode || 500,
      statusMessage: httpError.statusMessage || err.message || defaultMessage,
      data: {
        detail: httpError.data || err.message,
      },
    });
  } else {
    // Handle non-Error objects
    return createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred',
      data: {
        detail: String(err),
      },
    });
  }
}
```

Esto es solo una pequeña ayuda para manejar los errores dentro de nuestras rutas API.

Ahora, agrega este código a **notes.get.ts**:

```ts
import { defineEventHandler } from 'h3';
import { handleFetchError } from '../../error';
import { Note } from 'apps/notes/src/note';

export default defineEventHandler(async () => {
  try {
    const data = await $fetch<Note[]>('http://localhost:5000/api/notes', {
      method: 'GET',
    });
    return data;
  } catch (err) {
    throw handleFetchError(err, 'An error occurred while fetching notes');
  }
});
```

Luego, actualicemos **notes.post.ts** con este código:

```ts
import { Note } from 'apps/notes/src/app/note';
import { defineEventHandler, readBody } from 'h3';
import { handleFetchError } from '../../error';

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event);
    const data = await $fetch<Note>('http://localhost:5000/api/notes', {
      method: 'POST',
      body,
    });
    return data;
  } catch (err) {
    throw handleFetchError(err, 'An error occurred while saving the note');
  }
});
```

Finalmente, dentro de la carpeta de notas, modifiquemos **[id].delete.ts**:

```ts
import { Note } from 'apps/notes/src/app/note';
import { defineEventHandler, getRouterParam, readBody } from 'h3';
import { handleFetchError } from '../../../error';

export default defineEventHandler(async event => {
  try {
    const id = getRouterParam(event, 'id');
    const data = await $fetch<Note>(`http://localhost:5000/api/notes/${id}`, {
      method: 'DELETE',
    });

    return data;
  } catch (err) {
    throw handleFetchError(err, 'An error occurred while deleting the note');
  }
});
```

Con esto, hemos configurado nuestras rutas del lado del servidor. Déjame explicarte brevemente cada una:

- **GET**: Recupera todas las notas.
- **POST**: Agrega una nueva nota utilizando la información del cuerpo de la solicitud.
- **DELETE**: Elimina una nota basada en el ID proporcionado.

Ahora, volvamos al componente de bienvenida y empecemos a conectar los puntos.

Haremos los siguientes cambios en el componente:

```ts
private http = inject(HttpClient);
public triggerRefresh$ = new BehaviorSubject<void>(undefined);
public notes$ = this.triggerRefresh$.pipe(
  switchMap(() => this.http.get<Note[]>("/api/v1/notes")),
  shareReplay(1)
);
public newNote = "";

constructor() {
  this.triggerRefresh$.next();
}

public noteTrackBy = (index: number, note: Note) => {
  return note.id;
};

public addNote(form: NgForm) {
  if (!form.valid) {
    form.form.markAllAsTouched();
    return;
  }
  const note: Omit<Note, "id"> = {
    name: this.newNote,
    createdAt: new Date().toISOString(),
  };
  this.http
    .post<Note>("/api/v1/notes", note)
    .pipe(take(1))
    .subscribe(() => this.triggerRefresh$.next());
  this.newNote = "";
  form.form.reset();
}

public removeNote(id: number) {
  this.http
    .delete(`/api/v1/notes/${id}`)
    .pipe(take(1))
    .subscribe(() => this.triggerRefresh$.next());
}
```

La estructura es básicamente la misma, pero ahora no hay rastro de tRPC, y estamos utilizando **HttpClient** para consumir las rutas que acabamos de crear. Dado que Analog ahora conoce el contexto de las rutas que comienzan con `/` y son accesibles dentro de la ruta `/api/v1/`, simplemente modificamos nuestro proceso para usar esas en lugar de tRPC:

- La primera declaración dentro de **notes$** desencadena la llamada para obtener todas las notas cada vez que el observable `triggerRefresh$` emite, y hacemos esto inicialmente dentro del constructor.
- En todos los demás métodos, simplemente cambiamos la implementación de tRPC por el uso de nuestro HttpClient y las nuevas rutas.

Ahora, probémoslo:  
Ejecuta el servidor usando `nx serve api` y luego ejecuta el frontend usando `nx serve notes`.

> **Nota:** El orden es importante aquí para evitar errores. A veces, Nx puede desordenarse un poco, por lo que un rápido `nx reset` debería solucionar cualquier problema que puedas encontrar.

## 🌟 Conclusión: El Stack DNA en Acción

Pequeño pero poderoso, este ejemplo demuestra la fortaleza de estas tres herramientas trabajando juntas: un backend **.NET**, las herramientas increíblemente útiles de **Nx** para mantener todo organizado y darle un impulso a nuestro proceso de desarrollo, y **Angular** mejorado por **AnalogJS**. Completamos nuestra aplicación básica de notas, pero lo más importante, mostramos lo que este stack puede hacer a gran escala. Las posibilidades son infinitas.

---

Si encontraste útil este artículo, no dudes en conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). ¡Sigamos construyendo cosas geniales juntos! 💻🚀📘

Si te gustaría apoyar mi trabajo, considera [invitarme un café](https://www.buymeacoffee.com/luishcastrv). ¡Tu apoyo es muy apreciado! ☕️
