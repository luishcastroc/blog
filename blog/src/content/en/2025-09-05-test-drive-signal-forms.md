---
title: Taking Angulars Signal Forms for a Test Drive, Exploring the Experimental API
slug: test-drive-signal-forms
otherSlug: probando-signal-forms
description: An introduction to Angulars experimental Signal Forms API and its features.
author: Luis Castro
coverImage: v1712246484/signal-forms.png
date: 09-05-2025
---

## Introduction

Angular continues its evolution toward a more reactive and performant future, and one of the most exciting developments is the introduction of **Signal Forms**. This new experimental API represents a significant shift from the familiar reactive forms approach, embracing Angular's signal-based reactivity system to deliver better performance, improved developer experience, and more intuitive form management.

In this article, we'll dig into what Angular is currently offering with Signal Forms, explore the features they've built so far, and see how they work in practice. Keep in mind this is very much a work in progress - things will definitely change, APIs might get renamed or redesigned, and some features we'll discuss might evolve significantly before they're production-ready.

## Why Signal Forms?

The Angular team is exploring Signal Forms as a new experimental approach to form management that aims to:

- Leverage Angular's fine-grained reactivity system
- Provide a more intuitive API for form creation and management
- Enable better performance through precise updates
- Simplify form validation and error handling
- Offer seamless integration with Angular's modern signal-based features

> Signal Forms are currently experimental. While the core functionality is stable, the API may evolve based on community feedback and real-world usage.

## Core Concepts

### Fields and Field State

At the heart of Signal Forms is the `Field` concept. A field represents a piece of form data along with its associated state. If you've worked with reactive forms, this will look familiar - it has many of the same properties you know from `AbstractControl` like `touched`, `dirty`, `valid`, and `errors`:

```typescript
interface FieldState<TValue> {
  readonly value: WritableSignal<TValue>;
  readonly touched: Signal<boolean>;
  readonly dirty: Signal<boolean>;
  readonly disabled: Signal<boolean>;
  readonly errors: Signal<ValidationError[]>;
  readonly valid: Signal<boolean>;
  readonly invalid: Signal<boolean>;
  // ... more state properties
}
```

The key difference is that these properties are now signals, which means they integrate naturally with Angular's reactivity system and can be used directly in templates or computed values.

### The Control Directive

The magic that connects your fields to actual UI controls is the `[control]` directive. This is pretty important since it handles all the heavy lifting of binding your field state to form controls. The directive can work with:

1. **Native HTML inputs** - your regular `input`, `textarea`, `select` elements
2. **Signal Forms custom controls** - components that implement `FormValueControl` or `FormCheckboxControl`
3. **Legacy ControlValueAccessor components** - for backward compatibility with reactive forms (though you'll want to avoid this for new code)

The `[control]` directive automatically handles:

- Two-way binding between the field value and the UI control
- Syncing form state like disabled, required, etc.
- Marking fields as touched when you blur out of inputs
- Providing compatibility with existing reactive forms components

So when you write `[control]="emailField"`, you're getting all that functionality without having to wire it up manually.

### Creating Your First Signal Form

Creating a form is straightforward using the `form()` function:

```typescript
import { signal } from '@angular/core';
import { form } from '@angular/forms/signals';

@Component({
  selector: 'app-book-review',
  template: `
    <form>
      <label for="title">Book Title</label>
      <input id="title" [control]="titleField" />

      <label for="author">Author</label>
      <input id="author" [control]="authorField" />

      <button [disabled]="!reviewForm().valid()">Submit Review</button>
    </form>
  `,
})
export class BookReviewComponent {
  // Create the data model
  reviewData = signal({
    title: '',
    author: '',
    rating: 0,
    review: '',
  });

  // Create the form
  reviewForm = form(this.reviewData);

  // Access individual fields
  titleField = this.reviewForm.title;
  authorField = this.reviewForm.author;
}
```

The form automatically creates a field structure that mirrors your data model. Changes to field values directly update the original signal.

## Schema? Validation?

One of Signal Forms' coolest features is this validation approach that looks a lot like what you'd see in libraries like Zod or Yup. The API uses a `schema()` function and lets you chain validation rules in a way that feels very familiar if you've used schema validation libraries before.

Here's how you can define validation rules:

```typescript
import {
  form,
  schema,
  required,
  email,
  minLength,
  max,
} from '@angular/forms/signals';

@Component({})
export class EventRegistrationComponent {
  eventData = signal({
    eventName: '',
    organizerEmail: '',
    description: '',
    maxAttendees: 0,
  });

  eventForm = form(this.eventData, event => {
    required(event.eventName);
    minLength(event.eventName, 5, {
      message: 'Event name must be at least 5 characters',
    });

    required(event.organizerEmail);
    email(event.organizerEmail);

    required(event.description);
    minLength(event.description, 20, {
      message: 'Description must be at least 20 characters',
    });

    max(event.maxAttendees, 1000, {
      message: 'Maximum 1000 attendees allowed',
    });
  });
}
```

### Built-in Validators

Signal Forms provide a comprehensive set of built-in validators that will look familiar if you've used reactive forms - they're essentially the same validation concepts you already know, just with a different syntax:

```typescript
// Required field validation
required(path, { message: 'This field is required' });

// String length validation
minLength(path, 5);
maxLength(path, 100);

// Numeric value validation
min(path, 0);
max(path, 999);

// Pattern matching
pattern(path, /^[A-Za-z]+$/, { message: 'Letters only' });

// Email validation
email(path);
```

The validation logic itself is the same as what you'd find in `Validators.required`, `Validators.minLength`, etc. - Angular just wrapped them in a more declarative API that works with the signal-based form structure.

### Custom Validation

You can create custom validators for specific business logic. Here's a practical example with shipping address validation:

```typescript
import { customError, FieldPath, validate } from '@angular/forms/signals';

// Custom validator function that can be reused
function validateShippingAddress(
  path: FieldPath<{
    zipCode: string;
    state: string;
    country: string;
  }>
) {
  validate(path, ctx => {
    const address = ctx.value();

    // Check if we ship to this location
    const restrictedStates = ['AK', 'HI']; // Alaska, Hawaii
    if (address.country === 'US' && restrictedStates.includes(address.state)) {
      return customError({
        kind: 'shippingRestricted',
        message: "Sorry, we don't ship to this state yet",
      });
    }

    // Validate ZIP code format for US addresses
    if (address.country === 'US' && !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      return customError({
        kind: 'invalidZip',
        message: 'Please enter a valid US ZIP code',
      });
    }

    return null; // Valid
  });
}

@Component({
  template: `
    <form>
      <label for="country">Country</label>
      <select id="country" [control]="form.country">
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </select>

      <label for="state">State</label>
      <input id="state" [control]="form.state" />

      <label for="zipCode">ZIP Code</label>
      <input id="zipCode" [control]="form.zipCode" />

      @for (error of form().errors(); track error.kind) {
        <span class="error">{{ error.message }}</span>
      }

      <button type="submit" [disabled]="form().invalid()">
        Calculate Shipping
      </button>
    </form>
  `,
})
export class ShippingFormComponent {
  private shippingData = signal({
    country: 'US',
    state: '',
    zipCode: '',
  });

  protected readonly form = form(this.shippingData, address => {
    validateShippingAddress(address);
  });
}
```

You could also create more specific validators like `validateInternationalShipping(address)` for different shipping rules based on the destination.

## Advanced Features

### Conditional Logic

Signal Forms work really well with conditional logic using `disabled`, `hidden`, and `readonly` functions:

```typescript
jobApplicationForm = form(this.applicationData, application => {
  required(application.fullName);
  required(application.position);

  // Conditionally require portfolio based on role type
  required(application.portfolioUrl, {
    when: ({ fieldOf }) => fieldOf(application.position).value() === 'designer',
  });

  // Hide salary expectations for internship positions
  hidden(
    application.salaryExpectations,
    ({ fieldOf }) => fieldOf(application.position).value() === 'intern'
  );

  // Make references readonly for internal transfers
  readonly(
    application.references,
    ({ fieldOf }) => fieldOf(application.isInternalTransfer).value() === true
  );
});
```

### Nested Forms and Arrays

Signal Forms handle complex data structures pretty well:

```typescript
// Nested object form
restaurantData = signal({
  name: '',
  cuisine: '',
  location: {
    address: '',
    city: '',
    zipCode: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
});

restaurantForm = form(this.restaurantData, restaurant => {
  required(restaurant.name);
  required(restaurant.cuisine);
  required(restaurant.location.address);
  required(restaurant.location.city);

  // Validate nested coordinates
  validate(restaurant.location.coordinates.lat, ({ value }) => {
    const lat = value();
    return lat >= -90 && lat <= 90
      ? null
      : customError({ message: 'Invalid latitude' });
  });
});

// Array handling
menuItemsData = signal([
  { name: 'Pasta Carbonara', price: 18.99, category: 'main' },
  { name: 'Caesar Salad', price: 12.5, category: 'appetizer' },
]);

menuForm = form(this.menuItemsData, menuItems => {
  applyEach(menuItems, item => {
    required(item.name);
    min(item.price, 0.01);
    required(item.category);
  });
});
```

### Async Validation

Signal Forms support asynchronous validation for server-side checks:

```typescript
import { HttpClient } from '@angular/common/http';
import type { Signal } from '@angular/core';
import { Component, inject, resource, signal } from '@angular/core';
import {
  customError,
  form,
  schema,
  validateAsync,
} from '@angular/forms/signals';

@Component({
  selector: 'app-blog-form',
  // ... other config
})
export class BlogFormComponent {
  private httpClient = inject(HttpClient);

  blogData = signal({ slug: '' });

  blogPostForm = form(this.blogData, post => {
    validateAsync(post.slug, {
      params: ({ value }) => ({ slug: value() }),
      factory: (paramsSignal: Signal<{ slug: string } | undefined>) =>
        resource({
          params: () => paramsSignal(),
          loader: ({ params }) => {
            if (!params?.slug || params.slug.trim() === '') {
              return Promise.resolve(null);
            }
            return this.httpClient.post('/api/check-slug', params).toPromise();
          },
        }),
      errors: (result: { available?: boolean } | null, ctx) => {
        if (result && result.available === false) {
          return customError({
            kind: 'slugTaken',
            message: 'This slug is already taken',
          });
        }
        return null;
      },
    });
  });
}
```

## Form Submission and Error Handling

Signal Forms give you a straightforward approach to form submission:

```typescript
import { submit } from '@angular/forms/signals';

@Component({
  template: `
    <form (ngSubmit)="onSubmit()">
      <!-- form fields -->
      <button type="submit" [disabled]="!recipeForm().valid()">
        @if (recipeForm().submitting()) {
          Publishing Recipe...
        } @else {
          Publish Recipe
        }
      </button>
    </form>

    @if (recipeForm().errors().length > 0) {
      <div class="error-summary">
        @for (error of recipeForm().errorSummary(); track error) {
          <p>{{ error.message }}</p>
        }
      </div>
    }
  `,
})
export class RecipeFormComponent {
  async onSubmit() {
    if (this.recipeForm().valid()) {
      await submit(this.recipeForm, async form => {
        try {
          await this.recipeService.publishRecipe(form().value());
          return null; // Success
        } catch (error) {
          // Return server validation errors
          return [
            {
              field: form.title,
              error: customError({
                message: 'A recipe with this title already exists',
              }),
            },
          ];
        }
      });
    }
  }
}
```

### Custom Form Controls

Remember `ControlValueAccessor`? Yeah, that whole interface with `writeValue`, `registerOnChange`, `registerOnTouched`... Signal Forms make custom controls way simpler. You can create custom form controls that integrate with Signal Forms much more easily:

```typescript
@Component({
  selector: 'custom-slider',
  template: `
    <div class="slider-container">
      <input
        type="range"
        [value]="value()"
        (input)="onValueChange($event)"
        [disabled]="disabled()"
        [min]="min()"
        [max]="max()" />
      <span>{{ value() }}</span>
    </div>
  `,
})
export class CustomSliderComponent implements FormValueControl<number> {
  value = model.required<number>();
  disabled = input<boolean>(false);
  min = input<number>(0);
  max = input<number>(100);

  onValueChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(Number(target.value));
  }
}
```

No more implementing four different methods and managing callbacks - just use `model()` for your value and you're done.

## Conclusion

This is honestly pretty exciting stuff. Forms in Angular have been long overdue for a refresh, and Signal Forms feel like they're addressing real pain points that developers have been dealing with for years.

We've all been there - you start with template-driven forms because they're simple, but then your requirements grow and you hit a wall. So you switch to reactive forms, which work great at first, but as your forms get more complex, they become this bloated mess of form builders, validators, and subscriptions that's hard to reason about and maintain.

Signal Forms seem to hit that sweet spot. They give you the simplicity of working directly with your data model while providing the power and flexibility you need for complex scenarios. The schema-like validation approach feels intuitive, and the fact that everything is built on signals means you get better performance and cleaner reactive patterns out of the box.

What really gets me excited is how this could change the form development experience. No more wrestling with form builders or managing complex subscription chains. Just define your data, set up your validation rules, and let Angular's reactivity system handle the rest.

The Angular team is clearly listening to the community and addressing real developer pain points. This feels like the kind of evolution that could make form development actually enjoyable again.

> I tried to put an example [here](https://luishcastroc.github.io/angular-signal-forms-poc/basic-form) with this [repository](https://github.com/luishcastroc/angular-signal-forms-poc) using some of the concepts we discussed. Feel free to check it out and play around with it!

Want to discuss this further or share your experiences with Signal Forms? Connect with me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/), or [BlueSky](https://bsky.app/profile/mrrobot.dev). Let's explore this experimental stuff together!

If you found this guide helpful, feel free to [buy me a coffee](https://www.buymeacoffee.com/luishcastrv). Your support means a lot!
