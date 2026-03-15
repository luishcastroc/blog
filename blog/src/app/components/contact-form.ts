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

import { TranslocoDirective } from '@jsverse/transloco';
import { HotToastService } from '@ngxpert/hot-toast';

import { ContactService } from '../services/contact.service';

@Component({
  standalone: true,
  selector: 'app-contact-form',
  imports: [TranslocoDirective, FormField],
  host: { class: 'w-full' },
  template: `
    <ng-container *transloco="let t; prefix: 'contact'">
      <div
        class="font-terminal glass-hero relative mx-auto flex w-[90%] max-w-2xl flex-auto flex-col items-center gap-3 rounded-lg p-8 pt-20 lg:w-[70%]">
        <div class="flex w-full flex-col justify-start gap-4 align-baseline">
          <!-- Stylized Contact Header like Welcome -->
          <div class="welcome-header mb-5 text-center">
            <h1
              class="text-secondary font-terminal welcome-text relative
                       mb-3 text-4xl font-bold
                       sm:text-5xl md:text-6xl lg:text-7xl"
              [attr.data-text]="t('header')">
              {{ t('header') }}
            </h1>
          </div>
          <p class="text-base-content font-terminal text-lg font-bold">
            {{ t('subheader') }}
          </p>
        </div>
        <form
          (submit)="handleSubmit($event)"
          class="form-control flex w-full flex-col items-center gap-3">
          <div class="w-full">
            <div class="form-control">
              <label for="name" class="label">
                <span
                  class="label-text font-terminal text-base-content font-extrabold">
                  {{ t('name') }}
                </span>
              </label>
              <input
                [formField]="contactForm.name"
                id="name"
                class="input input-bordered font-terminal w-full"
                placeholder="{{ t('type-here') }}"
                type="text" />
              @if (
                contactForm.name().touched() && contactForm.name().invalid()
              ) {
                <label class="label">
                  <span class="label-text-alt text-error font-bold">{{
                    t('name-error')
                  }}</span>
                </label>
              }
            </div>
          </div>
          <div class="w-full">
            <div class="form-control">
              <label for="email" class="label">
                <span class="label-text font-extrabold">{{ t('email') }}</span>
              </label>
              <input
                [formField]="contactForm.email"
                id="email"
                class="input input-bordered w-full"
                placeholder="{{ t('email-placeholder') }}"
                type="email" />
              @if (
                contactForm.email().touched() &&
                contactForm.email().errors().length > 0
              ) {
                @if (contactForm.email().errors()[0].kind === 'required') {
                  <label class="label">
                    <span class="label-text-alt text-error font-bold">{{
                      t('email-error-one')
                    }}</span>
                  </label>
                } @else {
                  <label class="label">
                    <span class="label-text-alt text-error font-bold">{{
                      t('email-error-two')
                    }}</span>
                  </label>
                }
              }
            </div>
          </div>
          <div class="w-full">
            <div class="form-control">
              <label for="message" class="label">
                <span class="label-text font-extrabold">{{
                  t('message')
                }}</span>
              </label>
              <textarea
                [formField]="contactForm.message"
                id="message"
                class="textarea textarea-bordered h-24 text-base"
                placeholder="{{ t('say-hi') }}"></textarea>
              @if (
                contactForm.message().touched() &&
                contactForm.message().invalid()
              ) {
                <label class="label">
                  <span class="label-text-alt text-error font-bold">{{
                    t('message-error')
                  }}</span>
                </label>
              }
            </div>
          </div>
          <div class="mt-2 flex w-full justify-center gap-4">
            <button
              [class.spinner-loading]="contactForm().submitting()"
              [disabled]="contactForm().submitting()"
              class="btn btn-primary font-terminal border-primary hover:bg-primary hover:text-primary-content w-1/3 border-2 transition-all duration-300"
              type="submit">
              {{ t('send') }}
            </button>
            <button
              (click)="resetForm()"
              class="btn btn-outline btn-secondary font-terminal border-secondary hover:bg-secondary hover:text-secondary-content w-1/3 border-2 transition-all duration-300"
              type="button">
              {{ t('clear') }}
            </button>
          </div>
        </form>
      </div>
    </ng-container>
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
