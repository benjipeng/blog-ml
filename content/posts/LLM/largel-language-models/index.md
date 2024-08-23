---
title: "Understanding Key Insights and Trends in Large Language Models"
description: "Learn about how large language models (LLMs) has been made and evolved by looking into its key insights and trends"
date: 2024-08-15
# series: ["Image Generation"]
# series_order: 1
showAuthor: false
seriesOpened: true
showTableOfContents: true
showHero: true
heroStyle: background
categories: "machine learning theory"
tags: ["large language model", "machine learning", "machine learning models"]
url: "/understanding-key-insights-and-trends-in-large-language-models"
---

# Understanding Key Insights and Trends in Large Language Models

Large Language Models (LLMs) are revolutionizing natural language processing (NLP) by enabling machines to understand and generate human-like text _(or even beyond)_. In this article, we explore key LLMs, their capabilities, and their impact on various applications.

## Intro to LLMs

### General Language Model Pretraining with Autoregressive Blank Infilling (GLM)

From [ACL 2022-05](https://ar5iv.labs.arxiv.org/html/2103.10360v2)

{{<badge>}}@inproceedings{du2022glm,
title={GLM: General Language Model Pretraining with Autoregressive Blank Infilling},
author={Du, Zhengxiao and Qian, Yujie and Liu, Xiao and Ding, Ming and Qiu, Jiezhong and Yang, Zhilin and Tang, Jie},
booktitle={Proceedings of the 60th Annual Meeting of the Association for Computational Linguistics (Volume 1: Long Papers)},
pages={320--335},
year={2022}
}{{</badge>}}

## Chain-of-Thought (CoT) Prompting

By asking LLM to solve complex reasoning tasks in a step-wise manner, CoT enhances the reasoning abilities of Large Language Models (LLMs)

## Knowledge Distillation

Knowledge distillation, introduced in [Distilling the Knowledge in a Neural Network](https://arxiv.org/pdf/1503.02531v1), transfers knowledge from a large model to a smaller one (large models may have large capacity but not fully utilized).

![simple-knowledge-disllation](https://hkalabs.com/wp-content/uploads/2023/09/networkIllustrationS.png)

### Data-efficient Image Transformer (DeiT)

A DeiT is a type of Vision Transformer (ViT) for image classification tasks, by
token distillation via a teacher-student strategy on ImageNet (10M+). Work before that (ViT for classification uses a private labelled image dataset JFT-300M)
![performance-of-deit](https://ar5iv.labs.arxiv.org/html/2012.12877/assets/x1.png)
