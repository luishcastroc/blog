import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import 'zone.js';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
