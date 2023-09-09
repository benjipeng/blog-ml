---
title: "What is Deep Reinforcement Learning (RL)"
description: "Deep Reinforcement Learning (RL) combines deep learning techniques with reinforcement learning to enable agents to learn optimal strategies from large volumes of complex data"
date: 2023-09-09
series: ["Deep Reinforcement Learning"]
series_order: 1
showAuthor: false
seriesOpened: true
showTableOfContents : true
showHero: true
heroStyle: background
---

Deep Reinforcement Learning (RL) combines deep learning techniques with reinforcement learning to enable agents to learn optimal strategies from large volumes of complex data.
## Background

Reinforcement Learning (RL) is no stranger to anyone, there has been a lot of `trendy` applications like AlphaGo. This series of articles is aimed to provide the general audiences an overview on RL rather than diving in and showing them the ins and outs.

### Supervised Learning to RL

There are a lot of ML tasks are considered supervised learning:
- **An Image Classifier**: Let the machine know what the `Input` is *AND* the `Output` (that it is supposed to give), then train the model.
- **Self-supervised Learning**: Supervised learning *IN REALITY*, `Label`s can be generated *automatically*.
- **Auto-Encoder**: An *unsupervised* method (no human labeling), but in reality still has some `Label`s that do *NOT* require humans to generate.

RL, on the other hand, is quite *different* ------
You do *NOT* know the *BEST* `Output` when you give machine an `Input`:

You may attempt to use `supervised learning` methods if you would like to teach the machine to play go. Predict the *BEST* next move giving what is on the go board. You may also feed the model with records from previous matches. But there are *A LOT OF LIMITATIONS* (i.e. What is the *best* answer? How do I know the *correct* answer?).

> It is still challenging to label data in *SOME* tasks. The machines, thankfully, knows whether the results are good.
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
- `Action` has *impacts* on `Environment`.
- `Environment` provides a `Observation` to the `Actor`. 
- The cycle goes on and on.

So, `Actor` is just the *function* we are looking for. \\(\textbf{Action} = f(\textbf{Observation})\\).

During the interaction, the `Environment` continuously provides `Actor` with `Reward` (telling the `Actor` if the `Action` is good or not ). Therefore the `Actor` we are looking for (a.k.a the **function** *above*) *aims* to maximize the `Reward` combined from `Environment`.

{{< alert icon="fire" cardColor="#ff3926" iconColor="#aaaaff" textColor="#f1faee" >}}
Find a `policy` that *maximizes* the `TOTAL` reward
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

A.K.A `Actor` -> `Policy Network` (in the "*prehistoric*" era of RL, it could even be a *look-up table* 😳. now, of course, we do DNN).

- **Input of neural network (NN)**: the observation of machine represented as a `vector` or a `matrix`.
- **Out of NN**: each neuron in the **output layer** corresponds to one *individual* action, which is also have a *score* associated (via passing `input` through the NN). it will be something like {fire:0.5, left:0.3, right:0.2} ( *wait, does it look like* `classification task`🤫 *??*). 

> Us ML researchers can design the architecture of the NN depends on **HOW** we want it to be implemented. Fully connected neural network (FCNN) for something super simple. If you ***REALLY*** want the `Actor` to take the gaming scene as `Input`, use convolutional neural network (CNN). If you want look through the game play *along the time line*, you can use RNN. `transformer`, evidently, is much better than RNN.

#### Define `Loss`

>`An Episode`: Total Reward (we want to `maximize`)

$$
\mathrm{Total \ Reward \ (return)}: R = \sum_{t=1}^T r_t
$$

Start w/ `observation` \\( s_{1} \\) \\(\Rightarrow\\) take action \\(a_1: \text{\footnotesize{not move}} \\) \\(\Rightarrow\\) nothing happened \\(\Rightarrow\\) obtain `reward` \\(r_1\text{\footnotesize{=0}} \\) then

 `observation` \\( s_{2} \\) \\(\Rightarrow\\) take action \\(a_2: \text{\footnotesize{fire}} \\) \\(\Rightarrow\\) killed an alien \\(\Rightarrow\\)  obtain `reward` \\(r_2\text{\footnotesize{=+5}} \\) then

  `observation` \\( s_{3} \\) ... many many turns ... \\(\Longrightarrow\\) till `Game Over` (Obtained reward \\(r_T\\) and took action \\(a_T\\)).

`Reward` is the *immediate* feedback after *one* action, `Return` is the *summation* of rewards.

#### Optimization

As mentioned before, `Env` interacts with `Actor`, we can use some short `LATEX` representation to represent "\\(\overbrace{\underbrace{\text{\footnotesize{Env}}}_{s_2 \nearrow}}^{\searrow a_1} \Rrightarrow\\)" (action 1 interact with the `environment` to yield observation 2). 

So as "\\( \overbrace{\underbrace{\text{\footnotesize{Actor}}}_{a_2 \nearrow}}^{\searrow s_2} \Rrightarrow\\)" (the `actor` takes observation 2 and yields action 2).

- The s,a sequence is called `Trajectory` \\(\tau\\) can be noted as {\\( s_1, a_1, s_2, a_2, ... \ \\)}
- Machine gets `reward` ( \\(r_T\\), actually a *function*), typically depends on \\(s_T, a_T\\).

There are some challenges:
`Actor` is a network, `env` and `reward` are black boxes, **some of the processes / results** are **stochastic / nondeterministic** ------ Can ***NOT*** be solved like a standard *optimization* problem.

> Think about GAN (generative adversarial networks), some analogy in this. `Actor` is similar to `generator`, `env` and `reward` has some resemblance to`discriminator` (but NOT a network).
 


