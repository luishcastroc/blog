---
title: From Scratch to Storage, Note App with AnalogJs, tRPC, Prisma and CockroachDB
slug: from-scratch-to-storage
otherSlug: de-cero-a-almacenamiento
description: Explore the basics of AnalogJs, tRPC, Prisma ORM, and CockroachDB Cloud by building a straightforward note-taking application.
author: Luis Castro
coverImage: v1691372359/analog-trpc-roach-prisma.png
date: 08-12-2023
---

## Introduction

Don't you love when things just work out of the box? Like when you power up a brand new iPhone and it effortlessly guides you through setup, or when you plug in a Google Chromecast and are instantly ready to stream your favorite shows. There's a certain magic in tools and technologies that eliminate the fuss, delivering a seamless experience from the get-go. In this article, we'll delve into the art of simplicity as we build a straightforward note application, combining **[AnalogJs](https://analogjs.org/)**, **[tRPC](https://trpc.io/)**, **[Prisma](https://www.prisma.io/)** and **[CockroachDB](https://www.cockroachlabs.com/)**

### Why Choose AnalogJs, tRPC, Prisma ORM, and CockroachDB Cloud?

- **AnalogJs**: Analog stands as a fullstack meta-framework tailored for crafting applications and websites atop Angular's foundation. Falling in line with renowned meta-frameworks like Next.JS, Nuxt, SvelteKit, and Qwik City, Analog enriches the Angular experience. Its array of features includes:

  - File-based routing
  - Support for using markdown as content routes
  - API/server route capabilities
  - Hybrid SSR/SSG support
  - Integration with Vite, Vitest, and Playwright
  - Compatibility with Angular CLI/Nx workspaces
  - A partnership with Astro for Angular components.

- **tRPC**: At its core, RPC, or "Remote Procedure Call," redefines the way we think about server-client interactions. Instead of accessing URLs as with traditional HTTP/REST APIs, you're essentially calling functions from one computer (the client) on another (the server). The philosophy? Simplify to "just functions." This seamless function-call mechanism results in more intuitive, clean, and direct interactions between client and server. Furthermore, Analog integrates tRPC out of the box, ensuring developers can make the most of this paradigm with ease.

- **Prisma ORM**: A next-gen ORM, Prisma simplifies database workflows. With auto-generated queries, a robust query engine, and a type-safe database client, it’s a boon for developers wanting to seamlessly integrate databases into their apps.

- **CockroachDB Cloud**: The appeal of CockroachDB lies in its resilience and scalability. As a cloud-native distributed SQL database, it ensures data remains consistent and available, even when parts of your app or service face issues.

## Kicking Off with Analog: Setting up Your Project

One of Analog's strengths is its seamless integration with Nx monorepos and workspaces. By leveraging a specialized workspace preset and an application generator, developers have the flexibility to either initiate a fresh Analog application or integrate it into an existing Nx workspace.

### Creating a Standalone Nx project

For those new to the ecosystem or those wanting to kick-start a separate project, Analog simplifies the process.

To scaffold a standalone Nx project, employ the `create-nx-workspace` command coupled with the `@analogjs/platform` preset:

```bash
npx create-nx-workspace@latest --preset=@analogjs/platform
```

During the initialization process, the Analog preset will prompt you for specific details. You'll be asked for the name of your application; for demonstration purposes, we'll christen it `analog-app`. But the customization doesn't stop there. You also get queried about integrating powerful tools like TailwindCSS and tRPC right from the start. Opting to include either or both ensures that the required dependencies are seamlessly installed, and the necessary configurations are appended to your project without any manual intervention.

## Setting up CockroachDB with Prisma for Your Application

With the foundation of our application in place, the next critical step is establishing our database. For this project, we'll harness the power of CockroachDB in tandem with Prisma. Here's how you can seamlessly integrate both:

### 1. Creating an Account on CockroachDB

First things first, navigate to [CockroachLabs](https://www.cockroachlabs.com) and sign up for a new account. The website is intuitive, ensuring a hassle-free sign-up process.

### 2. Setting Up Your Cluster

After registering, you'll be ushered into the process of setting up a cluster. CockroachDB’s platform, with its developer-centric design, makes this straightforward. On the **Free** tier, there's a limitation of one cluster per user. However, for our application's needs, this suffices.

#### Step 1: Initiating Cluster Creation

Click on the "Create Cluster" button.
![Create Cluster!!](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-1.png)

#### Step 2: Choosing the Plan

Select the free plan from the available options.
![Choosing the plan](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-2.png)

#### Step 3: Naming Your Cluster

Name your cluster "analog-test".
![Naming the cluster](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-3.png)

#### Step 4: SQL User Creation

Proceed to create your SQL user.
![Create SQL user](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-4.png)

#### Step 5: Secure Your Password

An autogenerated password will be provided. Copy and secure this password — losing it means starting the setup from scratch.
![Secure your password](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-5.png)

#### Step 6: Database Creation

Now, it's time to set up the database. Name it "notes-db".
![Create the database](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-6.png)

<br/>

![Name the database](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-7.png)

### 3. Integrating Prisma with Your Project

Prisma offers a powerful set of tools to help manage and interact with your database. Let's walk through the steps to seamlessly integrate Prisma into our AnalogJs project.

#### Step 1: Installing Prisma Dependencies

First, you'll need to add Prisma to your project. Use the following command:

```bash
npm install prisma --save-dev
```

#### Step 2: Initializing Prisma

Next, initiate Prisma in your project with the following command:

```bash
npx prisma init
```

Executing this command will do two things:

- Create a `prisma` folder in your project root. Inside this folder, you'll find an initial `schema.prisma` file which defines your database schema.
- Generate a `.env` file for environment variables. This file will hold the database connection details.

#### Step 3: Configuring Database Connection

Open the `.env` file and you'll find a placeholder for the database connection. Replace this with the connection details from your CockroachDB cluster. Ensure you're referencing the correct details, especially if you've named your cluster "analog-test" and your database "notes-db".

```bash
DATABASE_URL="your_cockroachdb_connection_string_here"
```

### 4. Transitioning from Array to Database Integration

The provided Analog app comes with a straightforward notes application. The initial implementation stores notes in an in-memory array, which is excellent for rapid prototyping but lacks persistence. To build a more robust application, we'll transition from this array storage to a persistent database using Prisma and our CockroachDB setup.

#### Step 1: Understand the Existing Structure

Before embarking on modifications, take a moment to acquaint yourself with the foundational layout of the current app. Pay special attention to the highlighted files, as we'll either tweak the existing ones or establish those yet to be created:

![Analog app structure](https://res.cloudinary.com/lhcc0134/image/upload/v1691875369/analog-app-structure.png)

Key areas in this snapshot are:

- **Pages**: The heart of file-based routing magic. Nested within, our homepage makes use of the `analog-welcome.component.ts`. This file will undergo modifications once all configurations are squared away.

- **server/trpc**: This will serve as our hub for setting up and managing all tRPC procedures, ensuring smooth integration with Prisma.

- **Prisma folder (at the project's root)**: This is where we'll outline our schema. Prisma will harness this schema to spawn the necessary TypeScript types and piece together the essentials for a seamless database experience.

![Analog app structure - root](https://res.cloudinary.com/lhcc0134/image/upload/v1691875650/analog-root.png)

#### Step 2: Modify the Prisma Schema

Our next move is to head over to the Prisma folder and adjust our schema. This involves introducing the `Note` model and specifying our provider. Here's the updated schema:

```go
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "cockroachdb"
  url      = env("DATABASE_URL")
}

model Note {
  id        String   @id @default(uuid())
  note      String
  createdAt DateTime @default(now())
}
```

Let's break down the changes:

- **Provider**: We've set our provider to `cockroachdb`, aligning with the database we're using.
- **Note Model**: This model will map to a `Note` table in our database. The table will encompass columns `id`, `note`, and `createdAt`. The `id` column is auto-populated using the `uuid()` function, ensuring a unique identifier for each note. Concurrently, the `createdAt` column captures the timestamp of the note's inception.

The configurations look good and set the stage for our database operations.

#### Step 3: Fetching the Connection String from CockroachDB Dashboard

Venturing back to the CockroachDB dashboard, it's now time to retrieve our database connection string. If you've safely stored that auto-generated password (as recommended earlier), we'll be using it shortly.

To find the connection string:

1. Navigate to your CockroachDB dashboard.
2. Spot and click on the `Connect` button.
3. When prompted with language/framework options, select `JavaScript/TypeScript` followed by `Prisma`.
4. The dashboard will then present you with your connection string tailored for Prisma.

![Cockroach Connection](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/connect-string.png))

Ensure you replace the `<ENTER_SQL_USER_PASSWORD>` placeholder in the connection string with the password you saved earlier. This is crucial to establish a successful connection to our database. With the connection string in hand, we'll integrate it into our project in the next step.

#### Step 4: Updating the `.env` File with Our Connection String

Having acquired our connection string from the CockroachDB dashboard, we'll now proceed to integrate it into our project. The `.env` file, which was created by Prisma during initialization, is the designated place for such configurations.

Navigate to the `.env` file in your project directory. You'll likely find a default database URL already present. We will replace it with our new connection string:

```shell
DATABASE_URL="postgresql://luishcastroc:<ENTER-SQL-USER-PASSWORD>@analog-prisma-4966.g8z.cockroachlabs.cloud:26257/notes-db?sslmode=verify-full"
```

Remember to substitute `<ENTER-SQL-USER-PASSWORD>` with the password you saved earlier from CockroachDB.

By updating this connection string, we're essentially providing our application with the necessary credentials and details to interact with our CockroachDB instance. Always ensure your `.env` file is protected and not accidentally committed to public repositories to safeguard your database credentials.

#### Step 5: Applying Prisma Migrations

Prisma Migrations allow you to keep your database schema and Prisma schema in sync with one another. It's one of the features that makes working with Prisma a delightful experience.

To apply our first migration, and consequently, have our database reflect the `Note` model from our Prisma schema, execute the following command:

```bash
npx prisma migrate dev --name init
```

Upon successful execution, this command performs a few tasks:

1. It generates SQL migration files in the `prisma/migrations` directory based on the changes detected in your Prisma schema.
2. It runs the migrations, updating your database schema.
3. It also generates a new `PrismaClient` internally, enabling type-safe database access.

If everything is set up correctly (and the database connection is accurate), your CockroachDB instance should now have a `Note` table reflecting the structure we defined earlier.

If you're curious about how the migration should look like, this is what is generated:

```sql
-- CreateTable
CREATE TABLE "Note" (
    "id" STRING NOT NULL,
    "note" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);
```

**Pretty Cool right??**

If everything went well you should see the new tables generated using your cockroachdb dashboard:

![NoteDB Tables Generated](https://res.cloudinary.com/lhcc0134/image/upload/v1691877369/note-db.png)

#### Step 6: Setting Up Analog/TRPC Integration with Prisma

To harness the full potential of the Analog/TRPC integration, we need to instantiate a Prisma client. This client will act as the primary conduit between our Analog application and our CockroachDB database, ensuring type-safe database operations throughout.

Start by creating a file named `prisma.ts` inside the `server/trpc` directory. Populate it with the following code:

```ts
/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient = prismaGlobal.prisma ?? new PrismaClient();
prismaGlobal.prisma = prisma;
```

In this snippet, we are leveraging a global caching mechanism to ensure a single instance of the Prisma client throughout our application's lifecycle. This setup avoids potential database connection issues, especially when working with serverless deployments.

#### Step 7: Setting Up the Notes Router

Now that our Prisma client is in place, the next logical step is to set up our CRUD operations to interact with our database. Conveniently, Analog has generated a default `notes.ts` file inside the `routers` directory for us. This file will act as the router for our note operations.

Replace or modify the contents of the `notes.ts` file with the following code:

```ts
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
// Import our prisma instance and the Prisma client
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

/**
 * Default selector for Note.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultNoteSelect = Prisma.validator<Prisma.NoteSelect>()({
  id: true,
  note: true,
  createdAt: true,
});

export const noteRouter = router({
  create: publicProcedure
    .input(
      z.object({
        note: z.string(),
      })
    )
    .mutation(({ input }) =>
      prisma.note.create({
        data: {
          note: input.note,
        },
        select: defaultNoteSelect,
      })
    ),
  list: publicProcedure.query(() => {
    return prisma.note.findMany({
      select: defaultNoteSelect,
    });
  }),
  remove: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.note.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
```

In the above code:

- We're importing necessary modules and our previously created Prisma instance.
- We define a default selector for our Note to ensure we're explicitly specifying the data we wish to retrieve, which helps to avoid unintended data leaks.
- We then declare our `noteRouter` and outline the CRUD operations (create, list, and remove) for notes, leveraging the power of tRPC and Prisma together.

With this setup, our backend logic is now well-prepared to interact with our database in a type-safe manner!

But, before everything falls into place, there's a slight adjustment needed in the pre-existing `note.ts` model that Analog provides by default. Update the code as follows:

```typescript
export type Note = {
  id: string;
  note: string;
  createdAt: string;
};
```

### Step 8: Update the Analog-Welcome Component

Now, navigate to the `analog-welcome.component` and modify the component's logic to reflect the changes we made to the `note.ts` model. The updated component should look like this:

```typescript
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

  public removeNote(id: string) {
    this._trpc.note.remove
      .mutate({ id })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
  }
}
```

Now our model types and our component types match which will avoid development errors.

### Step 9: Unraveling the `AnalogWelcomeComponent` Logic

Now that we have integrated the `AnalogWelcomeComponent` with our Prisma-backed tRPC services, it's essential to understand its internals. Let's dissect the code:

1. **Dependency Injection of tRPC Client**:

   ```typescript
   private _trpc = injectTrpcClient();
   ```

   This action injects the tRPC client, a pivotal tool that allows the component to seamlessly communicate with the tRPC server and, by extension, with our database.

2. **The Notes Stream**:

   ```typescript
   public triggerRefresh$ = new Subject<void>();
   public notes$ = this.triggerRefresh$.pipe(
     switchMap(() => this._trpc.note.list.query()),
     shareReplay(1)
   );
   ```

   Here, we create an observable stream of notes. The marvel is that whenever `triggerRefresh$` emits a value, it sets in motion a query to retrieve all the notes. The `shareReplay(1)` makes sure that the latest fetched list of notes is consistently shared among all subscribers, without the need to fetch again.

3. **Component's Initialization**:

   ```typescript
   constructor() {
     void waitFor(this.notes$);
     this.triggerRefresh$.next();
   }
   ```

   The moment the component springs to life, it invokes a refresh to pull all existing notes by broadcasting a value through the `triggerRefresh$` subject.

4. **The "Add Note" Mechanism**:

   ```typescript
   public addNote(form: NgForm) {
     ...
   }
   ```

   This function is where notes get added. It first ascertains the form's validity. Then, with the tRPC client's assistance, it introduces the new note into the database. Upon successful addition, it instigates a refreshing of the notes list.

5. **The "Remove Note" Mechanism**:
   ```typescript
   public removeNote(id: string) {
     ...
   }
   ```
   This function oversees note deletion. Employing the tRPC client, it ejects the note from the database using its specific ID. Post-deletion, it triggers a fresh fetch of the notes list.

In essence, the `AnalogWelcomeComponent` forms the heart of our application. It interacts with our tRPC services, which in turn, tap into the power of Prisma and our database. The resulting symphony ensures a dynamic, real-time note-taking application!

### Step 10: Fire It Up and Test!

With all our integrations and changes in place, it's time to see our application in action!

To start our development server, we'll use the following command:

```bash
nx serve analog-app
```

Upon executing the command `nx serve analog-app`, NX will initiate the compiling process for your project and soon after, launch the development server. Once it completes, you should see an output detailing the port number where the application is running, typically `http://localhost:4200/`.

Head over to that URL in your preferred browser. If everything was set up correctly, you'll be welcomed by the Analog application's user interface. Here, you can experiment with adding, viewing, and deleting notes. Each action you perform will be mirrored in real-time in your CockroachDB database, showcasing the efficacy of our integrated setup.

![Final App in action](https://res.cloudinary.com/lhcc0134/image/upload/v1691879744/analog-app.gif)

And you can use your favorite software to connect to the database and check the results (im using [DBeaver](https://dbeaver.io/) in here)

![Database](https://res.cloudinary.com/lhcc0134/image/upload/v1691879744/final-result.png)

## Conclusion

This guide walked you through the process of integrating Analog with Prisma, tRPC, and CockroachDB. By merging these technologies, we've transformed a basic array-based app into a scalable, database-driven application. This illustrates the potential of modern development tools and frameworks in facilitating efficient and robust app development.

Wishing you fruitful coding sessions, and always keep an eye out for more opportunities to refine and enhance your applications!

While I don’t have a comment section, I always value feedback and interaction. Feel free to follow or connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). For those interested in diving deeper into the technical details, you're welcome to explore the project's code on my [GitHub](https://github.com/luishcastroc/analog-prisma). Looking forward to our digital crossings!

If you like my content and want to support me, you can do so by [buying me a coffee](https://www.buymeacoffee.com/luishcastrv) ☕️. I would really appreciate it!
