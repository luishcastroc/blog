import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  inject,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoDirective } from '@jsverse/transloco';
import { HotToastService } from '@ngxpert/hot-toast';
import {
  injectForm,
  injectStore,
  TanStackField,
} from '@tanstack/angular-form';

import { ContactService } from '../services/contact.service';
import { ValidationService } from '../services/validation.service';

@Component({
  standalone: true,
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, TranslocoDirective, TanStackField],
  host: { class: 'w-full' },
  template: `
    <ng-container *transloco="let t; read: 'contact'">
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
          (submit)="submitForm($event)"
          class="form-control flex w-full flex-col items-center gap-3">
          <div class="w-full">
            <div class="form-control">
              <ng-container
                #name="field"
                [tanstackField]="contactForm"
                [validators]="{ onBlur: nameValidator }"
                name="name">
                <label [for]="name.api.name" class="label">
                  <span
                    class="label-text font-terminal text-base-content font-extrabold"
                    >{{ t('name') }}</span
                  >
                </label>
                <input
                  (blur)="name.api.handleBlur()"
                  (input)="name.api.handleChange($any($event).target.value)"
                  [id]="name.api.name"
                  [name]="name.api.name"
                  [value]="name.api.state.value"
                  class="input input-bordered font-terminal w-full"
                  placeholder="{{ t('type-here') }}"
                  type="text" />
                @if (name.api.state.meta.errors.length > 0) {
                  <label class="label">
                    <span class="label-text-alt text-error font-bold">{{
                      t('name-error')
                    }}</span>
                  </label>
                }
              </ng-container>
            </div>
          </div>
          <div class="w-full">
            <div class="form-control">
              <ng-container
                #email="field"
                [tanstackField]="contactForm"
                [validators]="{ onBlur: emailValidator }"
                name="email">
                <label [for]="email.api.name" class="label">
                  <span class="label-text font-extrabold">{{
                    t('email')
                  }}</span>
                </label>
                <input
                  (blur)="email.api.handleBlur()"
                  (input)="email.api.handleChange($any($event).target.value)"
                  [id]="email.api.name"
                  [name]="email.api.name"
                  [value]="email.api.state.value"
                  class="input input-bordered w-full"
                  placeholder="{{ t('email-placeholder') }}"
                  type="email" />
                @if (email.api.state.meta.errors.length > 0) {
                  @if (email.api.state.meta.errors[0].includes('required')) {
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
              </ng-container>
            </div>
          </div>
          <div class="w-full">
            <div class="form-control">
              <ng-container
                #message="field"
                [tanstackField]="contactForm"
                [validators]="{ onBlur: messageValidator }"
                name="message">
                <label [for]="message.api.name" class="label">
                  <span class="label-text font-extrabold">{{
                    t('message')
                  }}</span>
                </label>
                <textarea
                  (blur)="message.api.handleBlur()"
                  (input)="message.api.handleChange($any($event).target.value)"
                  [id]="message.api.name"
                  [name]="message.api.name"
                  [value]="message.api.state.value"
                  class="textarea textarea-bordered h-24 text-base"
                  placeholder="{{ t('say-hi') }}"></textarea>
                @if (message.api.state.meta.errors.length > 0) {
                  <label class="label">
                    <span class="label-text-alt text-error font-bold">{{
                      t('message-error')
                    }}</span>
                  </label>
                }
              </ng-container>
            </div>
          </div>
          <div class="mt-2 flex w-full justify-center gap-4">
            <button
              [class.spinner-loading]="isSubmitting()"
              [disabled]="!canSubmit() || isSubmitting()"
              class="btn btn-primary font-terminal border-primary hover:bg-primary hover:text-primary-content w-1/3 border-2 transition-all duration-300"
              type="submit">
              {{ t('send') }}
            </button>
            <button
              (click)="contactForm.reset()"
              class="btn btn-outline btn-secondary font-terminal border-secondary hover:bg-secondary hover:text-secondary-content w-1/3 border-2 transition-all duration-300"
              type="reset">
              {{ t('clear') }}
            </button>
          </div>
        </form>
      </div>
    </ng-container>
  `,
})
export class ContactFormComponent {
  private toast = inject(HotToastService);
  private contactService = inject(ContactService);
  private validationService = inject(ValidationService);

  contactForm = injectForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
    onSubmit: ({ value }) => this.submitContactForm(value as ContactFormData),
  });

  // Bind validators to validation service methods
  nameValidator = this.validationService.createRequiredValidator('A name');
  emailValidator = this.validationService.createEmailValidator();
  messageValidator =
    this.validationService.createRequiredValidator('A message');

  canSubmit = injectStore(this.contactForm, state => state.canSubmit);
  isSubmitting = injectStore(this.contactForm, state => state.isSubmitting);

  submitForm(event: SubmitEvent): void {
    event.preventDefault();
    event.stopPropagation();
    void this.contactForm.handleSubmit();
  }

  private submitContactForm(formData: ContactFormData): void {
    this.contactService.sendContactEmail(formData).subscribe({
      next: () => this.handleSuccess(),
      error: (error: HttpErrorResponse) => this.handleError(error),
    });
  }

  private handleSuccess(): void {
    this.toast.success('Email sent successfully', {
      duration: 3500,
      position: 'bottom-center',
    });
    this.contactForm.reset();
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
