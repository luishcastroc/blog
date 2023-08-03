import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Contact',
};

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `<p>contact works!</p>`,
})
export default class ContactIndexPage {}
