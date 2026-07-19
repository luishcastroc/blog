import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';

import { lastValueFrom } from 'rxjs';

import { HotToastService } from '@ngxpert/hot-toast';

import { ContactService } from '../services/contact.service';

@Component({
  standalone: true,
  selector: 'app-contact-form',
  imports: [FormField],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto flex w-full max-w-2xl flex-auto flex-col gap-6">
      <header class="flex flex-col gap-2">
        <p class="nb-kicker text-red-ink">/contact</p>
        <h1
          class="font-display text-5xl font-extrabold leading-none text-ink md:text-6xl"
          i18n="@@contact.header">
          Contact Me
        </h1>
        <p class="text-lg text-muted" i18n="@@contact.subheader">
          Have any question?, project? debate about Futbol, game you want me to
          try?... shoot me a mail!
        </p>
      </header>

      <form
        (submit)="handleSubmit($event)"
        novalidate
        class="nb-panel flex w-full flex-col gap-5">
        <!-- Name -->
        <div class="flex flex-col">
          <label for="name" class="nb-label" i18n="@@contact.name"
            >What is your name?</label
          >
          <input
            [formField]="contactForm.name"
            id="name"
            class="nb-input"
            i18n-placeholder="@@contact.type-here"
            placeholder="type here"
            type="text"
            [attr.aria-invalid]="
              contactForm.name().touched() && contactForm.name().invalid()
            "
            aria-describedby="name-error" />
          <span id="name-error" role="alert" aria-live="polite">
            @if (contactForm.name().touched() && contactForm.name().invalid()) {
              <span class="nb-error" i18n="@@contact.name-error"
                >The name is required.</span
              >
            }
          </span>
        </div>

        <!-- Email -->
        <div class="flex flex-col">
          <label for="email" class="nb-label" i18n="@@contact.email"
            >What is your email?</label
          >
          <input
            [formField]="contactForm.email"
            id="email"
            class="nb-input"
            i18n-placeholder="@@contact.email-placeholder"
            placeholder="greatusername@something.com"
            type="email"
            [attr.aria-invalid]="
              contactForm.email().touched() &&
              contactForm.email().errors().length > 0
            "
            aria-describedby="email-error" />
          <span id="email-error" role="alert" aria-live="polite">
            @if (
              contactForm.email().touched() &&
              contactForm.email().errors().length > 0
            ) {
              @if (contactForm.email().errors()[0].kind === 'required') {
                <span class="nb-error" i18n="@@contact.email-error-one"
                  >The email is required.</span
                >
              } @else {
                <span class="nb-error" i18n="@@contact.email-error-two"
                  >The email is not valid.</span
                >
              }
            }
          </span>
        </div>

        <!-- Message -->
        <div class="flex flex-col">
          <label for="message" class="nb-label" i18n="@@contact.message"
            >Your message</label
          >
          <textarea
            [formField]="contactForm.message"
            id="message"
            class="nb-textarea"
            i18n-placeholder="@@contact.say-hi"
            placeholder="Say hi!"
            [attr.aria-invalid]="
              contactForm.message().touched() && contactForm.message().invalid()
            "
            aria-describedby="message-error"></textarea>
          <span id="message-error" role="alert" aria-live="polite">
            @if (
              contactForm.message().touched() && contactForm.message().invalid()
            ) {
              <span class="nb-error" i18n="@@contact.message-error"
                >The message is required.</span
              >
            }
          </span>
        </div>

        <div class="flex flex-wrap gap-4">
          <button
            [disabled]="contactForm().submitting()"
            class="nb-btn nb-btn--primary flex-1"
            type="submit"
            i18n="@@contact.send">
            Send
          </button>
          <button
            (click)="resetForm()"
            class="nb-btn nb-btn--ghost flex-1"
            type="button"
            i18n="@@contact.clear">
            Clear
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ContactFormComponent {
  private readonly toast = inject(HotToastService);
  private readonly contactService = inject(ContactService);

  private readonly model = signal<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  readonly contactForm = form(this.model, f => {
    required(f.name);
    required(f.email);
    email(f.email);
    required(f.message);
  });

  handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    event.stopPropagation();

    let apiCallSucceeded = false;
    void submit(this.contactForm, async f => {
      await lastValueFrom(this.contactService.sendContactEmail(f().value()));
      apiCallSucceeded = true;
      return null;
    })
      .then(() => {
        if (apiCallSucceeded) {
          this.toast.success('Email sent successfully', {
            duration: 3500,
            position: 'bottom-center',
          });
          this.contactForm().reset({ name: '', email: '', message: '' });
        }
      })
      .catch((error: unknown) => {
        this.handleError(error as HttpErrorResponse);
      });
  }

  resetForm(): void {
    this.contactForm().reset({ name: '', email: '', message: '' });
  }

  private handleError(error: HttpErrorResponse): void {
    const errorMessage = `Error ${error.status}: ${error.message || error.statusText}`;
    this.toast.error(errorMessage, {
      duration: 3500,
      position: 'bottom-center',
    });
  }
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
