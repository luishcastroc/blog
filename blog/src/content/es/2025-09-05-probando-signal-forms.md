---
title: Probando la API Experimental de Signal Forms de Angular
slug: probando-signal-forms
otherSlug: test-drive-signal-forms
description: Una introducción a la API experimental de Signal Forms de Angular y sus características.
author: Luis Castro
coverImage: v1712246484/signal-forms.png
date: 09-05-2025
---

## Introducción

Angular continúa su evolución hacia un futuro más reactivo y eficiente, y uno de los desarrollos más emocionantes es la introducción de **Signal Forms**. Esta nueva API experimental representa un cambio significativo respecto al enfoque familiar de los formularios reactivos, adoptando el sistema de reactividad basado en señales de Angular para ofrecer un mejor rendimiento, una experiencia de desarrollo mejorada y una gestión de formularios más intuitiva.

En este artículo, profundizaremos en lo que Angular está ofreciendo actualmente con Signal Forms, exploraremos las características que han construido hasta ahora y veremos cómo funcionan en la práctica. Ten en cuenta que esto es un trabajo en progreso: las cosas definitivamente cambiarán, las API podrían ser renombradas o rediseñadas, y algunas características que discutiremos podrían evolucionar significativamente antes de estar listas para producción.

## ¿Por qué Signal Forms?

El equipo de Angular está explorando Signal Forms como un nuevo enfoque experimental para la gestión de formularios que tiene como objetivo:

- Aprovechar el sistema de reactividad de Angular
- Proporcionar una API más intuitiva para la creación y gestión de formularios
- Permitir un mejor rendimiento a través de actualizaciones precisas
- Simplificar la validación de formularios y el manejo de errores
- Ofrecer una integración perfecta con las características modernas basadas en señales de Angular

> Signal Forms son actualmente experimentales. Si bien la funcionalidad principal es estable, la API puede evolucionar en función de los comentarios de la comunidad y el uso en el mundo real.

## Conceptos Clave

### Campos (Fields) y Estado

En el corazón de Signal Forms está el concepto de `Campo (Field)`. Un campo representa una pieza de datos del formulario junto con su estado asociado. Si has trabajado con formularios reactivos, esto te resultará familiar: tiene muchas de las mismas propiedades que conoces de `AbstractControl`, como `touched`, `dirty`, `valid` y `errors`:

```typescript
interface FieldState<TValue> {
  readonly value: WritableSignal<TValue>;
  readonly touched: Signal<boolean>;
  readonly dirty: Signal<boolean>;
  readonly disabled: Signal<boolean>;
  readonly errors: Signal<ValidationError[]>;
  readonly valid: Signal<boolean>;
  readonly invalid: Signal<boolean>;
  // ... más propiedades de estado
}
```

La diferencia clave es que estas propiedades son ahora señales, lo que significa que se integran de forma natural con el sistema de reactividad de Angular y se pueden utilizar directamente en plantillas o valores computados.

### La Directiva [control]

La magia que conecta tus campos con los controles de UI reales es la directiva `[control]`. Esto es bastante importante ya que maneja todo el trabajo pesado de vincular el estado de tu campo a los controles del formulario. La directiva puede trabajar con:

1. **Entradas HTML nativas** - tus elementos `input`, `textarea`, `select` regulares
2. **Controles personalizados de Signal Forms** - componentes que implementan `FormValueControl` o `FormCheckboxControl`
3. **Componentes Legacy ControlValueAccessor** - para compatibilidad con formularios reactivos (aunque querrás evitar esto para nuevo código)

La directiva `[control]` maneja automáticamente:

- Vinculación bidireccional entre el valor del campo y el control de la UI
- Sincronización del estado del formulario como deshabilitado, requerido, etc.
- Marcado de campos como tocados cuando sales de los inputs
- Proporcionar compatibilidad con los componentes de formularios reactivos existentes

Así que cuando escribes `[control]="emailField"`, obtienes toda esa funcionalidad sin tener que configurarla manualmente.

### Creando Tu Primer Formulario con Signal Forms

Crear un formulario es sencillo utilizando la función `form()`:

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
  // Crear el modelo de datos
  reviewData = signal({
    title: '',
    author: '',
    rating: 0,
    review: '',
  });

  // Crear el formulario
  reviewForm = form(this.reviewData);

  // Acceder a campos individuales
  titleField = this.reviewForm.title;
  authorField = this.reviewForm.author;
}
```

El formulario crea automáticamente una estructura de campos que refleja tu modelo de datos. Los cambios en los valores de los campos actualizan directamente la señal original.

## ¿Esquema? ¿Validación?

Una de las características más interesantes de Signal Forms es este enfoque de validación que se asemeja mucho a lo que verías en bibliotecas como Zod o Yup. La API utiliza una función `schema()` y te permite encadenar reglas de validación de una manera que se siente muy familiar si has utilizado bibliotecas de validación de esquemas antes.

Así es como puedes definir reglas de validación:

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
      message: 'El nombre del evento debe tener al menos 5 caracteres',
    });

    required(event.organizerEmail);
    email(event.organizerEmail);

    required(event.description);
    minLength(event.description, 20, {
      message: 'La descripción debe tener al menos 20 caracteres',
    });

    max(event.maxAttendees, 1000, {
      message: 'Se permiten un máximo de 1000 asistentes',
    });
  });
}
```

### Validadores Integrados

Signal Forms proporciona un conjunto completo de validadores integrados que te resultarán familiares si has utilizado formularios reactivos: son esencialmente los mismos conceptos de validación que ya conoces, solo que con una sintaxis diferente:

```typescript
// Validación de campo requerido
required(path, { message: 'Este campo es obligatorio' });

// Validación de longitud de cadena
minLength(path, 5);
maxLength(path, 100);

// Validación de valor numérico
min(path, 0);
max(path, 999);

// Validación de patrón
pattern(path, /^[A-Za-z]+$/, { message: 'Solo letras' });

// Validación de correo electrónico
email(path);
```

La lógica de validación en sí misma es la misma que encontrarías en `Validators.required`, `Validators.minLength`, etc. - Angular simplemente las envolvió en una API más declarativa que funciona con la estructura de formularios basada en señales.

### Validación Personalizada

Puedes crear validadores personalizados para lógica de negocio específica. Aquí hay un ejemplo práctico con la validación de direcciones de envío:

```typescript
import { validate, customError } from '@angular/forms/signals';

// Función de validador personalizada que se puede reutilizar
function validateShippingAddress(
  path: FieldPath<{
    zipCode: string;
    state: string;
    country: string;
  }>
) {
  validate(path, ctx => {
    const address = ctx.value();

    // Verificar si hacemos envíos a esta ubicación
    const restrictedStates = ['AK', 'HI']; // Alaska, Hawaii
    if (address.country === 'US' && restrictedStates.includes(address.state)) {
      return customError({
        kind: 'shippingRestricted',
        message: 'Lo sentimos, no hacemos envíos a este estado todavía',
      });
    }

    // Validar el formato del código ZIP para direcciones de EE. UU.
    if (address.country === 'US' && !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      return customError({
        kind: 'invalidZip',
        message: 'Por favor, introduce un código ZIP válido de EE. UU.',
      });
    }

    return null; // válido
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

También podrías crear validadores más específicos como `validateInternationalShipping(address)` para diferentes reglas de envío según el destino.

## Características Avanzadas

### Lógica Condicional

Signal Forms funcionan muy bien con la lógica condicional utilizando las funciones `disabled`, `hidden` y `readonly`:

```typescript
jobApplicationForm = form(this.applicationData, application => {
  required(application.fullName);
  required(application.position);

  // Condicionalmente requiere el portafolio según el tipo de rol
  required(application.portfolioUrl, {
    when: ({ fieldOf }) => fieldOf(application.position).value() === 'designer',
  });

  // Oculta las expectativas salariales para puestos de prácticas
  hidden(
    application.salaryExpectations,
    ({ fieldOf }) => fieldOf(application.position).value() === 'intern'
  );

  // Hace que las referencias sean de solo lectura para transferencias internas
  readonly(
    application.references,
    ({ fieldOf }) => fieldOf(application.isInternalTransfer).value() === true
  );
});
```

### Formas Anidadas y Arreglos

Signal Forms manejan estructuras de datos complejas bastante bien. Puedes crear formularios anidados y manejar arreglos de manera sencilla:

```typescript
// Objeto anidado
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

  // Validar coordenadas anidadas
  validate(restaurant.location.coordinates.lat, ({ value }) => {
    const lat = value();
    return lat >= -90 && lat <= 90
      ? null
      : customError({ message: 'Invalid latitude' });
  });
});

// Manejo de arreglos
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

### Validación Asíncrona

Signal Forms soporta la validación asíncrona para verificaciones del lado del servidor:

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

## Envío de Formularios y Manejo de Errores

Signal Forms te ofrecen un enfoque sencillo para el envío de formularios:

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
          return null; // Éxito
        } catch (error) {
          // Regresar errores de validación del servidor
          return [
            {
              field: form.title,
              error: customError({
                message: 'Ya existe una receta con este título',
              }),
            },
          ];
        }
      });
    }
  }
}
```

### Controles de Formulario Personalizados

¿Recuerdas `ControlValueAccessor`? Sí, toda esa interfaz con `writeValue`, `registerOnChange`, `registerOnTouched`... Signal Forms hacen que los controles personalizados sean mucho más simples. Puedes crear controles personalizados que se integren con Signal Forms mucho más fácilmente:

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

No más implementar cuatro métodos diferentes y gestionar callbacks: solo usa `model()` para tu valor y listo.

## Conclusión

Esto es, honestamente, algo muy emocionante. Los formularios en Angular han estado esperando una actualización durante mucho tiempo, y Signal Forms parecen estar abordando puntos de dolor reales con los que los desarrolladores han estado lidiando durante años.

Todos hemos estado allí: comienzas con formularios basados en plantillas porque son simples, pero luego tus requisitos crecen y te topas con una pared. Así que cambias a formularios reactivos, que funcionan genial al principio, pero a medida que tus formularios se vuelven más complejos, se convierten en un lío inflado de constructores de formularios, validadores y suscripciones que es difícil de razonar y mantener.

Signal Forms parecen dar en el clavo. Te ofrecen la simplicidad de trabajar directamente con tu modelo de datos mientras proporcionan el poder y la flexibilidad que necesitas para escenarios complejos. El enfoque de validación similar a un esquema se siente intuitivo, y el hecho de que todo esté construido sobre señales significa que obtienes un mejor rendimiento y patrones reactivos más limpios desde el principio.

Lo que realmente me emociona es cómo esto podría cambiar la experiencia de desarrollo de formularios. No más luchar con constructores de formularios o gestionar cadenas de suscripción complejas. Simplemente define tus datos, establece tus reglas de validación y deja que el sistema de reactividad de Angular se encargue del resto.

El equipo de Angular claramente está escuchando a la comunidad y abordando los verdaderos puntos de dolor de los desarrolladores. Esto se siente como el tipo de evolución que podría hacer que el desarrollo de formularios sea realmente agradable nuevamente.

> Intenté poner un ejemplo [aquí](https://luishcastroc.github.io/angular-signal-forms-poc/basic-form) con este [repositorio](https://github.com/luishcastroc/angular-signal-forms-poc) usando los conceptos que discutimos. ¡Siéntete libre de echar un vistazo y experimentar con él!

¿Quieres discutir esto más a fondo o compartir tus experiencias con Signal Forms? Conéctate conmigo en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/), o [BlueSky](https://bsky.app/profile/mrrobot.dev). ¡Exploremos juntos estas cosas experimentales!

Si encontraste útil esta guía, no dudes en [invitarme a un café](https://www.buymeacoffee.com/luishcastrv). ¡Tu apoyo significa mucho!
