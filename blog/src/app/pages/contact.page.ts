import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactFormComponent } from '../components/contact-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Luis Castro - Contact',
};

@Component({
  selector: 'mr-contact-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContactFormComponent],
  template: `<mr-contact />`,
})
export default class ContactIndexPage {}
