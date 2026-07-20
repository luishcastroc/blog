---
title: 'Ok, hablemos de IA: tres términos que conviene conocer'
slug: vocabulario-ai-que-todo-desarrollador-deberia-conocer
otherSlug: ai-vocabulary-every-developer-should-know
description: Qué significan la destilación, la alucinación y el contexto, por qué quise entenderlos y cómo cambian mi forma de usar la IA.
author: Luis Castro
coverImage: v1719000572/lets-talk-ai.jpg
date: 07-20-2026
---

## 🤔 Por qué quise entender estos términos

Últimamente veo los mismos tres términos en juntas, documentación y anuncios de modelos: **destilación**, **alucinación** y **contexto**. Conocía las definiciones cortas, pero no podía explicarlas con mis propias palabras. Eso me molestó. Si uso estas herramientas todos los días, quiero saber qué significan esos términos y como cambian la manera en que trabajo.

No soy investigador de IA. Soy desarrollador y quiero tomar buenas decisiones con las herramientas que uso. Este artículo explica cada término, muestra un ejemplo actual y describe cómo lo uso.

## 🧪 Destilación: Entrenar un modelo chico con uno más capaz

La **destilación de conocimiento** entrena un modelo para reproducir comportamientos útiles de otro más capaz. En los estudios, al modelo más capaz le dicen **profesor** y al que aprende le dicen **estudiante**. Durante el entrenamiento, el profesor da respuestas o una probabilidad para cada opción posible. El estudiante aprende de esa información y después responde por su cuenta.

### Primero, ¿qué son los pesos?

Los modelos grandes de lenguaje son redes neuronales profundas. Un **parámetro** es un número que el modelo aprende durante el entrenamiento. Un **peso** es un tipo de parámetro que controla cuánto influye un valor dentro de la red en el siguiente cálculo.

En el caso más simple, una capa multiplica un valor de entrada por un peso:

`valor de entrada × peso = aporte al siguiente cálculo`

Si el valor de entrada es `0.8` y el peso es `1.5`, el aporte es `1.2`. Si el peso es `0.1`, el aporte es `0.08`. Si es `-1.5`, el aporte es `-1.2`. El peso cambia el tamaño y el signo del resultado.

Un modelo de lenguaje representa cada token con una lista de números. Cada capa usa sus pesos para combinar esos números y crear otra lista. Después de muchas capas, el modelo usa los valores finales para asignar una probabilidad a cada posible token siguiente: una palabra, una parte de una palabra, un signo o alguna otra unidad de texto.

Un solo peso no guarda una regla de gramática, un dato o una habilidad completa. Lo que el modelo aprendió se reparte entre miles de millones de parámetros.

Durante el entrenamiento, el modelo hace una predicción y calcula una **pérdida**, un valor que mide qué tan lejos quedó del resultado esperado. El entrenamiento ajusta los parámetros con la meta de reducir esa pérdida al mínimo. Cuando decimos que un modelo "aprendió" algo, queremos decir que el entrenamiento redujo la pérdida y que sus predicciones se acercaron al objetivo, no solo que cambió su respuesta.

Una pérdida menor no prueba que el modelo represente la realidad o que responda bien en cada caso nuevo. Eso también depende de los datos, del objetivo y de cómo probamos el modelo.

El sistema debe guardar los parámetros y usar muchos de ellos cuando el modelo responde. Menos parámetros suelen requerir menos memoria y menos cálculo para cada respuesta.

### Un ejemplo de gramática

Supón que quiero un servicio rápido para corregir gramática. Puedo usar un modelo capaz para crear ejemplos de entrenamiento para uno más chico:

El estudiante puede empezar como un modelo de lenguaje que ya existe. El equipo después lo ajusta con ejemplos del profesor:

1. Le mando al profesor: `Corrige la gramática: "Ella no tienen tiempo."`
2. El profesor responde: `Ella no tiene tiempo.`
3. Guardo la solicitud y la corrección como un ejemplo de entrenamiento.
4. Durante el entrenamiento, el estudiante predice cada token de la corrección y el programa calcula la pérdida entre esas predicciones y los tokens esperados.
5. El programa ajusta los parámetros del estudiante para reducir esa pérdida, lo que aumenta la probabilidad de que dé la misma corrección.

El equipo repite el proceso con muchas oraciones. La meta es que el estudiante aplique las mismas reglas de gramática a oraciones que no vio durante el entrenamiento. Cuando termina el entrenamiento, el estudiante ya no necesita al profesor.

El proceso no copia los pesos del profesor. Le da al estudiante ejemplos que debe igualar y ajusta solo los parámetros del estudiante.

En el [método clásico de Hinton, Vinyals y Dean](https://arxiv.org/abs/1503.02531), los equipos usan más que la respuesta final del profesor. También usan la probabilidad que el profesor asignó a cada opción. En la parte donde la oración necesita `tiene`, el profesor puede asignarle una probabilidad mucho mayor que a `tienen` y otras palabras. Quienes investigan este tema llaman _objetivos suaves_ a esas listas de probabilidades.

Con los modelos de lenguaje actuales, los equipos pueden usar las probabilidades de cada token, guardar las respuestas y soluciones que genera el profesor o usar ambas cosas. Los equipos llaman _destilación de respuestas_ o _de datos_ al entrenamiento con respuestas guardadas. Los datos de entrenamiento cambian, pero la meta es la misma: reducir la pérdida del estudiante hasta que reproduzca partes útiles del comportamiento del profesor.

<img class="article-diagram" src="https://res.cloudinary.com/lhcc0134/image/upload/distillation-es.svg" alt="Diagrama de destilación de conocimiento donde un modelo profesor da señales de entrenamiento a modelos estudiantes independientes, usando DeepSeek-R1 como ejemplo" />

[DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1) es un ejemplo público. R1 tiene 671 mil millones de parámetros en total y activa 37 mil millones de ellos por cada token. DeepSeek usó muestras generadas por R1 para entrenar seis modelos más chicos basados en Qwen y Llama. Van de 1.5 a 70 mil millones de parámetros. Cada modelo R1-Distill puede responder por su cuenta.

### Qué cambia cuando elijo un modelo

Un modelo chico puede usar menos memoria, responder más rápido y costar menos. También puede perder precisión, alcance o constancia. Para mí, la prueba es muy concreta: ¿el modelo chico cumple mi meta de calidad con mis propios casos?

[Anthropic describe a Claude Haiku 4.5](https://platform.claude.com/docs/en/about-claude/models/overview) como su modelo actual más rápido, a Sonnet 5 como su mejor combinación de velocidad e inteligencia, a Opus 4.8 como un modelo para programación compleja y trabajo empresarial, y a Fable 5 como su modelo más capaz con acceso general.

Si solo necesito corregir la gramática de una oración, primero probaría Haiku. Si necesito armar un artículo completo con varias fuentes, empezaría con Sonnet u Opus. Si mis pruebas muestran que necesito la mayor capacidad disponible, usaría Fable. Uso esto solo como ejemplo para elegir un modelo. Anthropic no dice si usó destilación para crear estas versiones.

La regla práctica es simple: empieza con el modelo más rápido que podría cumplir el requisito y pruébalo. Usa uno más capaz cuando el resultado no tenga la calidad que necesitas.

## ⚠️ Alucinación: Cuando un modelo inventa una respuesta

Una **alucinación** es una respuesta con datos falsos, inventados o sin respaldo. Un modelo puede inventar una fecha, cita, fuente, paquete o API y decirlo sin avisar.

Lo que me preocupa es que no hay una señal clara. El modelo puede usar el mismo tono para una respuesta falsa y una correcta. No marca la parte que inventó.

Un modelo de lenguaje calcula qué token sigue a partir de los patrones que aprendió y de la solicitud actual. No compara cada dato con una fuente confiable. Un [estudio publicado en _Nature_ en 2026](https://www.nature.com/articles/s41586-026-10549-w) explica que este tipo de entrenamiento puede producir errores con una redacción normal. También muestra que una prueba que solo premia respuestas correctas puede dar más puntos por adivinar que por decir "no sé". Las búsquedas, las herramientas y un mejor entrenamiento reducen errores. Aun así, revisa los datos importantes.

<img class="article-diagram" src="https://res.cloudinary.com/lhcc0134/image/upload/hallucination-es.svg" alt="Diagrama que contrasta una API real y verificada de JavaScript con un paquete inventado, y muestra qué revisar antes de usar código generado" />

En _Mata v. Avianca_, unos abogados entregaron documentos al tribunal con casos y citas falsas que generó ChatGPT. Siguieron usándolos después de que la otra parte los cuestionó. En junio de 2023, [un juez federal los sancionó](https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1%3A2022cv01461/575368/54/) y ordenó una multa de 5,000 dólares.

El código tiene el mismo riesgo. Un modelo puede inventar un paquete con un nombre que parece válido. Un [estudio de USENIX Security 2025](https://www.usenix.org/publications/loginonline/we-have-package-you-comprehensive-analysis-package-hallucinations-code) generó 576,000 muestras de Python y JavaScript con 16 modelos de código. En esa prueba, 19.6% de las referencias a paquetes fueron falsas en promedio. La tasa fue cercana a 5% en modelos comerciales y a 21% en modelos abiertos.

Un [estudio preliminar de mayo de 2026](https://arxiv.org/abs/2605.17062) repitió la prueba con cinco modelos más nuevos y 199,845 pares de solicitudes. Encontró tasas de 4.62% a 6.10%. También encontró 127 nombres falsos que generaron los cinco modelos. Un atacante puede registrar uno de esos nombres y agregar código dañino. Quienes estudian seguridad llaman **slopsquatting** a este ataque.

Antes de usar código generado:

- Busca cada paquete en el registro oficial y en la documentación.
- Checa quién lo publica, las fechas y el historial de versiones.
- Fija la versión que revisaste.
- Ejecuta código desconocido en un entorno aislado.
- Usa pruebas y revisión de código.

Yo reviso una respuesta según el daño que podría causar un error. Confirma datos legales, médicos, financieros, de seguridad o destinados al público antes de usarlos o publicarlos. Un borrador o una lista de ideas necesita menos revisión. Si una respuesta cita una fuente, ábrela y confirma que respalda lo que dice.

## 📚 Contexto: Lo que un modelo puede usar en una solicitud

Antes usaba contexto como otro nombre para el historial. El término incluye mucho más.

Un **token** es una parte corta de texto. Una **ventana de contexto** fija el número máximo de tokens que un modelo puede usar en una solicitud. La cuenta puede incluir reglas del sistema, lo que le pides, el historial, resultados de herramientas, documentos y la respuesta.

Cada proveedor cuenta la entrada y la salida de forma distinta. Una API puede rechazar una solicitud que supera su límite. Una aplicación de chat puede resumir o quitar mensajes viejos. El modelo no puede usar el texto que la aplicación quitó.

<img class="article-diagram" src="https://res.cloudinary.com/lhcc0134/image/upload/context-es.svg" alt="Diagrama que explica que el límite de contexto mide capacidad, no comprensión garantizada, y que el resultado depende de la tarea, la posición y el texto sin relación" />

En julio de 2026, varios modelos aceptan cerca de un millón de tokens. [OpenAI indica 1.05 millones](https://developers.openai.com/api/docs/models) para la familia GPT-5.6. [Anthropic indica un millón](https://platform.claude.com/docs/en/about-claude/models/overview) para Claude Fable 5, Opus 4.8 y Sonnet 5, pero 200,000 para Haiku 4.5. [Gemini 3.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash) acepta 1,048,576 tokens de entrada y hasta 65,536 de salida.

Esos límites solo fijan cuántos tokens puede recibir una solicitud. No dicen qué tan bien usará el modelo cada token. El resultado cambia según el modelo, la tarea, el idioma, la ubicación de los datos clave y la cantidad de texto sin relación.

Una [prueba de 2026 basada en novelas completas](https://aclanthology.org/2026.latechclfl-1.28/) evaluó siete modelos líderes. Ninguno mantuvo resultados estables después de 64,000 tokens en esas tareas. Prueba tu producto con el mismo tipo de documento largo que usará.

El estudio ["Lost in the Middle"](https://arxiv.org/abs/2307.03172) encontró otro problema. En algunas tareas de búsqueda y preguntas, los modelos respondieron mejor cuando los datos clave estaban al inicio o al final. Respondieron peor cuando los mismos datos estaban en medio. Pon las reglas y los datos clave en un lugar claro, y prueba distintas posiciones.

Las herramientas de IA para programar también agregan reglas al contexto. [Claude Code](https://code.claude.com/docs/en/features-overview) carga `CLAUDE.md` al iniciar una sesión. También carga descripciones breves de sus funciones especializadas, llamadas _skills_ en el producto. Solo carga las instrucciones completas cuando usa una. Anthropic llama a este sistema [carga progresiva](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview). Cada herramienta usa reglas distintas, así que revisa su documentación y mide las solicitudes que envía.

<img class="article-diagram" src="https://res.cloudinary.com/lhcc0134/image/upload/instructions-es.svg" alt="Diagrama que compara instrucciones cargadas al inicio con instrucciones cargadas cuando hacen falta" />

Puedes controlar el contexto con estos pasos:

- Escribe reglas cortas y concretas.
- Quita o resume mensajes viejos.
- Recupera solo las partes de un documento que responden a la solicitud.
- Carga instrucciones detalladas solo cuando la herramienta lo permita.
- Mide los tokens, el tiempo, el costo y la calidad.

Usar menos tokens puede reducir el costo y el tiempo de respuesta. No busco la solicitud más corta. Busco la más corta que aún incluye todos los datos y reglas que la tarea necesita.

## 💭 Reflexiones finales

Empecé este artículo porque seguía escuchando estos términos en juntas, documentación y anuncios de modelos. Quería entender qué significan, cómo afectan mi trabajo y cómo cambian la forma en que uso las herramientas de IA.

La destilación me ayuda a entender cómo un modelo chico puede aprender algunas habilidades de uno más capaz. No me dice cuál modelo usar, así que pruebo cada uno con la tarea que necesito resolver. La alucinación me recuerda que debo comprobar lo que afirma, con más cuidado si un error puede causar daño. El contexto me recuerda que debo mandar la información más útil y ordenarla bien, en vez de agregar todos los documentos y esperar que el modelo encuentre lo importante.

No necesito entrenar un modelo ni leer todos los estudios. Sí necesito entender lo suficiente para hacer preguntas útiles y revisar el resultado. El modelo puede darme una primera respuesta. Yo decido si puedo usarla.

Estos términos no me vuelven experto en IA. Sí hacen que mis decisiones diarias sean más claras. Para mí, esa es razón suficiente para aprenderlos, y creo que a cualquier desarrollador le sirven.

---

Si este artículo te sirvió, cuéntame cuál de estos términos usas más o qué agregarías. Me encuentras en [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev) o [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/).

Si quieres apoyar mi trabajo, puedes [invitarme un café](https://www.buymeacoffee.com/luishcastrv).
