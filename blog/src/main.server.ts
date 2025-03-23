import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { enableProdMode } from '@angular/core';
import { renderApplication } from '@angular/platform-server';
import 'zone.js/node';
import { AppComponent } from './app/app';

if (import.meta.env.PROD) {
  enableProdMode();
}

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default async function render(url: string, document: string) {
  const html = await renderApplication(bootstrap, {
    document,
    url,
  });
  return html;
}
