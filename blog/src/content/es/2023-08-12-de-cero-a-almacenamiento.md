---
title: Desde Cero a Almacenamiento, Aplicación de Notas con AnalogJs, tRPC, Prisma y CockroachDB.
slug: de-cero-a-almacenamiento
otherSlug: from-scratch-to-storage
description: Explora los conceptos básicos de AnalogJs, tRPC, Prisma ORM y CockroachDB Cloud construyendo una aplicación sencilla de toma de notas.
author: Luis Castro
coverImage: v1691372359/analog-trpc-roach-prisma.png
date: 08-12-2023
---

## Introducción

¿No te encanta cuando las cosas funcionan directamente al sacarlas de la caja? Como cuando enciendes un nuevo iPhone y te guía sin esfuerzo a través de la configuración, o cuando conectas un Google Chromecast y estás listo al instante para transmitir tus programas favoritos. Hay cierta magia en las herramientas y tecnologías que eliminan las complicaciones, ofreciendo una experiencia sin problemas desde el principio. En este artículo, profundizaremos en el arte de la simplicidad mientras construimos una aplicación de notas sencilla, combinando **[AnalogJs](https://analogjs.org/)**, **[tRPC](https://trpc.io/)**, **[Prisma](https://www.prisma.io/)** y **[CockroachDB](https://www.cockroachlabs.com/)**.

### ¿Por qué elegir AnalogJs, tRPC, Prisma ORM y CockroachDB Cloud?

- **AnalogJs**: Analog es un metaframework de pila completa diseñado para crear aplicaciones y sitios web sobre la base de Angular. Siguiendo la línea de reconocidos metaframeworks como Next.JS, Nuxt, SvelteKit y Qwik City, Analog enriquece la experiencia de Angular. Sus características incluyen:

  - Enrutamiento basado en archivos
  - Soporte para utilizar markdown como rutas de contenido
  - Capacidades de rutas API/servidor
  - Soporte híbrido SSR/SSG
  - Integración con Vite, Vitest y Playwright
  - Compatibilidad con Angular CLI/Nx workspaces
  - Asociación con Astro para componentes de Angular.

- **tRPC**: En su núcleo, RPC, o "Llamada a Procedimiento Remoto", redefine la forma en que pensamos en las interacciones servidor-cliente. En lugar de acceder a URL como con las API HTTP/REST tradicionales, básicamente estás llamando a funciones de una computadora (el cliente) en otra (el servidor). ¿La filosofía? Simplificar a "solo funciones". Este mecanismo de llamada de función sin problemas resulta en interacciones más intuitivas, limpias y directas entre el cliente y el servidor. Además, Analog integra tRPC de forma nativa, asegurando que los desarrolladores puedan aprovechar al máximo este paradigma con facilidad.

- **Prisma ORM**: Como un ORM de última generación, Prisma simplifica los flujos de trabajo de la base de datos. Con consultas auto-generadas, un motor de consulta robusto y un cliente de base de datos seguro en cuanto a tipos, es una bendición para los desarrolladores que desean integrar bases de datos sin problemas en sus aplicaciones.

- **CockroachDB Cloud**: El atractivo de CockroachDB radica en su resistencia y escalabilidad. Como una base de datos SQL distribuida nativa en la nube, garantiza que los datos sigan siendo consistentes y estén disponibles, incluso cuando partes de tu aplicación o servicio enfrenten problemas.

## Iniciando con Analog: Configuración de tu Proyecto

Una de las fortalezas de Analog es su integración perfecta con monorrepos y espacios de trabajo Nx. Al aprovechar un conjunto de herramientas especializado y un generador de aplicaciones, los desarrolladores tienen la flexibilidad de iniciar una nueva aplicación de Analog o integrarla en un espacio de trabajo Nx existente.

### Creando un Proyecto Nx Independiente

Para aquellos nuevos en el ecosistema o aquellos que deseen iniciar un proyecto independiente, Analog simplifica el proceso.

Para crear un proyecto Nx independiente, utiliza el comando `create-nx-workspace` junto con el conjunto de herramientas `@analogjs/platform`:

```bash
npx create-nx-workspace@latest --preset=@analogjs/platform
```

Durante el proceso de inicialización, el conjunto de herramientas de Analog te solicitará detalles específicos. Se te pedirá el nombre de tu aplicación; para fines de demostración, lo llamaremos `analog-app`. Pero la personalización no se detiene ahí. También se te preguntará sobre la integración de herramientas poderosas como TailwindCSS y tRPC desde el principio. Optar por incluir una o ambas asegura que las dependencias requeridas se instalen sin problemas y que las configuraciones necesarias se agreguen a tu proyecto sin necesidad de intervención manual.

## Configuración de CockroachDB con Prisma para tu Aplicación

Con los cimientos de nuestra aplicación en su lugar, el siguiente paso crítico es establecer nuestra base de datos. Para este proyecto, aprovecharemos el poder de CockroachDB junto con Prisma. Así es cómo puedes integrar ambos sin problemas:

### 1. Crear una Cuenta en CockroachDB

Lo primero es lo primero, accede a [CockroachLabs](https://www.cockroachlabs.com) y regístrate para obtener una cuenta nueva. El sitio web es intuitivo y garantiza un proceso de registro sin complicaciones.

### 2. Configurar tu Clúster

Después de registrarte, te guiarán en el proceso de configuración de un clúster. La plataforma de CockroachDB, con su diseño centrado en los desarrolladores, facilita esto. En el nivel **Gratuito**, existe una limitación de un clúster por usuario. Sin embargo, para las necesidades de nuestra aplicación, esto es suficiente.

#### Paso 1: Iniciar la Creación del Clúster

Haz clic en el botón "Crear Clúster".
![¡Crear Clúster!](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-1.png)

#### Paso 2: Elegir el Plan

Selecciona el plan gratuito de las opciones disponibles.
![Elegir el plan](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-2.png)

#### Paso 3: Nombrar tu Clúster

Nombre de tu clúster "analog-test".
![Nombrar el clúster](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-3.png)

#### Paso 4: Creación del Usuario SQL

Procede a crear tu usuario SQL.
![Crear usuario SQL](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-4.png)

#### Paso 5: Asegurar tu Contraseña

Se proporcionará una contraseña autogenerada. Copia y asegura esta contraseña, perderla significa comenzar la configuración desde cero.
![Asegura tu contraseña](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-5.png)

#### Paso 6: Creación de la Base de Datos

Ahora es el momento de configurar la base de datos. Nombrala "notes-db".
![Crear la base de datos](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-6.png)

<br/>

![Nombrar la base de datos](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/create-cluster-7.png)

### 3. Integración de Prisma con tu Proyecto

Prisma ofrece un conjunto poderoso de herramientas para ayudar a administrar e interactuar con tu base de datos. Vamos a seguir los pasos para integrar Prisma sin problemas en nuestro proyecto de AnalogJs.

#### Paso 1: Instalar Dependencias de Prisma

Primero, deberás agregar Prisma a tu proyecto. Usa el siguiente comando:

```bash
npm install prisma --save-dev
```

#### Paso 2: Inicializar Prisma

A continuación, inicia Prisma en tu proyecto con el siguiente comando:

```bash
npx prisma init
```

Ejecutar este comando realizará dos acciones:

- Creará una carpeta `prisma` en la raíz de tu proyecto. Dentro de esta carpeta, encontrarás un archivo inicial `schema.prisma` que define el esquema de tu base de datos.
- Generará un archivo `.env` para las variables de entorno. Este archivo contendrá los detalles de la conexión a la base de datos.

#### Paso 3: Configuración de la Conexión a la Base de Datos

Abre el archivo `.env` y encontrarás un marcador de posición para la conexión a la base de datos. Reemplaza esto con los detalles de conexión de tu clúster de CockroachDB. Asegúrate de estar haciendo referencia a los detalles correctos, especialmente si has nombrado tu clúster "analog-test" y tu base de datos "notes-db".

```bash
DATABASE_URL="your_cockroachdb_connection_string_here"
```

### 4. Transición de una Matriz a la Integración de Base de Datos

La aplicación Analog proporcionada incluye una aplicación de notas sencilla. La implementación inicial almacena las notas en una matriz en memoria, lo cual es excelente para prototipado rápido pero carece de persistencia. Para construir una aplicación más sólida, haremos la transición desde este almacenamiento en matriz hacia una base de datos persistente utilizando Prisma y nuestra configuración de CockroachDB.

#### Paso 1: Comprender la Estructura Existente

Antes de realizar modificaciones, tómate un momento para familiarizarte con la estructura fundamental de la aplicación actual. Presta especial atención a los archivos destacados, ya que ajustaremos los existentes o crearemos los que aún no existen:

![Estructura de la aplicación Analog](https://res.cloudinary.com/lhcc0134/image/upload/v1691875369/analog-app-structure.png)

Las áreas clave en esta captura de pantalla son:

- **Páginas**: El núcleo de la magia de enrutamiento basado en archivos. En su interior, nuestra página de inicio utiliza el `analog-welcome.component.ts`. Este archivo se modificará una vez que todas las configuraciones estén listas.

- **server/trpc**: Esto servirá como nuestro centro para configurar y gestionar todos los procedimientos de tRPC, asegurando una integración fluida con Prisma.

- **Carpeta Prisma (en la raíz del proyecto)**: Aquí es donde delinearemos nuestro esquema. Prisma utilizará este esquema para generar los tipos TypeScript necesarios y ensamblar los elementos esenciales para una experiencia de base de datos sin problemas.

![Estructura de la aplicación Analog - raíz](https://res.cloudinary.com/lhcc0134/image/upload/v1691875650/analog-root.png)

#### Paso 2: Modificar el Esquema de Prisma

Nuestro próximo paso es dirigirnos a la carpeta de Prisma y ajustar nuestro esquema. Esto implica introducir el modelo `Note` y especificar nuestro proveedor. Aquí está el esquema actualizado:

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

### Paso 3: Obtener la Cadena de Conexión desde el Panel de Control de CockroachDB

Volviendo al panel de control de CockroachDB, es hora de recuperar nuestra cadena de conexión a la base de datos. Si has almacenado con seguridad esa contraseña generada automáticamente (como se recomendó anteriormente), la utilizaremos en breve.

Para encontrar la cadena de conexión:

1. Accede a tu panel de control de CockroachDB.
2. Encuentra y haz clic en el botón `Conectar`.
3. Cuando se te pregunte por las opciones de lenguaje/framework, selecciona `JavaScript/TypeScript`, seguido de `Prisma`.
4. El panel de control te proporcionará la cadena de conexión específica para Prisma.

![Conexión Cockroach](https://res.cloudinary.com/lhcc0134/image/upload/v1691874497/connect-string.png))

Asegúrate de reemplazar el marcador de posición `<ENTER_SQL_USER_PASSWORD>` en la cadena de conexión con la contraseña que guardaste anteriormente. Esto es crucial para establecer una conexión exitosa con nuestra base de datos. Con la cadena de conexión en mano, la integraremos en nuestro proyecto en el siguiente paso.

### Paso 4: Actualizar el Archivo `.env` con Nuestra Cadena de Conexión

Habiendo obtenido nuestra cadena de conexión desde el panel de control de CockroachDB, procederemos a integrarla en nuestro proyecto. El archivo `.env`, que fue creado por Prisma durante la inicialización, es el lugar designado para tales configuraciones.

Dirígete al archivo `.env` en el directorio de tu proyecto. Es probable que ya encuentres presente una URL de base de datos por defecto. La reemplazaremos con nuestra nueva cadena de conexión:

```shell
DATABASE_URL="postgresql://luishcastroc:<ENTER-SQL-USER-PASSWORD>@analog-prisma-4966.g8z.cockroachlabs.cloud:26257/notes-db?sslmode=verify-full"
```

Recuerda reemplazar `<ENTER-SQL-USER-PASSWORD>` con la contraseña que guardaste anteriormente de CockroachDB.

Al actualizar esta cadena de conexión, estamos proporcionando a nuestra aplicación las credenciales y detalles necesarios para interactuar con nuestra instancia de CockroachDB. Siempre asegúrate de que tu archivo `.env` esté protegido y no se incluya accidentalmente en repositorios públicos para resguardar tus credenciales de la base de datos.

### Paso 5: Aplicar las Migraciones de Prisma

Las Migraciones de Prisma te permiten mantener sincronizado tu esquema de base de datos y tu esquema de Prisma. Es una de las características que hacen que trabajar con Prisma sea una experiencia encantadora.

Para aplicar nuestra primera migración y, consecuentemente, hacer que nuestra base de datos refleje el modelo `Note` de nuestro esquema de Prisma, ejecuta el siguiente comando:

```bash
npx prisma migrate dev --name init
```

Una vez que este comando se ha ejecutado con éxito, realiza algunas tareas:

1. Genera archivos de migración SQL en el directorio `prisma/migrations` basados en los cambios detectados en tu esquema de Prisma.
2. Ejecuta las migraciones, actualizando el esquema de tu base de datos.
3. También genera un nuevo `PrismaClient` internamente, lo que habilita el acceso a la base de datos de manera segura en cuanto a tipos.

Si todo está configurado correctamente (y la conexión a la base de datos es precisa), tu instancia de CockroachDB debería tener ahora una tabla `Note` que refleje la estructura que definimos anteriormente.

Si tienes curiosidad acerca de cómo debería verse la migración, esto es lo que se genera:

```sql
-- CreateTable
CREATE TABLE "Note" (
    "id" STRING NOT NULL,
    "note" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);
```

**¡Bastante genial, ¿verdad?!**

Si todo salió bien, deberías ver las nuevas tablas generadas utilizando tu panel de CockroachDB:

![Tablas generadas en NoteDB](https://res.cloudinary.com/lhcc0134/image/upload/v1691877369/note-db.png)

#### Paso 6: Configuración de la Integración de Analog/TRPC con Prisma

Para aprovechar al máximo la integración de Analog/TRPC, necesitamos instanciar un cliente de Prisma. Este cliente actuará como el conducto principal entre nuestra aplicación de Analog y nuestra base de datos CockroachDB, asegurando operaciones seguras en cuanto a tipos en toda la base de datos.

Comienza creando un archivo llamado `prisma.ts` dentro del directorio `server/trpc`. Luego, llénalo con el siguiente código:

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

En este fragmento, estamos aprovechando un mecanismo de almacenamiento en caché global para garantizar una única instancia del cliente de Prisma durante todo el ciclo de vida de nuestra aplicación. Esta configuración evita posibles problemas de conexión con la base de datos, especialmente al trabajar con implementaciones sin servidor.

#### Paso 7: Configuración del Enrutador de Notas

Ahora que nuestro cliente de Prisma está en su lugar, el siguiente paso lógico es configurar nuestras operaciones CRUD para interactuar con nuestra base de datos. Afortunadamente, Analog ha generado un archivo `notes.ts` por defecto dentro del directorio `routers` para nosotros. Este archivo actuará como el enrutador para nuestras operaciones de notas.

Reemplaza o modifica el contenido del archivo `notes.ts` con el siguiente código:

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

En el código anterior:

- Estamos importando los módulos necesarios y nuestra instancia de Prisma previamente creada.
- Definimos un selector predeterminado para nuestras Notas para asegurarnos de que estamos especificando explícitamente los datos que deseamos recuperar, lo que ayuda a evitar filtraciones de datos no deseadas.
- Luego, declaramos nuestro `noteRouter` y esbozamos las operaciones CRUD (crear, listar y eliminar) para las notas, aprovechando la potencia de tRPC y Prisma juntos.

Con esta configuración, nuestra lógica del lado del servidor está ahora bien preparada para interactuar con nuestra base de datos de manera segura en cuanto a tipos.

Pero, antes de que todo encaje perfectamente, se necesita un ligero ajuste en el modelo `note.ts` preexistente que Analog proporciona por defecto. Actualiza el código de la siguiente manera:

```typescript
export type Note = {
  id: string;
  note: string;
  createdAt: string;
};
```

### Paso 8: Actualizar el Componente Analog-Welcome

Ahora, navega hasta el componente `analog-welcome.component` y modifica la lógica del componente para reflejar los cambios que hicimos en el modelo `note.ts`. El componente actualizado debería verse así:

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

### Paso 9: Desentrañando la lógica del componente `AnalogWelcomeComponent`

Ahora que hemos integrado el componente `AnalogWelcomeComponent` con nuestros servicios tRPC con respaldo de Prisma, es fundamental comprender sus partes internas. Desmenucemos el código:

1. **Inyección de dependencia del cliente tRPC**:

   ```typescript
   private _trpc = injectTrpcClient();
   ```

   Esta acción inyecta el cliente tRPC, una herramienta fundamental que permite al componente comunicarse sin problemas con el servidor tRPC y, por extensión, con nuestra base de datos.

2. **El flujo de notas**:

   ```typescript
   public triggerRefresh$ = new Subject<void>();
   public notes$ = this.triggerRefresh$.pipe(
     switchMap(() => this._trpc.note.list.query()),
     shareReplay(1)
   );
   ```

   Aquí, creamos un flujo observable de notas. La maravilla es que cada vez que `triggerRefresh$` emite un valor, pone en marcha una consulta para recuperar todas las notas. El `shareReplay(1)` se asegura de que la lista de notas más reciente que se ha obtenido se comparta de forma coherente entre todos los suscriptores, sin necesidad de volver a obtenerla.

3. **Inicialización de los Componentes**:

   ```typescript
   constructor() {
     void waitFor(this.notes$);
     this.triggerRefresh$.next();
   }
   ```

   En el momento en que el componente cobra vida, invoca una actualización para recuperar todas las notas existentes al transmitir un valor a través del sujeto `triggerRefresh$`.

4. **El Método "Add Note"**:

   ```typescript
   public addNote(form: NgForm) {
     ...
   }
   ```

   Esta función es donde se agregan las notas. Primero, verifica la validez del formulario. Luego, con la ayuda del cliente tRPC, introduce la nueva nota en la base de datos. Tras la adición exitosa, provoca una actualización de la lista de notas.

5. **El Método "Remove Note"**:
   ```typescript
   public removeNote(id: string) {
     ...
   }
   ```

Esta función se encarga de eliminar notas. Utilizando el cliente tRPC, elimina la nota de la base de datos utilizando su ID específico. Después de la eliminación, se activa una nueva obtención de la lista de notas.

En esencia, el componente `AnalogWelcomeComponent` forma el corazón de nuestra aplicación. Interacciona con nuestros servicios tRPC, que a su vez aprovechan el poder de Prisma y nuestra base de datos. La sinfonía resultante garantiza una aplicación de notas dinámica y en tiempo real.

### Paso 10: ¡Arranquemos y probemos!

Con todas nuestras integraciones y cambios en su lugar, ¡es hora de ver nuestra aplicación en acción!

Para iniciar nuestro servidor de desarrollo, usaremos el siguiente comando:

```bash
nx serve analog-app
```

### Ejecución de la Aplicación y Resultado Final

Al ejecutar el comando `nx serve analog-app`, NX iniciará el proceso de compilación de tu proyecto y, poco después, lanzará el servidor de desarrollo. Una vez completado, deberías ver una salida que detalla el número de puerto en el que se está ejecutando la aplicación, normalmente `http://localhost:4200/`.

Dirígete a esa URL en tu navegador preferido. Si todo se configuró correctamente, serás recibido por la interfaz de usuario de la aplicación Analog. Aquí, puedes experimentar agregando, viendo y eliminando notas. Cada acción que realices se reflejará en tiempo real en tu base de datos de CockroachDB, mostrando la eficacia de nuestra configuración integrada.

![Aplicación Final en acción](https://res.cloudinary.com/lhcc0134/image/upload/v1691879744/analog-app.gif)

Y puedes utilizar tu software favorito para conectarte a la base de datos y verificar los resultados (estoy utilizando [DBeaver](https://dbeaver.io/) aquí).

![Base de Datos](https://res.cloudinary.com/lhcc0134/image/upload/v1691879744/final-result.png)

## Conclusión

Esta guía te llevó a través del proceso de integrar Analog con Prisma, tRPC y CockroachDB. Al combinar estas tecnologías, hemos transformado una aplicación básica basada en matrices en una aplicación impulsada por una base de datos escalable. Esto ilustra el potencial de las herramientas y los marcos de desarrollo modernos para facilitar el desarrollo de aplicaciones eficientes y robustas.

¡Te deseo sesiones de código fructíferas y siempre mantente atento a más oportunidades para refinar y mejorar tus aplicaciones!

Si bien no tengo una sección de comentarios, siempre valoro los comentarios y la interacción. No dudes en seguirme o conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev) o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Para aquellos interesados en profundizar en los detalles técnicos, están invitados a explorar el código del proyecto en mi [GitHub](https://github.com/luishcastroc/analog-prisma). ¡Espero con interés nuestros encuentros digitales!
