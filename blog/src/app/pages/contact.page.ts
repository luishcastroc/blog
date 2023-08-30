import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteMeta } from '@analogjs/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactFormComponent } from '../components/contact-form.component';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Contact',
};

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContactFormComponent],
  template: `<mr-contact />`,
})
export default class ContactIndexPage {}
