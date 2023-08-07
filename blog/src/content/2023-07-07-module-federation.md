---
title: Unlocking the Power of Micro-Frontends, A Guided Journey From Monolith to Modular
slug: module-federation
description: Brief overview on Micro Frontedns with Module Federation and Nx Mono Repos.
author: Luis Castro
coverImage: v1691372381/mf-cover.webp
date: 07-07-2023
---

In the world of web development, architectural approaches are constantly evolving. One transformative approach gaining traction is the shift from traditional monolithic structures to micro-frontends. In this article, we delve into the fascinating realm of micro-frontends based on the research paper "Micro-Frontends: A Multivocal Literature Review" by Severi Peltonen, Luca Mezzalira, and Davide Taibi.

## What Are Micro-Frontends?

Micro-frontends are a modular architectural pattern for frontend applications. Unlike monolithic frontends, they are composed of independent and self-contained sub-applications. Each micro-frontend can be developed, tested, and deployed independently by different teams, enabling greater flexibility and scalability.

## Why Transition From Monolithic Frontends to Micro-Frontends?

The transition to micro-frontends is driven by the challenges posed by monolithic frontends as they grow in complexity. Micro-frontends offer a solution to manage and scale frontend development by breaking it down into smaller, more manageable parts. By embracing micro-frontends, organizations can empower teams to work independently, fostering innovation and accelerating development cycles.

However, the adoption of micro-frontends comes with its own set of challenges. As the system becomes more distributed, complexity increases, and careful coordination is required to ensure consistency and seamless integration.

## Exploring Micro-Frontends with Module Federation

One approach to implementing micro-frontends is by leveraging the powerful Webpack's Module Federation plugin. This plugin enables JavaScript applications to dynamically load code from other projects at runtime. By combining the magic of Module Federation with a build framework like Nx (which we will focus on in this article), developers can unleash the full potential of micro-frontends. However, if you're interested in exploring other solutions, you can check out the informative 10-article series on [The Microfrontend Revolution: Module Federation in Webpack 5](https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-module-federation-in-webpack-5/) by Angular Architects.

## Embarking on the Micro-Frontend Journey with Nx and Module Federation

To embark on the micro-frontend journey, developers can utilize Nx, a powerful build framework that brings structure and organization to applications. With Nx's monorepo architecture, developers can efficiently manage multiple micro-frontends within a single codebase. By integrating the Module Federation plugin, micro-frontends can seamlessly interact and share functionality, creating a cohesive user experience across different sub-applications.

## The Angular Use Case

I personally love Angular and with all the changes the team is introducing is getting even better, you can check those out here [What's new in Angular 16](https://dev.to/this-is-angular/whats-new-in-angular-16-375b), so let's take a look in how by using `Nx` tools we can generate a Module Federation project ready to start coding with all the benefits (as well dissavantages that i'll mention) from a monorepo and micro frontend architecture.

First we need to generate a new nx workspace:

```shell
npx create-nx-workspace@latest --preset=empty --name=mf-example && cd mf-example && npm i @nx/angular
```

Once everything runs we should now have a proper **Nx** workspace with no apps simple right?, call it `shell npm init` with sugar.

Now we need to start adding our projects, for this example i'll add one host and two remotes we will call them **main** (for the host), **dashboard** and **settings**.

first we will add the **main** app with this command:

```shell
nx g host main --standalone --standaloneConfig --style=scss --addTailwind
```

now we will add the remotes with this command:

```shell
nx g remote dashboard --host=main --standalone --standaloneConfig --style=scss --addTailwind
```

```shell
nx g remote settings --host=main --standalone --standaloneConfig --style=scss --addTailwind
```

We should end up with a folder structure like this:

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

## The Mono Repo Approach

So, since we're using Nx for our project, we can obtain all the advantages of a monorepo combined with a micro-frontend architecture. However, this approach comes with some considerations that are mentioned in the Angular Architects article.

Specifically, teams need to agree on one version of dependencies, such as Angular (in our example, we're using this decision), and establish a common update cycle for them. In other words, we trade some freedom to prevent version conflicts and avoid increased bundle sizes.

Before running our app, let's enhance its appearance by installing a library of components for Tailwind CSS. We'll be using [daysi ui](https://daisyui.com/), which provides a set of ready-to-use UI components.

Once the library is installed and configured, we'll make a small change inside the `app.component.html` file within our main app.

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

Now continuing with the example we can now run the host application `nx serve main`, this command will run the main and the other two apps to generate the **Full** app.

You should see something like this.

## Home App

![Home App](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fv2dpvg2isgx0vm0jita.png)

If you click the menu's you should see the page changing:

## Dashboard App

![Dashboard App](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/640358vp61ymlso2sd05.png)

## Settings App

![Settings App](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/238k4mo1b9o9oia3sdj8.png)

As we see the page behaves how is supposed to behave for the user and we don't even notice the difference but on the inside there's a lot happening and **home**, **dashobard** and **settings** are independent apps running in paralel.

You can run the remotes with this command:
`nx serve dashboard` and `nx serve settings`

If you want to keep playing with it take a look to this repo [MF Angular Example](https://github.com/luishcastroc/mf-angular-ex)

## Concluding Remarks

The transition from monolithic frontends to micro-frontends represents a paradigm shift in web development. While it offers numerous benefits such as flexibility, scalability, and independent team workflows, careful consideration must be given to manage the increased complexity and ensure consistent user experiences.

As we conclude this exploration into the world of micro-frontends, we recognize the significance of this architectural pattern in shaping the future of web development. It opens up new possibilities for building modular, maintainable, and scalable applications.

1. Peltonen, S., Mezzalira, L., & Taibi, D. (2021). Micro-Frontends: A Multivocal Literature Review. Information and Software Technology, 136, 106571. [Link to the original article](https://www.sciencedirect.com/science/article/pii/S0950584921000549)
