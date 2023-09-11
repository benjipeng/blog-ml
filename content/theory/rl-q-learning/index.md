---
title: "Q-learning"
description: "Q-learning is a reinforcement learning technique where an agent iteratively learns the value of its actions to navigate towards optimal outcomes in an environment."
date: 2023-09-10
series: ["Deep Reinforcement Learning"]
series_order: 4
showAuthor: false
seriesOpened: true
showTableOfContents : true
showHero: true
heroStyle: background
---

{{< katex >}}

Q-learning, a cornerstone of reinforcement learning, is the quest of an agent to master its environment by discerning the quality of its actions. Through iterative experiences, the agent constructs a map of rewards, forging paths to optimal outcomes.

## Critic

- A `critic` does not directly determine the action.
- Given an actor \\(\pi\\), it evaluates how good \\(\pi\\) is.
- There is an `actor` called state value function \\(V^{\pi}(s)\\)
  - When using \\(\pi\\) (to interact with `env`), the *cumulated* reward is expected after visiting state \\( s \\).

> It literally just make a prediction. Having \\( V^{\pi} \\) to look into the state \\( s \\), then yields a `scalar`, \\(V^{\pi}(s)\\).

Output of a critic depends on the evaluated actor.

### Another Critic

- State-action value function \\( Q ^{\pi}(s, a)\\)
  - When using actor \\( \pi \\), the cumulated reward is assessed after taking action a at state s

\\(\\)

Policy \\(\pi\\) is a network with parameter \\(\theta\\).
- **Input**: the observation of machine represented as a vector or a matrix.
- **Output**: each action corresponds to a neuron in output layer.

From the previous article, **Trajectory** \\(\tau =  \\{ s_1, a_1, s_2, a_2, ..., s_T, a_T \\} \\). For every trajectory, its probability can be calculated ( given the parameters \\(\theta\\) of the `actor` ): 

$$
p_{\theta}(\tau) = p(s_1)p_{\theta}(a_1|s_1)p(s_2|s_1, a_1)p_{\theta}(a_2|s_2)p(s_3|s_2,a_2)...
$$

$$
= p(s_1)\prod_{t=1}^{T}p_{\theta}(a_t|s_t)p(s_{t+1}|s_t, a_t)
$$

> \\(p(s_t)\\) depends on the behavior of the `environment`, which can NOT be controlled. 

Also, there is `reward` \\(r_t\\), \\(R(\tau)=\sum^T_{t=1}r_t\\)

The ***objective*** is to adjust \\(\theta\\) to **maximize** \\(R(\tau)\\). However, `reward` is a random variable (r.v.), due to the stochasticity of `actor` and `environment` (`actor` at a given state \\(s\\) gives some random action \\(a\\), and so is `environment`). `Expected Reward` is calculated. 

$$
\bar{R}_θ = \sum_τ R(\tau)p_θ(\tau) = E _{\tau \sim p _{\theta}(\tau)}[R(\tau)]
$$

## Policy Gradient

\\(\bar{R}_θ = \sum_τ R(\tau)p_θ(\tau)\\), \\(\nabla \bar{R}_θ = \ ?\\)

$$
\nabla \bar{R}_θ = \sum_τ R(\tau)\nabla p_θ(\tau)
$$

\\(R(\tau)\\) do not have to be differentiable, can even be a blackbox (Similar to GAN 🧐)

$$
\nabla \bar{R}_θ = \sum_τ R(\tau) p _{\theta}(\tau) \frac{\nabla p_θ(\tau)}{p _{\theta}(\tau)} \\\
= \sum_τ R(\tau) p _{\theta}(\tau) \nabla log p_θ(\tau) \\\
= E _{\tau \sim p _{\theta}(\tau)}[R(\tau) \nabla log p_θ(\tau) ]
\approx \frac{1}{N}\sum _{n=1}^{N} R(\tau^n) \nabla log p_θ(\tau^n)
$$

$$
\frac{1}{N}\sum _{n=1}^{N} \sum _{t=1}^{T_n} R(\tau^n) \nabla log p_θ(a_t^n | s_t^n)
$$

> Note: \\(\nabla f(x) = f(x)\nabla log f(x)\\) (logarithmic derivative). `env` component in \\(p _{\theta}(\tau)\\) is not related to \\(\theta\\), therefore only do gradient \\( \nabla \\) on \\( log p_θ(a_t^n | s_t^n) \\). 

> Intuitively, among ALL sampled data, at a certain state \\( s_t \\) an action \\(a_t\\) is to be executed (\\((a_t | s_t)\\) is SOME `state` and `action` pair within the trajectory) results in the trajectory \\(\tau\\). if certain \\((a_t | s_t)\\) pair results in some positive reward in the trajectory, then increase the likelihood of the pair and vice versa.

### More Math

$$
\theta \leftarrow \theta + \eta \nabla \bar{R}_θ 
$$

$$
\nabla \bar{R}_θ = \frac{1}{N}\sum _{n=1}^{N} \sum _{t=1}^{T_n} R(\tau^n) \nabla log \ p_θ(a_t^n | s_t^n)
$$

Cycles of data collection and model updates --- `Policy` is noted as \\(\pi_{\theta}\\) (using existing  agent \\(\theta\\) to interact with the environment)

Using game as an example, in game play one \\(\tau^1\\), going through \\((a_1^1 | s_1^1)\\), \\((a_1^2 | s_1^2)\\), ... results in \\(R(\tau^1)\\), then for game play two \\(\tau^2\\) (just change the superscript), etc. Using those data collected to calculate \\(\nabla \bar{R}_θ\\) 

> Essentially, plug in ALL the \\((s|a)\\) pairs to calculate its `log probability`, get the `gradient`, then multiply by a weight, which is the reward that is collected from a game play. 

## Extra Tips

### Add a Baseline

- \\(\theta \leftarrow \theta + \eta \nabla \bar{R}_θ \\), its *possible* that \\( R (\tau^n)\\) is *always* ***positive***.
- \\(\nabla \bar{R}_θ \approx \frac{1}{N}\sum _{n=1}^{N} \sum _{t=1}^{T_n} R(\tau^n) \nabla log \ p_θ(a_t^n | s_t^n)\\), according to the equation (and `explanation` in the previous section), likelihood of \\( p_θ(a_t^n | s_t^n) \\) shall increase if it provides a positive \\( R(\tau)\\)

Due to the nature of sampling (*ONLY* some \\( (a_t^n | s_t^n) \\) pair can be sampled, therefore the probability of the un-sampled actions will decrease), a baseline term \\( b \approx E[R(\tau)] \\) can be used.

$$
\nabla \bar{R}_θ \approx \frac{1}{N}\sum _{n=1}^{N} \sum _{t=1}^{T_n} [R(\tau^n) - b]\nabla log \ p_θ(a_t^n | s_t^n)
$$

### Assign Suitable Credit

> Instead of calculate the sum of rewards in the ENTIRE \\(\tau\\), it is BETTER to obtain the sum of rewards `after a certain action performed`

Use \\(\sum^{T_n} _{t'=t} r^n _{t^{\prime}}\\) represent the sum of rewards from time \\(t\\) (where the action was performed) till the end of the game.

We can even take one step further by adding a discount factor for rewards on more future rewards on the current action \\(\gamma \lt 1 \\), yields \\(\sum^{T_n} _{t'=t} \gamma^{t'-t}r^n _{t^{\prime}}\\). It is *reasonable* because rewards collected not too long after an action should be weight MORE than later rewards.

### Advantage Function

Eventually, \\(R(\tau^n)-b\\) becomes \\( A^{\theta}(s_t, a_t)\\). 

It measures how good it is if we take \\( a_t \\) other than other actions at \\( s_t \\). \\( \theta \\) indicates the nature that it goes through a network.

\\(\\)



