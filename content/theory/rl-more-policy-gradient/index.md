---
title: "More on Policy Gradient"
description: "Off-policy algorithms leverage past experiences, while Proximal Policy Optimization (PPO) and Trust Region Policy Optimization (TRPO) offer advanced strategies for stable policy evolution in reinforcement learning."
date: 2023-09-10
series: ["Deep Reinforcement Learning"]
series_order: 3
showAuthor: false
seriesOpened: true
showTableOfContents : true
showHero: true
heroStyle: background
---

Venturing into the realms of reinforcement learning, Off-policy algorithms open doors to learning from past experiences, while Proximal Policy Optimization (PPO) and Trust Region Policy Optimization (TRPO) present sophisticated techniques to ensure stable policy updates. These methods, while distinct, represent pivotal advancements in efficiently navigating complex environments with enhanced stability.

{{< katex >}}

## On-policy v.s. Off-policy

- On-policy: The `agent` ( or `actor`) learned and the `actor` interacting with the `environment` is the ***same***.
- Off-policy: The `actor` learned and the `actor` interacting with the `environment` is ***different***.

> Previous section is `on-policy`

$$
E _{\tau \sim p _{\theta}(\tau)}[R(\tau) \nabla log p_θ(\tau) ]
$$

- Use \\(\pi_{\theta}\\) to collect data, when \\(\theta\\) is updated, we have to sample training data again.
- The goal is to use samples from \\(\pi_{\theta'}\\) to train \\(\theta\\), which means reusing \\(\theta'\\) (or sample data).

### Importance Sampling

\\( E _{x \sim p} [f(x)] \approx 1/N \sum ^N _{i=1} f(x^i) \\) 
- \\( E _{x \sim p} [f(x)] \\) means given a function \\(f(x)\\), calculate the expected value \\(f(x)\\) of sampling x from distribution p
- \\(x^i\\) is sampled from \\(p(x)\\).
- But we can not sample from \\(p(x)\\), we only have samples from \\(q (x)\\) (this is the *catch*)

$$
\int f(x)p(x)dx = \int f(x) \frac{p(x)}{q(x)}q(x)dx \\\
= E _{x \sim q}[f(x) \frac{p(x)}{q(x)}]
$$

### Issues of Importance Sampling

To calculate variance, \\( \mathrm{VAR[X]} = \mathrm{E[X^2]} - \mathrm{E[X]}^2 \\).

\\( \mathrm{Var} _{x \sim p} \not = \mathrm{Var} _{x \sim q} \\), r.v. with the same **mean** does *not* guarantee same **variance**.

> Derivation may be updated in the future, but the difference between \\( \mathrm{Var} _{x \sim p}, \mathrm{Var} _{x \sim q} \\) is the term "p(x)/q(x)" ---> take home message: have to sample enough points

### On-policy to Off-policy

We use a newer policy (another `actor` with \\(\theta'\\) that takes care of interaction with `environment`).

$$
\nabla \bar{R}_θ = E _{ \tau \sim p _{\theta'}(\tau)}[ \frac{p _{\theta}(\tau)}{p _{\theta'}(\tau)} R(\tau) \nabla log p_θ(\tau) ]
$$

$$
\nabla \bar{R}_θ = \frac{1}{N}\sum _{n=1}^{N} \sum _{t=1}^{T_n} R(\tau^n) \nabla log \ p_θ(a_t^n | s_t^n)
$$

{{< alert icon="lock" cardColor="#FF8B28" iconColor="#0096FF" textColor="#f1faee" >}}
A lot of math warning... Therefore TL;DR, will implement in the future.
{{< /alert >}}

$$
J^{\theta'}(\theta) =  E _{(s_t, a_t) \sim \pi _{\theta'}} 
[\frac{p _{\theta}(a_t|s_t)}{p _{\theta'}(a_t|s_t)}A^{\theta'}(s_t, a_t)]
$$

## PPO and TRPO

### Proximal Policy Optimization (PPO)

$$
J^{\theta'} _{PPO}(\theta) = J^{\theta'} _{PPO}(\theta) - \beta KL(\theta, \theta')
$$

> Add constraints, wanting \\(\theta\\) to be similar to \\(\theta^{\prime}\\) --- the `behavior` from the `actor` to be similar (**not** the parameter differences).

### PPO Algorithm

- Initial policy parameters \\(\theta^0\\).
- Then within each iteration
  - Use \\(\theta^k\\) to interact with `env` and collect a lot of data ( \\( \lbrace s_t, a_t \rbrace \\) ), compute `advantage`.
  - Find \\(\theta^0\\) that optimizes \\( J _{PPO}(\theta) \\)

#### PPO2

$$
J^{\theta^k} _{PPO2}(\theta) \approx \sum _{(s_t, a_t)} min( \frac{p _{\theta}(a_t|s_t)}{p _{\theta^k}(a_t|s_t)}A^{\theta^k}(s_t, a_t), \\\
clip(\frac{p _{\theta}(a_t|s_t)}{p _{\theta^k}(a_t|s_t)}, 1-\epsilon, 1+\epsilon)A^{\theta^k}(s_t, a_t))
$$

\\(\epsilon\\) is a hyperparameter.

### Trust Regin Policy Optimization (TRPO)

$$
J^{\theta'} _{TRPO}(\theta) = E _{(s_t, a_t) \sim \pi _{\theta'}} 
[\frac{p _{\theta}(a_t|s_t)}{p _{\theta'}(a_t|s_t)}A^{\theta'}(s_t, a_t)]
$$

With some KL constraints \\( KL(\theta, \theta') < \delta \\) 

\\(\\)