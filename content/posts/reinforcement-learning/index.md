---
title: "What is Deep Reinforcement Learning (RL)"
description: "Here we introduce language and notation used to discuss RL and explain what RL do"
date: 2024-08-09
tags: ["machine learning", "reinforcement learning", "theory"]
series: ["Reinforcement Learning and Deep Reinforcement Learning"]
series_order: 1
showAuthor: false
seriesOpened: true
showTableOfContents: true
showHero: true
heroStyle: background
---

## What is Reinforcement Learning (RL)

Reinforcement Learning (RL) is a study of `agents` and how `agents learn by trial and error`.

> RL `formalizes` the idea that `rewarding` or `punishing` an agent for a certain behavior makes it more likely to `repeat` or `forego` such behavior in the future.

### Key Concepts in Reinforcement Learning

The main characters of RL are the `agent` and the `environment`.

- The `environment` is where the `agent` lives in and interact with. The `agent` sees the `state`, \\(s\\), of the `environment` and decide an `action`, \\(a\\), to take.
- The `agent` obtains a `reward`, \\(r\\), signal from the `environment`, a numeric value indicating how _good_ or _bad_ the current `state` is. The overall goal of the `agent` is to **maximize** its **_cumulated reward_**, `return`.

![Agent-environment interaction loop](https://media.springernature.com/full/springer-static/image/art%3A10.1007%2Fs11012-024-01830-1/MediaObjects/11012_2024_1830_Fig1_HTML.png?as=webp "Agent-environment interaction loop.")

Deep Reinforcement Learning (RL) combines deep learning techniques with reinforcement learning to enable agents to learn optimal strategies from large volumes of complex data.

#### What is a policy in reinforcement learning?

A `policy` is a rule that used by an agent to _determine_ its `action`s. A policy (\\(t\\) is a time step) can be described as:

- Deterministic: \\(a_t = \mu(s_t)\\)
- Stochastic: \\(a \_t \sim \pi(\cdot | s \_t)\\), where \\(\pi\\) is used instead of \\(\mu\\)

\\(\theta\\) or \\(\phi \\) are used when parameterized policies (learning from a neuron network, _NN_), we have \\(\mu\_{\theta}\\) and \\(\pi\_{\theta}\\) respectively.

#### What is a Trajectory?

A trajectory \\(\tau\\) is a sequence of `states` and `actions`:

$$\tau = (s_0, a_0, s_1, a_1, ...).$$

_State transition_ at different \\(t\\) steps (_i.e._ \\(s\_{t}\\) to \\(s\_{t+1}\\)) can be deterministic, \\(s\_{t+1} = f(s_t, a_t)\\), or stochastic, \\(s\_{t+1} \sim P(\cdot|s_t, a_t)\\).

#### Reward function and Return

A `reward function` \\(R\\) depends on **_the current state of the world, the action just taken, and the next state of the world_**.

$$r_t = R(s_t, a_t, s_{t+1})$$

frequently simplified as `current state` \\(r_t = R(s_t)\\), or `state-action pair` \\(r_t = R(s_t,a_t)\\).

Getting `reward` over a `trajectory` yields `return` \\(R(\tau)\\):

### From Supervised Learning to Reinforcement Learning

There are a lot of machine learning tasks considered as supervised learning:

- **Image Classifier**: Let the machine know what the input is _AND_ the outoput (that it is supposed to give), then train the model.
- **Self-supervised Learning**: Supervised learning _IN REALITY_, where labels can be generated _automatically_.
- **Auto-Encoder**: An _unsupervised_ method (no human labeling), but in reality still uses labels that do _NOT_ require humans to generate.

Reinforcement Learning, on the other hand, is quite different: You do _NOT_ know the **_BEST_** `output` when you give machine an `input`.

{{< badge >}}
You may attempt to use supervised learning methods when teaching the machine to play a game, predicting the best next move giving what the current state of the game. You may also feed the model with recordings from previous matches. In the end of the day, there are A LOT OF LIMITATIONS (i.e. What is the best answer? How do I know the correct answer?, etc.). It is still challenging to label data in many tasks. The machines, thankfully, knows whether the results are good using reinforcement learning (RL)

{{< /badge >}}

{{< katex >}}

## Overview

This series is consist of the following parts.

- What is Reinforcement Learning (RL)?
  - `3` steps in machine learning.
  - Markov Decision Process (MDP), what is that? 🫣
- Policy Gradient
- Actor-Critic
- Reward Shaping
- Learning from Demonstration (No Reward)

## What is RL?

Machine learning is roughly equivalent to "looking for a function".

There are interactions between `Actor` and `Environment` in RL (read, then close your eyes and imagine).

- `Environment` provides an `Observation` to the `Actor`.
- `Observation` is the **Input** of `Actor`.
- `Actor` looks into the `Observation` and provides an **Output** called `Action`.
- `Action` has _impacts_ on `Environment`.
- `Environment` provides a `Observation` to the `Actor`.
- The cycle goes on and on.

So, `Actor` is just the _function_ we are looking for. \\(\textbf{Action} = f(\textbf{Observation})\\).

During the interaction, the `Environment` continuously provides `Actor` with `Reward` (telling the `Actor` if the `Action` is good or not ). Therefore the `Actor` we are looking for (a.k.a the **function** _above_) _aims_ to maximize the `Reward` combined from `Environment`.

{{< alert icon="fire" cardColor="#ff3926" iconColor="#aaaaff" textColor="#f1faee" >}}
Find a `policy` that _maximizes_ the `TOTAL` reward
{{< /alert >}}

### Space Invader and RL

The first couple papers on RL is about Space Invader

- An`Observation` is a scene from the game (`Actor` sees things like we human see).
- An `Action` is predefined (left, right, fire).
- Scene (`Observation`) changes after an `Action`.
- `Reward` can be obtained (kill: `Reward`+5, etc.)

{{< alert icon="google" cardColor="#3e5357" iconColor="#d5a6bd" textColor="#ffffff" >}}
Just search the `world wide web` to grasp more on the concepts of RL.
{{< /alert >}}

### Three Steps of ML (or/and RL)

1. Function with unknown
2. Define loss from training data
3. Optimization

#### Function with unknown

A.K.A `Actor` -> `Policy Network` (in the "_prehistoric_" era of RL, it could even be a _look-up table_ 😳. now, of course, we do DNN).

- **Input of neural network (NN)**: the observation of machine represented as a `vector` or a `matrix`.
- **Out of NN**: each neuron in the **output layer** corresponds to one _individual_ action, which is also have a _score_ associated (via passing `input` through the NN). it will be something like {fire:0.5, left:0.3, right:0.2} ( _wait, does it look like_ `classification task`🤫 _??_).

> Us ML researchers can design the architecture of the NN depends on **HOW** we want it to be implemented. Fully connected neural network (FCNN) for something super simple. If you **_REALLY_** want the `Actor` to take the gaming scene as `Input`, use convolutional neural network (CNN). If you want look through the game play _along the time line_, you can use RNN. `transformer`, evidently, is much better than RNN.

#### Define `Loss`

> `An Episode`: Total Reward (we want to `maximize`)

$$
\mathrm{Total \ Reward \ (return)}: R = \sum_{t=1}^T r_t
$$

Start w/ `observation` \\( s\_{1} \\) \\(\Rightarrow\\) take action \\(a_1: \text{\footnotesize{not move}} \\) \\(\Rightarrow\\) nothing happened \\(\Rightarrow\\) obtain `reward` \\(r_1\text{\footnotesize{=0}} \\) then

`observation` \\( s\_{2} \\) \\(\Rightarrow\\) take action \\(a_2: \text{\footnotesize{fire}} \\) \\(\Rightarrow\\) killed an alien \\(\Rightarrow\\) obtain `reward` \\(r_2\text{\footnotesize{=+5}} \\) then

`observation` \\( s\_{3} \\) ... many many turns ... \\(\Longrightarrow\\) till `Game Over` (Obtained reward \\(r_T\\) and took action \\(a_T\\)).

`Reward` is the _immediate_ feedback after _one_ action, `Return` is the _summation_ of rewards.

#### Optimization

As mentioned before, `Env` interacts with `Actor`, we can use some short `LATEX` representation to represent "\\(\overbrace{\underbrace{\text{\footnotesize{Env}}}\_{s_2 \nearrow}}^{\searrow a_1} \Rrightarrow\\)" (action 1 interact with the `environment` to yield observation 2).

So as "\\( \overbrace{\underbrace{\text{\footnotesize{Actor}}}\_{a_2 \nearrow}}^{\searrow s_2} \Rrightarrow\\)" (the `actor` takes observation 2 and yields action 2).

- The s,a sequence is called `Trajectory` \\(\tau\\) can be noted as {\\( s_1, a_1, s_2, a_2, ... \ \\)}
- Machine gets `reward` ( \\(r*T\\), actually a \_function*), typically depends on \\(s_T, a_T\\).

There are some challenges:
`Actor` is a network, `env` and `reward` are black boxes, **some of the processes / results** are **stochastic / nondeterministic** ------ Can **_NOT_** be solved like a standard _optimization_ problem.

> Think about GAN (generative adversarial networks), some analogy in this. `Actor` is similar to `generator`, `env` and `reward` has some resemblance to`discriminator` (but NOT a network).
