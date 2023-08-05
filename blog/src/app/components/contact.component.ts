import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  host: { class: 'w-full' },
  template: `<div class="flex flex-auto flex-col items-center pt-20">
    <form
      [formGroup]="contactForm"
      (ngSubmit)="submitForm()"
      class="form-control flex w-full flex-col items-center gap-3 md:max-w-md">
      <div class="w-full">
        <label class="label">
          <span class="label-text font-extrabold">What is your name?</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          formControlName="name"
          type="text"
          class="input input-bordered w-full" />
        <label class="label" *ngIf="name?.errors && name?.touched">
          <span class="label-text-alt text-error font-bold"
            >The name is required.</span
          >
        </label>
      </div>
      <div class="w-full">
        <label class="label">
          <span class="label-text font-extrabold">What is your email?</span>
        </label>
        <input
          type="text"
          placeholder="greatusername@something.com"
          formControlName="email"
          type="email"
          class="input input-bordered w-full" />
        <label class="label" *ngIf="email?.errors && email?.touched">
          <span
            class="label-text-alt text-error font-bold"
            *ngIf="email?.errors?.['required']"
            >The email is required.</span
          >
          <span
            class="label-text-alt text-error font-bold"
            *ngIf="email?.errors?.['email']"
            >The email is invalid.</span
          >
        </label>
      </div>
      <div class="w-full">
        <div class="form-control">
          <label class="label">
            <span class="label-text font-extrabold">Your message</span>
          </label>
          <textarea
            class="textarea textarea-bordered h-24 text-base"
            formControlName="message"
            placeholder="Say hi!"></textarea>
          <label class="label" *ngIf="message?.errors && message?.touched">
            <span class="label-text-alt text-error font-bold"
              >The message is required.</span
            >
          </label>
        </div>
      </div>
      <div class="mt-2 flex w-full justify-center gap-4">
        <button
          class="btn btn-outline btn-info relative w-1/3"
          [disabled]="contactForm.invalid"
          [class.spinner-loading]="loading()"
          type="submit">
          Send
        </button>
        <button
          class="btn btn-outline btn-secondary w-1/3"
          type="reset"
          (click)="contactForm.reset()">
          Clear
        </button>
      </div>
    </form>
  </div> `,
  styles: [],
})
export class ContactComponent {
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
    console.log('submitForm', this.#environment.apiUrl);
    const { name, email, message } = this.contactForm.value;
    this.#http
      .post(`${this.#environment.apiUrl}/send-email`, {
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