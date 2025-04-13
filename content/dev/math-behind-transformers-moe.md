---
title: "Math Foundations of Transformers and MoE Layers"
description: "A thorough explanation of the equations powering classic transformer structures and Mixture-of-Experts for advanced deep learning workflows."
date: 2025-04-13
tags: [
  "transformers",
  "moe",
  "mixture-of-experts",
  "machine-learning",
  "deep-learning",
  "neural-networks",
  "model-architecture",
  "computational-math",
  "transformer-layers"
]
showAuthor: true
showTableOfContents: true
showHero: false
category: "ai-systems-engineering"
---

# Transformer Architecture In LLMs

## Traditional Transformer
> The `Transformer` architecture consists of stacked `encoder` and `decoder` layers, each containing **two** main sub-layers: the `multi-head attention` mechanism and t`he position-wise feed-forward network` (FFN).

### Basics
**Multi-Head Attention Mechanism**: The attention mechanism allows the model to focus on different parts of the input sequence when generating each element of the output sequence.

**Scaled Dot-Product Attention**: The core attention mechanism in Transformers is the scaled dot-product attention, which is defined as:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Where for a single attention head with input sequence X ∈ ℝ^(n×d):

- **$Q$ (Query)** = $XW_q$ ∈ $ℝ^{(n×d_k)}$
- **$K$ (Key)** = $XW_k$ ∈ $ℝ^{(n×d_k)}$
- **$V$ (Value)** = $XW_v$ ∈ $ℝ^{(n×d_v)}$
- **$W_q$, $W_k$** ∈ $ℝ^{(d×d_k)}$ and **$W_v$** ∈ $ℝ^{(d×d_v)}$ are learnable parameter matrices
- **$d_k$** is the dimension of the key vectors
- **$n$** is the sequence length
- **$d$** is the model dimension (embedding dimension)

The computation flow is:

1. Matrix multiplication $QK^T$ produces a matrix ∈ $ℝ^{(n×n)}$
2. Division by $\sqrt{d_k}$ scales the dot products to have appropriate variance
3. Softmax normalizes each row to sum to 1, giving an attention weight matrix ∈ $ℝ^{(n×n)}$
4. Multiplying by $V$ gives weighted values ∈ $ℝ^{(n×d_v)}$

**Multi-Head Attention**: The Transformer uses multiple attention heads in parallel, which allows the model to jointly attend to information from different representation subspaces:

$$\text{MultiHead}(X) = \text{Concat}(\text{head}_1, \text{head}_2, ..., \text{head}_h)W^O$$
$$\text{where head}_i = \text{Attention}(XW^Q_i, XW^K_i, XW^V_i)$$

With the following dimensions:
- **$h$** is the number of attention heads (typically 8 in the original paper)
- **$W^Q_i$, $W^K_i$** ∈ $ℝ^{(d×d_k)}$, **$W^V_i$** ∈ $ℝ^{(d×d_v)}$ where $d_k$ = $d_v$ = $d/h$
- **$W^O$** ∈ $ℝ^{(hd_v×d)}$ is the output projection matrix
- Each **$head_i$** ∈ $ℝ^{(n×d_v)}$
- **Concat($head_1$, ..., $head_h$)** ∈ $ℝ^{(n×hd_v)}$
- Final output ∈ $ℝ^{(n×d)}$

For instance, in the smallest `GPT-2` model:
- Model dimension d = 768
- Number of heads h = 12
- Head dimension $d_k$ = $d_v$ = 64 (768/12)
- Output projection matrix $W^O$ ∈ $ℝ^{(768×768)}$

**Position-wise Feed-Forward Network (FFN)**: After the attention mechanism, each position in the sequence is processed independently through the FFN:

$$\text{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2$$

Where for each position x ∈ $ℝ^d$:
- **$W_1$** ∈ $ℝ^{(d×d_{ff})}$ is the weight matrix for the first linear transformation
- **$b_1$** ∈ $ℝ^{(d_{ff})}$ is the bias vector for the first linear transformation
- **$W_2$** ∈ $ℝ^{(d_{ff}×d)}$ is the weight matrix for the second linear transformation
- **$b_2$** ∈ $ℝ^d$ is the bias vector for the second linear transformation
- **$d_{ff}$** is the inner-layer dimensionality (typically 2048 or 4d)

For the entire sequence X ∈ ℝ^(n×d):
- Input to FFN ∈ ℝ^(n×d)
- After first linear transformation ∈ ℝ^(n×d_ff)
- After activation function ∈ ℝ^(n×d_ff)
- Output after second linear transformation ∈ ℝ^(n×d)

Some implementations use GELU instead of ReLU as the activation function:

$$\text{FFN}(x) = \text{GELU}(xW_1 + b_1)W_2 + b_2$$

The FFN can be viewed as **two convolutions** with kernel size 1 and is applied identically to each position, but with different parameters from layer to layer 

**Layer Normalization and Residual Connections**

Each sub-layer (attention and FFN) in the Transformer includes a residual connection followed by layer normalization:

$$X' = \text{LayerNorm}(X + \text{MultiHead}(X))$$
$$Z = \text{LayerNorm}(X' + \text{FFN}(X'))$$

Where X, X', Z ∈ ℝ^(n×d)

**Complete Transformer Layer**

Putting it all together, a single Transformer layer processes an input X ∈ ℝ^(n×d) through:
1. Multi-head attention: X → X' ∈ ℝ^(n×d)
2. Layer normalization and residual connection: X, X' → X'' ∈ ℝ^(n×d)
3. Feed-forward network: X'' → X''' ∈ ℝ^(n×d)
4. Layer normalization and residual connection: X'', X''' → output ∈ ℝ^(n×d)

