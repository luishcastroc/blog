---
title: The Dotnet, Nx, AnalogJs (Angular) Stack is here - Part 1
slug: the-dna-stack-pt1
otherSlug: el-dna-stack-pt1
description: A stack is born, Building a fullstack app with .NET Core, NX, and AnalogJS (Angular)
author: Luis Castro
coverImage: v1712246484/dna-stack.png
date: 08-12-2024
---

## 🧬 What is the DNA Stack?

**Introduction:**  
First of all, let me give credit to **Brandon Roberts** for coming up with the name 🥸. The DNA stack represents a powerful combination of technologies: .NET Core, NX tools, and AnalogJS, providing developers with a cohesive and efficient environment to build robust applications. Let's briefly dive into each of these technologies without too much explanation, since they all have excellent documentation. Here, we’re going to focus on building something simple with this stack.

> **Note**: A couple of assumptions before we start: you should have the .NET SDK installed already (I used version 8) and `dotnet-ef`. If you don't have these tools, please install them first: [dotnet SDK](https://dotnet.microsoft.com/en-us/download) and [dotnet-ef](https://www.nuget.org/packages/dotnet-ef).

### 🖥️ .NET Core: The Backbone

**The Foundation of the Stack:**  
.NET Core serves as the backbone of the DNA stack, offering a cross-platform, open-source framework for building a wide range of applications, from web to cloud to IoT. Its performance, scalability, and extensive library support make it an ideal choice for backend development.

### 🛠️ NX Tools: Streamlining Development

**The Power of Monorepos:**  
NX brings monorepo capabilities to the DNA stack, allowing developers to manage their projects more efficiently. With NX, you can easily share code, configure build processes, and ensure consistent standards across multiple projects. It’s particularly valuable in large teams and projects, where maintaining structure and consistency is crucial.

### 🌐 AnalogJS: The Angular Metaframework

**Modernizing Angular Development:**  
Analog is a fullstack meta-framework designed for building applications and websites with Angular. It offers a similar experience to other popular meta-frameworks like Next.js, Nuxt, SvelteKit, and Qwik City, but with the powerful foundation of Angular.

**Features:**

- Supports Vite/Vitest/Playwright for efficient development and testing workflows.
- Integrates server and deployment capabilities powered by Nitro.
- Offers file-based routing for easy and intuitive route management.
- Enables server-side data fetching to enhance application performance.
- Allows the use of Markdown as content routes, making it easier to manage static content.
- Provides API/server routes for backend functionality within your Angular app.
- Supports both SSR (Server-Side Rendering) and SSG (Static Site Generation) for hybrid applications.
- Compatible with Angular CLI/Nx workspaces for streamlined project management.
- Integrates with Astro to use Angular components, expanding the flexibility of your development process.

With that said, let's dive into what we're going to build. In Analog, there's an example Notes generator that you can scaffold when you choose the tRPC option. However, we're not going to use tRPC today; instead, we're using **Server Routes**.

## 📝 The Notes App

Our full-stack app is super simple: you have Notes that you want to save (and delete as needed), so we're going to use the template inside the tRPC example and update it to use our new .NET Core backend. Let’s start by setting up the project and installing the dependencies.

```shell
npx create-nx-workspace@latest --preset=apps --ci=skip --name=notes-dna
```

This will generate our **Nx** workspace and create the folder for us to work. After it finishes, go to the folder and create an **apps** folder.

```shell
cd notes-dna
mkdir apps
```

Now we need to add two presets: one will be for our **AnalogJS** app and the other for our **.NET Core** app.

```shell
npm i -D @analogjs/platform
```

```shell
npm i -D @nx-dotnet/core
```

Once our two plugins are installed, it’s time to generate our Notes App 🎉.

This will generate our Analog app:

```shell
nx g @analogjs/platform:app --analogAppName=notes --addTailwind=true --addTRPC=true
```

This command will initiate our workspace for .NET usage:

```shell
nx g @nx-dotnet/core:init
```

This command will generate our API application. We will need to choose **webapi** from the menu.

```shell
nx g @nx-dotnet/core:app api --language C# --args=-controllers --testTemplate=none --pathScheme=nx --skipSwaggerLib
```

If everything went well, the folder structure should look like this:

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

Remeber we’re here to build this small app, so take a good look into the documentation of [.NET Core](https://learn.microsoft.com/en-us/aspnet/core/?view=aspnetcore-8.0) and [AnalogJS](https://analogjs.org/docs) for you to know what to expect with those folder structures.

Now check if everything runs, to run the **api** we use `nx serve api` and to run the **AnalogJs** we use `nx serve notes`.

By following the two localhost addresses of each application you should get something like this:

<p style="display:flex; flex-direction:row; gap:1rem; flex-wrap: wrap; justify-content:center; align-items:center">
<img src="https://res.cloudinary.com/lhcc0134/image/upload/v1723473986/analog.png" 
        alt="Analog application" />
<img src="https://res.cloudinary.com/lhcc0134/image/upload/v1723473986/netcore.png" 
        alt="NET Core application" />
</p>

If you're still here and there are no errors then let's get started with our **API**:

## 🧩 The D on the DNA

First let's use Nugget to install a couple of dependencies **Microsoft.EntityFrameworkCore.Design** and **Microsoft.EntityFrameworkCore.Sqlite**

> **Note:** Add the versions that belong to the dotnet core version you're using, ex: ver 8 if you're using dotnet 8.

First let's create our **Entity** since we're using _EF_ that will help us to scaffold our database using the code first approach.

Create a folder at the root of the api project called **Entity** and create a class inside of that folder, call it **Note.cs** and add this code in there:

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

This code is super simple, we're just adding the main object that will handle our Notes.

Then since we're using a Database we will need a DbContext so let's create that, create a Data folder at the same level of the Entities folder and create a class inside that one, call it **DataContext.cs** and add this code there:

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

Then let's modify our **Program.cs** class and get rid of what we won't need (it's just Swagger stuff) and leave it like this:

```csharp
using NotesDna.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<DataContext>(opt =>
{
  opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

app.Run();
```

And now let's add our connection to the app properties file **appsettings.Development.json** leave the file like this:

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

Now let's do the fun part, add the controller that pretty much will provide the CRUD operations for us, inside the Controllers folder add a class and call it **NotesController.cs** and add this logic to it:

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
            "Error getting the notes");
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
            "Error getting the note record");
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
        await _context.SaveChangesAsync(); // Ensure the Id is generated

        return CreatedAtAction(nameof(GetNote), new { id = note.Id }, note);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError,
            "Error creating new note record");
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
        return StatusCode(StatusCodes.Status500InternalServerError, "Error deleting the note record");
      }
    }

  }
}
```

Here's a brief explanation of each method in the `NotesController` even when they seek a little self explanatory 🥸:

### `GetNotes` Method

```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<Note>>> GetNotes()
{
    var notes = await _context.Notes.ToListAsync();
    return Ok(notes);
}
```

- **Purpose:** Retrieves all notes from the database.
- **Logic:** It asynchronously fetches the list of notes and returns them in an `Ok` response, indicating a successful operation.

### `GetNote` Method

```csharp
[HttpGet("{id:int}")]
public async Task<ActionResult<Note>> GetNote(int id)
{
    var note = await _context.Notes.FindAsync(id);
    if (note == null) return NotFound();
    return Ok(note);
}
```

- **Purpose:** Retrieves a specific note by its ID.
- **Logic:** It asynchronously finds the note by ID. If found, it returns the note in an `Ok` response; if not, it returns a `NotFound` response.

### `AddNote` Method

```csharp
[HttpPost]
public async Task<ActionResult<Note>> AddNote([FromBody] Note note)
{
    await _context.Notes.AddAsync(note);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetNote), new { id = note.Id }, note);
}
```

- **Purpose:** Adds a new note to the database.
- **Logic:** It asynchronously adds the note to the database and saves the changes. Afterward, it returns a `CreatedAtAction` response, pointing to the newly created note.

### `DeleteNote` Method

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

- **Purpose:** Deletes a note by its ID.
- **Logic:** It asynchronously searches for the note by ID. If found, the note is removed, and the changes are saved. It returns an `Ok` response for a successful deletion or `NotFound` if the note doesn't exist.

And i almost forget let's clean a little bit our **launchSettings.json**

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

This should allows us to run the server at port 5000 for http and 5001 for https.

now let's generate our DB and add some data to test.

On the root of the NX workspace use your terminal to run this:

```shell
dotnet ef migrations add InitialMigration -o Data/Migrations --msbuildprojectextensionspath dist/intermediates/apps/api/obj --project apps/api/NotesDna.Api.csproj
```

This should create a migration inside your Data folder that will pretty much scaffold our database, now we need to apply this to our database using:

```shell
dotnet ef database update --msbuildprojectextensionspath dist/intermediates/apps/api/obj --project apps/api/NotesDna.Api.csproj
```

So now let's run it and check if everything is working properly.

> **Note:** After our changes we should not see the swagger URL anymore so we can consume the API manually in the browser or using Postman.

Most likely you won't see anything, because we don't have any data, use your favorite DB tool to add a couple of records and then try again.

If everything wen't well then we will continue with the **AnalogJs** part.

## 🌟 Conclusion: Building the Foundation

In this first part of our journey with the DNA stack, we've successfully laid the groundwork by setting up our backend with .NET Core and integrating it with NX and AnalogJS. We created a basic Notes application, configured the necessary tools, and established a solid structure for further development. This stack offers a powerful and flexible environment for building fullstack applications, and we're just getting started.

In the upcoming part, we'll focus on completing the AnalogJS application, building out the front-end features, and fully integrating it with our backend. Stay tuned as we continue to enhance our project and unlock the full potential of the DNA stack.

---

If you found this article helpful, feel free to connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). Let's continue this journey together! 💻🚀📘

If you'd like to support my work, consider [buying me a coffee](https://www.buymeacoffee.com/luishcastrv). Your support is greatly appreciated! ☕️
