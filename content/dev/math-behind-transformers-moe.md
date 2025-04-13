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

{{< katex >}}

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

**Layer Normalization and Residual Connections**: Each sub-layer (attention and FFN) in the Transformer includes a residual connection followed by layer normalization:

$$X' = \text{LayerNorm}(X + \text{MultiHead}(X))$$
$$Z = \text{LayerNorm}(X' + \text{FFN}(X'))$$

Where X, X', Z ∈ ℝ^(n×d)

**Complete Transformer Layer**: A `single Transformer layer` processes an input X ∈ ℝ^(n×d) through:
1. Multi-head attention: X → X' ∈ ℝ^(n×d)
2. Layer normalization and residual connection: X, X' → X'' ∈ ℝ^(n×d)
3. Feed-forward network: X'' → X''' ∈ ℝ^(n×d)
4. Layer normalization and residual connection: X'', X''' → output ∈ ℝ^(n×d)

### Stacked Encoder-Decoder

The Transformer architecture consists of a stack of encoder layers and a stack of decoder layers working in tandem to transform an input sequence into an output sequence. This design enables the model to capture complex patterns and dependencies across sequences of varying lengths. Let's explore the mathematical formulations that govern these stacked components.

#### Encoder Stack

The encoder transforms an input sequence into a continuous representation that captures its semantic content. This representation is then used by the decoder to generate the output sequence.

Input Processing

For an input sequence of tokens $$w_1, w_2, \ldots, w_n$$, we first convert each token to an embedding vector. If we denote the embedding function as $$E$$, the initial representation becomes:

$$X^0 = \begin{bmatrix} E(w_1) \\ E(w_2) \\ \vdots \\ E(w_n) \end{bmatrix} \in \mathbb{R}^{n \times d}$$

Since Transformers don't have a built-in notion of token order, we add positional encodings to these embeddings. The positional encoding for position $$pos$$ and dimension $$i$$ is defined as:

$$PE_{(pos,2i)} = \sin\left(\frac{pos}{10000^{2i/d}}\right)$$
$$PE_{(pos,2i+1)} = \cos\left(\frac{pos}{10000^{2i/d}}\right)$$

These positional encodings are added to the token embeddings to form the actual input to the encoder:

$$X^{0}_{pos} = E(w_{pos}) + PE_{pos} \in \mathbb{R}^{d}$$

The complete input matrix becomes $$X^0 \in \mathbb{R}^{n \times d}$$ where each row incorporates both token and positional information.

Encoder Layer Computation

Each encoder layer $$l$$ (where $$l \in \{1, 2, \ldots, L_{enc}\}$$) processes its input $$X^{l-1}$$ through two main sub-layers: multi-head self-attention and a feed-forward network. The mathematical formulation for the $$l$$-th encoder layer is:

$$X^{l}_{\text{att}} = \text{MultiHead}(X^{l-1}, X^{l-1}, X^{l-1})$$
$$X^{l}_{\text{mid}} = \text{LayerNorm}(X^{l-1} + X^{l}_{\text{att}})$$
$$X^{l}_{\text{ffn}} = \text{FFN}(X^{l}_{\text{mid}})$$
$$X^{l} = \text{LayerNorm}(X^{l}_{\text{mid}} + X^{l}_{\text{ffn}})$$

The multi-head attention in the encoder allows each position to attend to all positions in the previous layer. For the $$l$$-th layer, this computation involves using the output of the previous layer $$X^{l-1}$$ as the queries, keys, and values for the self-attention mechanism.

Stacked Encoder

The encoder comprises $$L_{enc}$$ identical layers stacked on top of each other. Each layer processes the output of the previous layer, creating increasingly abstract representations of the input sequence. The final output of the encoder stack, $$X^{L_{enc}} \in \mathbb{R}^{n \times d}$$, serves as the key and value for the cross-attention mechanism in the decoder.

The transformation through the encoder stack can be represented recursively as:

$$X^{l} = \text{EncoderLayer}_l(X^{l-1})$$

Where $$X^0$$ is the input embedding plus positional encoding, and $$X^{L_{enc}}$$ is the final encoder output.

#### Decoder Stack

The decoder generates the output sequence element by element, using both the encoder's output and the previously generated elements.

Decoder Input and Masking

For auto-regressive generation, the decoder takes as input the previously generated sequence. During training, this is the target sequence shifted right by one position and prepended with a start token. Like the encoder, these tokens are embedded and combined with positional encodings:

$$Y^0 = \begin{bmatrix} E(y_0) + PE_0 \\ E(y_1) + PE_1 \\ \vdots \\ E(y_{m-1}) + PE_{m-1} \end{bmatrix} \in \mathbb{R}^{m \times d}$$

Where $$y_0$$ is the start token, and $$m$$ is the length of the output sequence.

Decoder Layer Computation

Each decoder layer $$l$$ (where $$l \in \{1, 2, \ldots, L_{dec}\}$$) consists of three sub-layers: masked multi-head self-attention, cross-attention with the encoder output, and a feed-forward network. The mathematical formulation for the $$l$$-th decoder layer is:

$$Y^{l}_{\text{self-att}} = \text{MaskedMultiHead}(Y^{l-1}, Y^{l-1}, Y^{l-1})$$
$$Y^{l}_{\text{mid1}} = \text{LayerNorm}(Y^{l-1} + Y^{l}_{\text{self-att}})$$
$$Y^{l}_{\text{cross-att}} = \text{MultiHead}(Y^{l}_{\text{mid1}}, X^{L_{enc}}, X^{L_{enc}})$$
$$Y^{l}_{\text{mid2}} = \text{LayerNorm}(Y^{l}_{\text{mid1}} + Y^{l}_{\text{cross-att}})$$
$$Y^{l}_{\text{ffn}} = \text{FFN}(Y^{l}_{\text{mid2}})$$
$$Y^{l} = \text{LayerNorm}(Y^{l}_{\text{mid2}} + Y^{l}_{\text{ffn}})$$

The masked multi-head attention employs a lower triangular mask to ensure that when predicting the token at position $$i$$, the model can only use information from positions $$< i$$. This is implemented by applying a mask $$M$$ to the attention weights:

$$M_{ij} = \begin{cases} 0 & \text{if } i \geq j \\ -\infty & \text{otherwise} \end{cases}$$

The attention scores then become:

$$\text{MaskedAttention}(Q, K, V) = \text{softmax}\left(\frac{QK^T + M}{\sqrt{d_k}}\right)V$$

The cross-attention mechanism allows the decoder to focus on relevant parts of the input sequence. In this sub-layer, the queries come from the decoder's previous sub-layer, while the keys and values come from the encoder's output.

Stacked Decoder

Similar to the encoder, the decoder consists of $$L_{dec}$$ identical layers stacked on top of each other. The transformation through the decoder stack can be represented recursively as:

$$Y^{l} = \text{DecoderLayer}_l(Y^{l-1}, X^{L_{enc}})$$

Where $$Y^0$$ is the shifted target sequence embedding plus positional encoding, and $$Y^{L_{dec}} \in \mathbb{R}^{m \times d}$$ is the final decoder output.

#### Final Output Layer

The final decoder output is transformed into probabilities over the vocabulary through a linear projection followed by a softmax function:

$$P(y_i | y_{<i}, X) = \text{softmax}(Y^{L_{dec}}_i W_{\text{out}} + b_{\text{out}})$$

Where $$W_{\text{out}} \in \mathbb{R}^{d \times |V|}$$ and $$b_{\text{out}} \in \mathbb{R}^{|V|}$$ are the output projection parameters, and $$|V|$$ is the vocabulary size.

#### Information Flow in the Encoder-Decoder Architecture

The encoder processes the entire input sequence in parallel, creating a rich contextual representation for each token. These representations capture the relationships between tokens regardless of their positions in the sequence. The decoder then uses these representations through the cross-attention mechanism, along with its own self-attention over previously generated tokens, to produce the output sequence one token at a time.

This architecture creates a powerful information flow: the encoder builds a comprehensive representation of the input, and the decoder extracts relevant information from this representation while maintaining coherence in its outputs through self-attention. The stacked nature of both components allows the model to capture increasingly complex patterns and dependencies, leading to high-quality sequence-to-sequence transformations.


