---
title: "Ok, Let's Actually Talk About AI: Three Terms Worth Knowing"
slug: ai-vocabulary-every-developer-should-know
otherSlug: vocabulario-ai-que-todo-desarrollador-deberia-conocer
description: What distillation, hallucination, and context mean, why I wanted to understand them, and how they change the way I use AI.
author: Luis Castro
coverImage: v1719000572/lets-talk-ai.jpg
date: 07-20-2026
---

## 🤔 Why I Wanted to Understand These Terms

I keep seeing the same three terms in meetings, documentation, and model announcements: **distillation**, **hallucination**, and **context**. I knew the short definitions, but I couldn't explain them in my own words. That bothered me. If I use these tools every day, I want to know what those terms mean and what they change in my work.

I'm not an AI researcher. I'm a developer who wants to make good choices with the tools I use. This article explains each term, gives a current example, and shows how I use it.

## 🧪 Distillation: Training a Smaller Model from a Stronger One

**Knowledge distillation** trains one model to reproduce useful behavior from a stronger model. Researchers call the stronger model the **teacher** and the model that learns the **student**. During training, the teacher provides answers or a probability for each possible option. The student learns from that information and later answers on its own.

### First, What Are Weights?

Large language models are deep neural networks. A **parameter** is a number the model learns during training. A **weight** is a type of parameter that controls how much one value inside the network affects the next calculation.

At its simplest, a layer multiplies an input value by a weight:

`input value × weight = contribution to the next calculation`

If the input is `0.8` and the weight is `1.5`, the contribution is `1.2`. If the weight is `0.1`, the contribution is `0.08`. If it is `-1.5`, the contribution is `-1.2`. The weight changes the size and sign of the result.

A language model represents each token with a list of numbers. Each layer uses its weights to combine those numbers into a new list. After many layers, the model uses the final values to assign a probability to each possible next token: a word, part of a word, punctuation mark, or other unit of text.

One weight doesn't contain a grammar rule, a fact, or a complete skill. What the model learned is spread across billions of parameters.

During training, the model makes a prediction and calculates a **loss**, a number that measures how far the prediction is from the training target. Training adjusts the parameters with the goal of minimizing that loss. When people say a model "learned" something, they mean that training reduced its loss and made its predictions better match the training goal, not only that its output changed.

A lower loss does not prove that the model represents reality or will answer every new case correctly. That also depends on the data, the training goal, and how we test the model.

The system must store the parameters and use many of them when the model answers. Fewer parameters often mean less memory and less calculation for each response.

### A Grammar Example

Suppose I want a fast service that fixes grammar. I can use a strong model to create training examples for a smaller model:

The student can start as an existing language model. The team then adjusts it with examples from the teacher:

1. I give the teacher: `Fix the grammar: "She don't have time."`
2. The teacher returns: `She doesn't have time.`
3. I save the request and correction as a training example.
4. During training, the student predicts each token in the correction, and the software calculates the loss between those predictions and the expected tokens.
5. The software adjusts the student's parameters to reduce that loss, which makes the teacher's correction more likely.

The team repeats the process with many sentences. The goal is for the student to apply the same grammar patterns to sentences it didn't see during training. Once training ends, the student no longer needs the teacher.

The process doesn't copy the teacher's weights. It gives the student examples to match and adjusts only the student's parameters.

In the [classic method from Hinton, Vinyals, and Dean](https://arxiv.org/abs/1503.02531), trainers use more than the teacher's final answer. They also use the probability that the teacher assigned to each option. At the point where the sentence needs `doesn't`, the teacher may assign it a much higher probability than `don't` and other choices. Researchers call these probability lists _soft targets_.

With current language models, teams may use the teacher's token probabilities, save its generated answers and solutions, or use both. People often call training on saved answers _response distillation_ or _data distillation_. The training data differs, but the goal stays the same: reduce the student's loss until it reproduces useful parts of the teacher's behavior.

<img class="article-diagram" src="https://res.cloudinary.com/lhcc0134/image/upload/distillation-en.svg" alt="Knowledge distillation diagram showing a teacher model providing training signals to independently trained student models, with DeepSeek-R1 as an example" />

[DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1) is a public example. R1 has 671 billion total parameters and activates 37 billion of them for each token. DeepSeek used samples generated by R1 to train six smaller models based on Qwen and Llama. They range from 1.5 billion to 70 billion parameters. Each R1-Distill model can answer on its own.

### What This Changes When I Pick a Model

A smaller model can use less memory, answer sooner, and cost less to run. It can also lose accuracy, range, or consistency. For me, the test is direct: does the smaller model meet my quality target on my own cases?

[Anthropic describes Claude Haiku 4.5](https://platform.claude.com/docs/en/about-claude/models/overview) as its fastest current model, Sonnet 5 as its best mix of speed and intelligence, Opus 4.8 as a model for complex coding and business work, and Fable 5 as its most capable widely released model.

If I need to fix the grammar in one sentence, I'd start with Haiku. If I need to write a full article with several sources, I'd start with Sonnet or Opus. If my tests show that I need the highest available capability, I'd use Fable. I use this only as a model-choice example. Anthropic doesn't say whether it used distillation to create these models.

The practical rule is simple: start with the fastest model that may meet the requirement, then test it. Use a more capable model when the result doesn't meet the quality you need.

## ⚠️ Hallucination: When a Model Invents an Answer

A **hallucination** is an answer that contains false, invented, or unsupported information. A model may invent a date, quote, source, package, or API and state it without a warning.

What concerns me is the lack of a clear signal. The model can use the same tone for a false answer and a correct one. It doesn't mark the part it invented.

A language model predicts the next token from patterns in its training data and the current request. It doesn't check each claim against a trusted source. A [2026 paper in _Nature_](https://www.nature.com/articles/s41586-026-10549-w) explains that next-token training can produce false text that follows common language patterns. It also shows how tests that reward only correct answers can make guessing score better than saying "I don't know." Search, tools, and better training can reduce errors, but you still need to check important claims.

<img class="article-diagram" src="https://res.cloudinary.com/lhcc0134/image/upload/hallucination-en.svg" alt="Diagram contrasting a verified JavaScript API with an invented package and listing checks to perform before using generated code" />

In _Mata v. Avianca_, lawyers filed court papers with false cases and quotes generated by ChatGPT. They kept using them after the other side questioned them. A [federal judge sanctioned them in June 2023](https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1%3A2022cv01461/575368/54/) and ordered a $5,000 penalty.

Code has the same risk. A model can invent a package name that looks valid. A [USENIX Security 2025 study](https://www.usenix.org/publications/loginonline/we-have-package-you-comprehensive-analysis-package-hallucinations-code) generated 576,000 Python and JavaScript samples with 16 coding models. In that test, 19.6% of package references were false on average. The rate was about 5% for commercial models and 21% for open models.

A [May 2026 preprint](https://arxiv.org/abs/2605.17062) repeated the test with five newer models and 199,845 paired prompts. It found rates from 4.62% to 6.10%. It also found 127 false package names that all five models generated. An attacker can register one of those names and add harmful code. Security researchers call this **slopsquatting**.

Before you use generated code:

- Confirm that each package exists in the official registry and docs.
- Check the owner, release dates, and version history.
- Pin the version you reviewed.
- Run unknown code in an isolated environment.
- Use tests and code review.

I review an answer based on the harm an error could cause. Verify legal, medical, financial, security, and public claims before you use or publish them. A draft or list of ideas needs less review. If an answer cites a source, open it and confirm that it supports the claim.

## 📚 Context: What a Model Can Use in One Request

I used to treat context as another name for chat history. The term covers much more.

A **token** is a short part of text. A **context window** sets the largest number of tokens a model can use for one request. The count can include system rules, your request, chat history, tool results, retrieved documents, and the answer.

Providers count input and output in different ways. An API may reject a request that exceeds its limit. A chat app may shorten old messages or remove them. The model can't use text after the app removes it from the request.

<img class="article-diagram" src="https://res.cloudinary.com/lhcc0134/image/upload/context-en.svg" alt="Diagram explaining that a context limit measures capacity, not guaranteed understanding, and that long-context performance depends on the task, position, and unrelated text" />

As of July 2026, several current models accept about one million tokens. [OpenAI lists 1.05 million](https://developers.openai.com/api/docs/models) for the GPT-5.6 family. [Anthropic lists one million](https://platform.claude.com/docs/en/about-claude/models/overview) for Claude Fable 5, Opus 4.8, and Sonnet 5, but 200,000 for Haiku 4.5. [Gemini 3.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash) accepts 1,048,576 input tokens and up to 65,536 output tokens.

These limits state how many tokens a request can contain. They don't state how well the model will use each token. Results depend on the model, task, language, location of key facts, and amount of unrelated text.

A [2026 test based on full novels](https://aclanthology.org/2026.latechclfl-1.28/) tested seven leading models. None kept stable results past 64,000 tokens on those tasks. Test your product with the same type of long document that it will use.

The ["Lost in the Middle" study](https://arxiv.org/abs/2307.03172) found another issue. In some search and question tasks, models did better when key facts appeared near the start or end. They did worse when the same facts appeared in the middle. Place key rules and facts clearly, and test where you put them.

Coding tools also add rules to the context. [Claude Code](https://code.claude.com/docs/en/features-overview) loads `CLAUDE.md` when a session starts. It loads short skill descriptions so it can select a skill, then loads the full skill only when needed. Anthropic calls this [progressive disclosure](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview). Other tools use different rules, so check their docs and measure the requests they send.

<img class="article-diagram" src="https://res.cloudinary.com/lhcc0134/image/upload/instructions-en.svg" alt="Diagram comparing instructions loaded at the start with skills loaded when needed" />

You can manage context with a few steps:

- Keep project rules short and specific.
- Remove or summarize old chat turns.
- Retrieve only the parts of a document that answer the request.
- Load detailed instructions only when the tool supports it.
- Track token use, response time, cost, and answer quality.

Fewer tokens can cut cost and response time. I don't aim for the shortest request. I aim for the shortest request that still includes every fact and rule the task needs.

## 💭 Final Thoughts

I started this article because I kept hearing these terms in meetings, documentation, and model announcements. I wanted to understand what they mean, how they affect my work, and how they change the way I use AI tools.

Distillation helps me understand how a smaller model can learn some skills from a stronger one. It does not tell me which model to use, so I still test each model on the job. Hallucination reminds me to verify claims, with more care when an error could cause harm. Context reminds me to send the most useful information in a clear order instead of adding every document and hoping the model finds what matters.

I don't need to train a model or read every paper. I do need enough knowledge to ask useful questions and check the result. The model can give me a first answer. I still decide whether I can use it.

These terms don't make me an AI expert. They make my daily choices clearer. That's enough reason for me to learn them, and I think every developer can benefit from doing the same.

---

If this article helped, tell me which term you use most or what you would add. You can find me on [Twitter](https://twitter.com/LuisHCCDev), [Threads](https://www.threads.net/@luishccdev), or [LinkedIn](https://www.linkedin.com/in/luis-castro-cabrera/).

If you want to support my work, you can [buy me a coffee](https://www.buymeacoffee.com/luishcastrv).
