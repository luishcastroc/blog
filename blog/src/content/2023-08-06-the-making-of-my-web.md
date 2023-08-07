---
title: The Making of my Web, an AnalogJs journey!!
slug: the-making-of-my-web
description: Discovering AnalogJs, Building My Blog.
author: Luis Castro
coverImage: /assets/cover-images/my-blog-cover.webp
date: 08-06-2023
---

## Introduction

It all began with a simple scroll on Twitter. Amidst the multitude of tweets, I stumbled upon an OSS project named **AnalogJs**. As someone deeply passionate about Angular, AnalogJs immediately piqued my interest. If you're curious, you can dive deeper into the project [here](https://analogjs.org/).

## My Contribution to AnalogJs

As I delved deeper into AnalogJs, I found myself enamored by its strong foundation in Angular, a framework I hold close to my heart. My intrigue wasn't limited to just using the metaframework; I took a step further and made contributions to the AnalogJs OSS project. While some might perceive my contributions as modest, each one has imparted invaluable lessons, acting as milestones in my developer journey. For those interested in a detailed account of my initial contribution to AnalogJs, I've chronicled it in a [separate blog post](/blog), which I invite you to explore.

## Building My Personal Blog

Feeling inspired, I decided to embark on a personal project: designing a website for myself. A humble space, this blog is where I'd chronicle my tech journey and share the knowledge and insights I've gathered over time.

### The Branding Journey

Before diving into the coding, I focused on branding. I began my journey by thinking of a fitting logo and domain name. A flashback reminded me of the time I'd purchased a domain inspired by the 'Mr. Robot' series. Once a passionate fan, this domain had been forgotten, lost in the vast corridors of Google Domains. With the domain now in hand, all that remained was the logo.

### Design and Collaboration with AI

Design isn't my strongest suit, so I turned to **midjourney** for assistance. It might sound unconventional to some, but if the idea of integrating AI with design sounds intriguing, we can always debate it another time. With AI's help, I came up with this logo:

<div class="flex flex-col flex-auto justify-center items-center">
  <img src="assets/logo.svg" alt="My Blog Logo" style="heigth: auto; width:15rem;">
</div>

### From Sketch to Code

Having sorted out the branding, I transitioned to the design phase. I'm a bit old-school, so I sketched the design on paper before translating it into code.

After sketching out my initial design on paper, I dove into the coding aspect. This phase had its challenges, some trivial and others more complex, but with persistence, I managed to translate my vision into a digital reality.

### Tech Stack Behind the Scenes

Building a modern web application requires a blend of diverse technologies that come together to create a seamless experience. Here's an insight into the tech stack I employed for this project:

#### Framework:

- **AnalogJs**: At the heart of my website, AnalogJs, an Angular meta-framework, empowers the entire application structure and routing mechanism.

#### Styling:

- **Tailwind CSS**: To ensure a responsive and sleek design, I've harnessed the power of Tailwind CSS for utility-first styling.
- **DaisyUI Components**: Building upon Tailwind, DaisyUI provides a comprehensive set of UI components that enabled me to design consistent and elegant user interfaces without the need to reinvent the wheel.

#### Email Service:

- **Mailtrap**: For handling contact emails and ensuring that they're effectively sandboxed during the testing phase, Mailtrap is my go-to solution.

#### Deployment:

- **Vercel**: To make my website accessible to the world, I chose Vercel for deployment. Known for its developer-friendly features and seamless integration with various frameworks, it ensures that my site remains live and performs at its best.

With this stack, I aimed to achieve efficiency, aesthetics, and scalability, providing an enjoyable experience for my visitors.

### Project Structure

First thing i generated my project using the NxTools version of AnalogJs boiler plate using this:

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

For those familiar with Angular, this structure might look recognizable. For those new to this, let me provide a brief overview:

- **Standalone Application**: Unlike traditional Angular applications that rely on NgModules, this setup operates as a standalone application. All the bootstrapping occurs within `app.config.ts`.
- **Routing**: The `pages` folder plays a pivotal role in routing, leveraging Analog's file-based routing feature.
- **Content Handling**: The `content` folder houses my blog posts. A notable feature of **AnalogJs** is its capability to treat markdown files as components, facilitating seamless content integration.
- **Server Integration**: The `server` folder houses the API routes, facilitating backend communication for the application.
- **Components**: This section houses all the `Angular` components utilized by the application.

### Challenges Along the Way

Every project comes with its own set of challenges, and this was no exception. Some of the issues I encountered were glaringly obvious in hindsight, making me wonder how I missed them in the first place. However, I wasn't alone in navigating these hurdles. With invaluable assistance and guidance from [Brandon Roberts](https://twitter.com/brandontroberts), the creator of the AnalogJs framework, I managed to resolve these issues and bring my vision to fruition. So, the page should now be fully functional — but don't hesitate to point out anything you find amiss!

## Conclusion

Building my website with AnalogJs was a great journey of discovery, and collaboration. Along the way, I've been reminded of the significance of community and the endless opportunities it provides. Whether you're a veteran developer or just starting out in the tech world, I hope my story serves as a beacon of inspiration.

While I don’t have a comment section, I always value feedback and interaction. Feel free to follow or connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/). For those interested in diving deeper into the technical details, you're welcome to explore the project's code on my [GitHub](https://github.com/luishcastroc). Looking forward to our digital crossings!
