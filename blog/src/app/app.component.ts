import { Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard.component';

@Component({
  selector: 'blog-root',
  standalone: true,
  imports: [DashboardComponent],
  template: ` <blog-dashboard /> `,
})
export class AppComponent {}
