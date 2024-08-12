---
title: El Stack Dotnet, NX, AnalogJs (Angular) está aquí - Parte 1
slug: el-dna-stack-pt1
otherSlug: the-dna-stack-pt1
description: Un stack ha nacido, construyendo una aplicación fullstack con .NET Core, NX, y AnalogJS (Angular)
author: Luis Castro
coverImage: v1712246484/dna-stack.png
date: 08-12-2024
---

## 🧬 ¿Qué es el Stack DNA?

**Introducción:**  
Primero que todo, quiero darle crédito a **Brandon Roberts** por idear el nombre 🥸. El stack DNA representa una poderosa combinación de tecnologías: .NET Core, NX y AnalogJS, proporcionando a los desarrolladores un entorno cohesivo y eficiente para construir aplicaciones robustas. Vamos a echar un vistazo a cada una de estas tecnologías sin demasiada explicación, ya que todas tienen una excelente documentación. Aquí, nos vamos a enfocar en construir algo simple con este stack.

> **Nota**: Antes de empezar, algunos supuestos: deberías tener el SDK de .NET ya instalado (yo usé la versión 8) y `dotnet-ef`. Si no tienes estas herramientas, por favor instálalas primero: [SDK de .NET](https://dotnet.microsoft.com/en-us/download) y [dotnet-ef](https://www.nuget.org/packages/dotnet-ef).

### 🖥️ .NET Core: La Columna Vertebral

**La Base del Stack:**  
.NET Core sirve como la columna vertebral del stack DNA, ofreciendo un framework de código abierto y multiplataforma para construir una amplia gama de aplicaciones, desde web hasta la nube y IoT. Su rendimiento, escalabilidad y amplia biblioteca de soporte lo convierten en una opción ideal para el desarrollo de backend.

### 🛠️ NX Tools: Optimización del Desarrollo

**El Poder de los Monorepos:**  
NX aporta capacidades de monorepos al stack DNA, permitiendo a los desarrolladores gestionar sus proyectos de manera más eficiente. Con NX, puedes compartir fácilmente código, configurar procesos de compilación y asegurar estándares consistentes en múltiples proyectos. Es particularmente valioso en equipos grandes y proyectos donde mantener la estructura y la consistencia es crucial.

### 🌐 AnalogJS: El Meta-Framework para Angular

**Modernizando el Desarrollo en Angular:**  
Analog es un meta-framework fullstack diseñado para construir aplicaciones y sitios web con Angular. Ofrece una experiencia similar a otros meta-frameworks populares como Next.js, Nuxt, SvelteKit y Qwik City, pero con la poderosa base de Angular.

**Características:**

- Soporte para Vite/Vitest/Playwright para flujos de trabajo de desarrollo y pruebas eficientes.
- Integración de capacidades de servidor y despliegue impulsadas por Nitro.
- Ofrece enrutamiento basado en archivos para una gestión de rutas fácil e intuitiva.
- Permite la obtención de datos del servidor para mejorar el rendimiento de la aplicación.
- Permite el uso de Markdown como rutas de contenido, facilitando la gestión de contenido estático.
- Proporciona rutas de API/servidor para funcionalidad backend dentro de tu aplicación Angular.
- Soporta SSR (Renderizado del lado del servidor) y SSG (Generación de sitios estáticos) para aplicaciones híbridas.
- Compatible con Angular CLI/Nx workspaces para una gestión de proyectos más eficiente.
- Se integra con Astro para usar componentes de Angular, ampliando la flexibilidad de tu proceso de desarrollo.

Dicho esto, vamos a sumergirnos en lo que vamos a construir. En Analog, hay un ejemplo de generador de notas que puedes esbozar cuando eliges la opción tRPC. Sin embargo, hoy no vamos a usar tRPC; en su lugar, usaremos **Rutas de Servidor**.

## 📝 La Aplicación de Notas

Nuestra aplicación fullstack es súper simple: tienes Notas que quieres guardar (y eliminar cuando sea necesario), por lo que vamos a usar la plantilla dentro del ejemplo de tRPC y actualizarla para usar nuestro nuevo backend de .NET Core. Comencemos configurando el proyecto e instalando las dependencias.

```shell
npx create-nx-workspace@latest --preset=apps --ci=skip --name=notes-dna
```

Esto generará nuestro workspace de **Nx** y creará la carpeta para trabajar. Una vez que termine, ve a la carpeta y crea una carpeta **apps**.

```shell
cd notes-dna
mkdir apps
```

Ahora necesitamos agregar dos presets: uno será para nuestra aplicación de **AnalogJS** y el otro para nuestra aplicación de **.NET Core**.

```shell
npm i -D @analogjs/platform
```

```shell
npm i -D @nx-dotnet/core
```

Una vez que nuestros dos plugins estén instalados, es hora de generar nuestra aplicación de Notas 🎉.

Esto generará nuestra aplicación de Analog:

```shell
nx g @analogjs/platform:app --analogAppName=notes --addTailwind=true --addTRPC=true
```

Este comando iniciará nuestro workspace para uso de .NET:

```shell
nx g @nx-dotnet/core:init
```

Este comando generará nuestra aplicación API. Tendremos que elegir **webapi** del menú.

```shell
nx g @nx-dotnet/core:app api --language C# --args=-controllers --testTemplate=none --pathScheme=nx --skipSwaggerLib
```

Si todo salió bien, la estructura de carpetas debería verse así:

```shell
── Directory.Build.props
├── Directory.Build.targets
├── README.md
├── apps
│   ├── api
│   │   ├── Controllers
│   │   │   └── WeatherForecastController.cs
│   │   ├── NotesDna.Api.csproj
│   │   ├── NotesDna.Api.http
│   │   ├── Program.cs
│   │   ├── Properties
│   │   │   └── launchSettings.json
│   │   ├── WeatherForecast.cs
│   │   ├── appsettings.Development.json
│   │   ├── appsettings.json
│   │   ├── obj
│   │   │   ├── NotesDna.Api.csproj.nuget.dgspec.json
│   │   │   ├── NotesDna.Api.csproj.nuget.g.props
│   │   │   ├── NotesDna.Api.csproj.nuget.g.targets
│   │   │   ├── project.assets.json
│   │   │   └── project.nuget.cache
│   │   └── project.json
│   └── notes
│       ├── index.html
│       ├── package.json
│       ├── postcss.config.cjs
│       ├── project.json
│       ├── src
│       │   ├── app
│       │   │   ├── app.component.spec.ts
│       │   │   ├── app.component.ts
│       │   │   ├── app.config.server.ts
│       │   │   ├── app.config.ts
│       │   │   └── pages
│       │   │       ├── (home).page.ts
│       │   │       └── analog-welcome.component.ts
│       │   ├── main.server.ts
│       │   ├── main.ts
│       │   ├── note.ts
│       │   ├── styles.css
│       │   ├── test-setup.ts
│       │   ├── trpc-client.ts
│       │   └── vite-env.d.ts
│       ├── tailwind.config.cjs
│       ├── tsconfig.app.json
│       ├── tsconfig.editor.json
│       ├── tsconfig.json
│       ├── tsconfig.spec.json
│       └── vite.config.ts
├── notes-dna.generated.sln
├── nx.json
├── package-lock.json
├── package.json
└── tsconfig.base.json
```

Recuerda que estamos aquí para construir esta pequeña aplicación, así que echa un buen vistazo a la documentación de [.NET Core](https://learn.microsoft.com/en-us/aspnet/core/?view=aspnetcore-8.0) y [AnalogJS](https://analogjs.org/docs) para que sepas qué esperar con esas estructuras de carpetas.

Ahora verifica si todo funciona; para ejecutar la **API** usamos `nx serve api` y para ejecutar **AnalogJs** usamos `nx serve notes`.

Al seguir las dos direcciones localhost de cada aplicación, deberías obtener algo como esto:

<p style="display:flex; flex-direction:row; gap:1rem; flex-wrap: wrap; justify-content:center; align-items:center">
<img src="https://res.cloudinary.com/lhcc0134/image/upload/v1723473986/analog.png" 
        alt="Aplicación de Analog" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/v1723473986/netcore.png" 
        alt="Aplicación de .NET Core" />
</p>

Si todavía estás aquí y no hay errores, entonces comencemos con nuestra **API**:

## 🧩 La D en el DNA

Primero usemos NuGet para instalar un par de dependencias: **Microsoft.EntityFrameworkCore.Design** y **Microsoft.EntityFrameworkCore.Sqlite**

> **Nota:** Agrega las versiones que correspondan a la versión de dotnet core que estás utilizando, por ejemplo, versión 8 si estás usando dotnet 8.

Primero, vamos a crear nuestra **Entidad** ya que estamos usando _EF_ que nos ayudará a diseñar nuestra base de datos utilizando el enfoque de "código primero".

Crea una carpeta en la raíz del proyecto api llamada **Entity** y crea una clase dentro de esa carpeta, llámala **Note.cs** y agrega este código allí:

```csharp
using System;

namespace NotesDna.Api.Entities;

public class Note
{
  public int Id { get; set; }
  public string Name { get; set; }
  public string CreatedAt { get; set; }
}
```

Este código es súper simple, solo estamos agregando el objeto principal que manejará nuestras Notas.

Luego, dado que estamos usando una base de datos, necesitaremos un DbContext, así que vamos a crearlo. Crea una carpeta Data al mismo nivel de la carpeta Entities y crea una clase dentro de esa carpeta, llámala **DataContext.cs** y agrega este código allí:

```csharp
using System;
using NotesDna.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace NotesDna.Api.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
  public DbSet<Note> Notes { get; set; }
}
```

Luego, vamos a modificar nuestra clase **Program.cs** y deshacernos de lo que no necesitamos (solo cosas de Swagger) y déjala así:

```csharp
using NotesDna.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Agrega servicios al contenedor.

builder.Services.AddControllers();
builder.Services.AddDbContext<DataContext>(opt =>
{
  opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// Configura el pipeline de solicitud HTTP.

app.MapControllers();

app.Run();
```

Y ahora agreguemos nuestra conexión al archivo de propiedades de la aplicación **appsettings.Development.json**, deja el archivo así:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data source=notes.db"
  }
}
```

Ahora haremos la parte divertida, agregar el controlador que proporcionará las operaciones CRUD para nosotros, dentro de la carpeta Controllers agregamos una clase y llamemosla **NotesController.cs** y agregaremos esta lógica a ella:

```csharp
using NotesDna.Api.Data;
using NotesDna.Api.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace NotesDna.Api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class NotesController(DataContext context) : ControllerBase
  {
    private readonly DataContext _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Note>>> GetNotes()
    {
      try
      {
        var notes = await _context.Notes.ToListAsync();
        return Ok(notes);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError,
            "Error al obtener las notas");
      }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Note>> GetNote(int id)
    {
      try
      {
        var note = await _context.Notes.FindAsync(id);

        if (note == null) return NotFound();

        return Ok(note);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError,
            "Error al obtener el registro de la nota");
      }
    }

    [HttpPost]
    public async Task<ActionResult<Note>> AddNote([FromBody] Note note)
    {
      try
      {
        if (note == null)
          return BadRequest();

        await _context.Notes.AddAsync(note);
        await _context.SaveChangesAsync(); // Asegúrate de que se genere el Id

        return CreatedAtAction(nameof(GetNote), new { id = note.Id }, note);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError,
            "Error al crear un nuevo registro de nota");
      }
    }


    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteNote(int id)
    {
      try
      {
        var note = await _context.Notes.FirstOrDefaultAsync(x => x.Id == id);

        if (note == null) return NotFound();
        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();

        return Ok();
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar el registro de la nota");
      }
    }

  }
}
```

Ahora una breve explicación de cada método en el `NotesController`, parecen explicarse solos 🥸:

### Método `GetNotes`

```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<Note>>> GetNotes()
{
    var notes = await _context.Notes.ToListAsync();
    return Ok(notes);
}
```

- **Propósito:** Recupera todas las notas de la base de datos.
- **Lógica:** Asíncronamente obtiene la lista de notas y las devuelve en una respuesta `Ok`, indicando una operación exitosa.

### Método `GetNote`

```csharp
[HttpGet("{id:int}")]
public async Task<ActionResult<Note>> GetNote(int id)
{
    var note = await _context.Notes.FindAsync(id);
    if (note == null) return NotFound();
    return Ok(note);
}
```

- **Propósito:** Recupera una nota específica por su ID.
- **Lógica:** Asíncronamente busca la nota por ID. Si la encuentra, devuelve la nota en una respuesta `Ok`; si no, devuelve una respuesta `NotFound`.

### Método `AddNote`

```csharp
[HttpPost]
public async Task<ActionResult<Note>> AddNote([FromBody] Note note)
{
    await _context.Notes.AddAsync(note);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetNote), new { id = note.Id }, note);
}
```

- **Propósito:** Agrega una nueva nota a la base de datos.
- **Lógica:** Asíncronamente agrega la nota a la base de datos y guarda los cambios. Después, devuelve una respuesta `CreatedAtAction`, señalando la nota recién creada.

### Método `DeleteNote`

```csharp
[HttpDelete("{id:int}")]
public async Task<ActionResult> DeleteNote(int id)
{
    var note = await _context.Notes.FirstOrDefaultAsync(x => x.Id == id);
    if (note == null) return NotFound();
    _context.Notes.Remove(note);
    await _context.SaveChangesAsync();
    return Ok();
}
```

- **Propósito:** Elimina una nota por su ID.
- **Lógica:** Asíncronamente busca la nota por ID. Si la encuentra, la nota se elimina y los cambios se guardan. Devuelve una respuesta `Ok` para una eliminación exitosa o `NotFound` si la nota no existe.

Y casi se me olvida, limpiemos un poco nuestro archivo **launchSettings.json**

```json
{
  "$schema": "http://json.schemastore.org/launchsettings.json",
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:20303",
      "sslPort": 44331
    }
  },
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": false,
      "launchUrl": "swagger",
      "applicationUrl": "http://localhost:5000;https://localhost:5001",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}
```

Esto debería permitirnos ejecutar el servidor en el puerto 5000 para http y 5001 para https.

Ahora vamos a generar nuestra base de datos y agregar algunos datos para probar.

En la raíz del workspace de NX usa tu terminal para ejecutar esto:

```shell
dotnet ef migrations add InitialMigration -o Data/Migrations --msbuildprojectextensionspath dist/intermediates/apps/api/obj --project apps/api/NotesDna.Api.csproj
```

Esto debería crear una migración dentro de tu carpeta Data que básicamente diseñará nuestra base de datos, ahora necesitamos aplicar esto a nuestra base de datos usando:

```shell
dotnet ef database update --msbuildprojectextensionspath dist/intermediates/apps/api/obj --project apps/api/NotesDna.Api.csproj
```

Entonces, ahora vamos a ejecutarlo y comprobar si todo funciona correctamente.

> **Nota:** Después de nuestros cambios no deberíamos ver más la URL de swagger, por lo que podemos consumir la API manualmente en el navegador o usando Postman.

Lo más probable es que no veas nada, porque no tenemos ningún dato, usa tu herramienta de base de datos favorita para agregar un par de registros y luego vuelve a intentarlo.

Si todo salió bien, continuaremos con la parte de **AnalogJs**.

## 🌟 Conclusión: Construyendo la Base

En esta primera parte de nuestro viaje con

el stack DNA, hemos establecido con éxito los cimientos configurando nuestro backend con .NET Core e integrándolo con NX y AnalogJS. Creamos una aplicación básica de Notas, configuramos las herramientas necesarias y establecimos una estructura sólida para un desarrollo posterior. Este stack ofrece un entorno poderoso y flexible para construir aplicaciones fullstack, y apenas estamos comenzando.

En la próxima parte, nos centraremos en completar la aplicación de AnalogJS, desarrollando las características del front-end e integrándola completamente con nuestro backend. Mantente atento mientras continuamos mejorando nuestro proyecto y desbloqueando todo el potencial del stack DNA.

---

Si encontraste este artículo útil, no dudes en conectarte conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). ¡Continuemos este viaje juntos! 💻🚀📘

Si te gustaría apoyar mi trabajo, considera [invitarme un café](https://www.buymeacoffee.com/luishcastrv). ¡Tu apoyo es muy apreciado! ☕️
