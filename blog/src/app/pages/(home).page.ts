import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'blog-home',
  standalone: true,
  imports: [AnalogWelcomeComponent],
  template: ` <blog-analog-welcome /> `,
})
export default class HomeComponent {}
