import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteMeta } from '@analogjs/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from '../components/contact.component';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Contact',
};

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContactComponent],
  template: `<contact />`,
})
export default class ContactIndexPage {}
