import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ContactFormComponent } from '../components/contact-form';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [ReactiveFormsModule, ContactFormComponent],
  template: ` <app-contact-form /> `,
})
export default class ContactPage {
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('Luis Castro - Contact');
  }
}
