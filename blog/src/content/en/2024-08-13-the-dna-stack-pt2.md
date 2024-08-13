---
title: The Dotnet, Nx, AnalogJs (Angular) Stack is here - Part 2
slug: the-dna-stack-pt2
otherSlug: el-dna-stack-pt2
description: A stack is born, Building a fullstack app with .NET Core, NX, and AnalogJS (Angular). The Front End
author: Luis Castro
coverImage: v1712246484/dna-stack-2.png
date: 08-13-2024
---

## 🧬 Where were we?

**Introduction:**  
In our last post, we set up the NX workspace, generated the Analog app and the .NET app, and built our API using C# and Entity Framework. Now, we'll continue developing our notes application because, let's face it, having a solid notes app is essential.

## 🧩 The A in the DNA

If you've read my blog before, you know I'm an active collaborator with **AnalogJS**. I’m always excited to try out what the team puts together, and this time is no exception. We’re going to dive into one of the features that I find the coolest in this meta framework—I'm talking about [API Routes](https://analogjs.org/docs/features/api/overview).

## 📝 The Notes Front End

When we scaffolded the app, we got a nice-looking, functional app that can add, delete, and retrieve notes. However, it doesn't yet use a backend or persist data. So now, we’ll integrate everything to use the API we created in [Part 1 of The DNA Stack](/blog/the-dna-stack-pt1).

## 🔌 Connecting Our Front End

Let’s start by checking what we have. Since the template is pretty much the default, we’ll skip that part and focus on the component logic:

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

Here, we have almost everything set up (thanks to the Analog Team), but it's currently using tRPC. We’ll make some changes to get it working with our .NET backend. You’ll notice that we have a property that triggers the re-fetch of notes whenever we add or remove a note, and it also triggers the initial refresh inside the constructor.

Let's start by removing the files that handle tRPC functionality. We’ll delete **apps/notes/src/trpc-client.ts**, the folder **apps/notes/src/server/trpc**, and finally the folder **apps/notes/src/server/routes/trpc**.

Inside our **AnalogWelcomeComponent**, we’ll remove these two imports:

```ts
import { waitFor } from '@analogjs/trpc';
import { injectTrpcClient } from '../../trpc-client';
```

We’ll stop there for now and get back to this later.

## 🛠️ The Server API Routes

Our server routes will help us communicate with our backend in a simple way. First, navigate to **apps/notes/src/server/routes/v1**. Inside our API folder, we’ll create some files and one folder to define the routes we need (GET, POST, DELETE). The structure should look like this:

```shell
.
├── notes
│   └── [id].delete.ts
├── notes.get.ts
└── notes.post.ts
```

The route inside the folder represents the delete API call, while the ones inside `v1` handle the retrieval of notes and the adding functionality.

Now, we need to let **AnalogJs** properly recognize this internal API by updating some configuration files.

First, let’s modify **main.server.ts** to look like this:

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

Next, let’s update **app.config.ts** to look like this:

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

Here’s what we’re doing: we’re letting our Analog app know about the context of our API routes by using **provideServerContext** and **requestContextInterceptor** (both provided by Analog). With these two changes, our Analog app can now communicate seamlessly with our API routes.

Let’s start with retrieving all the notes in **notes.get.ts**. But first, add a little **error.ts** file inside the routes folder with this code:

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

This is just a helper to handle errors inside our API routes.

Now, add this code to **notes.get.ts**:

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

Next, let’s update **notes.post.ts** with this code:

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

Finally, inside the notes folder, modify **[id].delete.ts**:

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

With this, we’ve set up our server-side routes. Let me briefly explain each:

- **GET**: Retrieves all notes.
- **POST**: Adds a new note using the info from the

request body.

- **DELETE**: Deletes a note based on the provided ID.

Now, let's go back to the welcome component and start connecting the dots.

We’ll make the following changes to the component:

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

The structure is basically the same, but now there’s no trace of tRPC, and we’re using the **HttpClient** to consume the routes we just created. Since Analog now knows the context of the routes starting with `/` and they’re accessible inside the route `/api/v1/`, we just modify our process to use those instead of tRPC:

- The first declaration inside **notes$** triggers the call to get all the notes whenever the `triggerRefresh$` observable emits, and we do this initially inside the constructor.
- In all other methods, we simply switch the tRPC implementation for our HttpClient and new routes.

Now, let’s test it out:  
Run the server using `nx serve api` and then run the frontend using `nx serve notes`.

> **Note:** The order is important here to avoid errors. Sometimes Nx can get a bit messed up, so a quick `nx reset` should fix any issues you might encounter.

## 🌟 Conclusion: The DNA Stack in Action

Small but powerful, this example demonstrates the strength of these three tools working together: a **.NET** backend, the incredibly useful **Nx tools** to keep everything organized and supercharge our development process, and **Angular** enhanced by **AnalogJS**. We completed our basic notes application, but more importantly, we showed what this stack can do on a larger scale. The possibilities are endless.

If you want to check the working project (with a different name but it works at the end), check [here](https://github.com/luishcastroc/analog-dotnet)

---

If you found this article helpful, feel free to connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Let’s keep building cool stuff together! 💻🚀📘

If you’d like to support my work, consider [buying me a coffee](https://www.buymeacoffee.com/luishcastrv). Your support is greatly appreciated! ☕️
