import { Component, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'mr-contact',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoDirective],
  host: { class: 'w-full' },
  template: `<ng-container *transloco="let t; read: 'contact'">
    <div class="flex flex-auto flex-col items-center gap-3 pt-20">
      <div
        class="flex w-full flex-col justify-start gap-4 align-baseline md:max-w-md">
        <h1
          class=" before:bg-primary after:bg-primary relative mb-5 w-fit text-3xl font-bold
                before:absolute before:left-[98%] before:top-[70%] before:-z-10 before:h-5
                before:w-5 before:translate-y-0 before:transition-all before:duration-500 after:absolute
                after:left-[-15px] after:top-[70%] after:-z-10 after:h-5 after:w-5 after:translate-y-0 after:transition-all
                after:duration-500 hover:before:translate-y-[-20px] hover:after:translate-y-[-20px] md:text-5xl">
          {{ t('header') }}
        </h1>
        <p class=" text-lg font-bold">
          {{ t('subheader') }}
        </p>
      </div>
      <form
        [formGroup]="contactForm"
        (ngSubmit)="submitForm()"
        class="form-control flex w-full flex-col items-center gap-3 md:max-w-md">
        <div class="w-full">
          <label class="label">
            <span class="label-text font-extrabold">{{ t('name') }}</span>
          </label>
          <input
            type="text"
            placeholder="{{ t('type-here') }}"
            formControlName="name"
            type="text"
            class="input input-bordered w-full" />
          @if (name?.errors && name?.touched) {
            <label class="label">
              <span class="label-text-alt text-error font-bold">{{
                t('name-error')
              }}</span>
            </label>
          }
        </div>
        <div class="w-full">
          <label class="label">
            <span class="label-text font-extrabold">{{ t('email') }}</span>
          </label>
          <input
            type="text"
            placeholder="{{ t('email-placeholder') }}"
            formControlName="email"
            type="email"
            class="input input-bordered w-full" />
          @if (email?.errors && email?.touched) {
            <label class="label">
              @if (email?.errors?.['required']) {
                <span class="label-text-alt text-error font-bold">{{
                  t('email-error-one')
                }}</span>
              }
              @if (email?.errors?.['email']) {
                <span class="label-text-alt text-error font-bold">{{
                  t('email-error-two')
                }}</span>
              }
            </label>
          }
        </div>
        <div class="w-full">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-extrabold">{{ t('message') }}</span>
            </label>
            <textarea
              class="textarea textarea-bordered h-24 text-base"
              formControlName="message"
              placeholder="{{ t('say-hi') }}"></textarea>
            @if (message?.errors && message?.touched) {
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
            class="btn btn-outline btn-info relative w-1/3"
            [disabled]="contactForm.invalid"
            [class.spinner-loading]="loading()"
            type="submit">
            {{ t('send') }}
          </button>
          <button
            class="btn btn-outline btn-secondary w-1/3"
            type="reset"
            (click)="contactForm.reset()">
            {{ t('clear') }}
          </button>
        </div>
      </form>
    </div></ng-container
  > `,
})
export class ContactFormComponent {
  #http = inject(HttpClient);
  #toast = inject(HotToastService);
  loading = signal(false);
  readonly #environment = environment;
  contactForm = inject(FormBuilder).group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    },
    { updateOn: 'blur' }
  );

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }

  submitForm() {
    this.loading.set(true);
    this.contactForm.disable();
    const { name, email, message } = this.contactForm.value;
    this.#http
      .post(`${environment.apiUrl}/send-email`, {
        name,
        email,
        message,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.#toast.success('Email sent successfully', {
            duration: 3500,
            position: 'bottom-center',
          });
          this.contactForm.enable();
          this.contactForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.#toast.error(
            `Error ${error.status} sending email: ${error.statusText}`,
            {
              duration: 3500,
              position: 'bottom-center',
            }
          );
          this.contactForm.enable();
        },
      });
  }
}
