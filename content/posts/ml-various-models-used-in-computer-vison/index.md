---
title: "An in-Depth Look at Leading Computer Vision ML Models"
description: "Discover top computer vision algorithms and techniques in machine learning, with thorough explanations and ongoing updates."
date: 2024-07-20
# series: ["Image Generation"]
# series_order: 1
showAuthor: false
seriesOpened: true
showTableOfContents: true
showHero: true
heroStyle: background
categories: "machine learning theory"
tags: ["computer vision", "machine learning", "machine learning models"]
slug: "an-in-depth-look-at-leading-computer-vision-models"
---

# An in-Depth Look at Leading Computer Vision ML Models

As computer vision continues to evolve, understanding the various machine learning models driving this technology is crucial. We explore the most impactful models, highlighting key innovations.

## Stacked Hourglass Networks

Stacked Hourglass Networks are introduced by Newell et al. in [Stacked Hourglass Networks for Human Pose Estimation](https://arxiv.org/pdf/1603.06937v2)

![Featured-img-stacked-hourgless](https://production-media.paperswithcode.com/methods/Screen_Shot_2020-06-23_at_12.49.50_PM.png)

## DeepPose

The DeepPose paper [DeepPose: Human Pose Estimation via Deep Neural Networks](https://ar5iv.labs.arxiv.org/html/1312.4659), published by Google researchers at **_CVPR_** (`Conference on Computer Vision and Pattern Recognition`) in 2014. DeepPose was a pioneering approach at that time to _human pose estimation_ using Deep Neural Networks (DNNs).

> The core idea of the paper is to frame pose estimation as a DNN-based regression problem, predicting the coordinates of body joints `directly` from images (instead of treating it like a **_traditional_** classification methods)

{{< figure
    src="https://ar5iv.labs.arxiv.org/html/1312.4659/assets/x1.png"
    alt="Abstract purple artwork"
    caption="*Figure 2* from the [DeepPose]() paper [Jr Korpa](https://ar5iv.labs.arxiv.org/html/1312.4659)">}}

The method proposed a cascade of DNN regressors to _iteratively_ refine pose predictions, starting with a _rough estimate_ and improving it through _successive stages_.

## LLaVA, Large Language and Vision Assistant

As a GPT-V alternative, researchers _(Haotian Liu, Chunyuan Li , Qingyang Wu and Yong Jae Lee)_ used Language-only GPT-4 to generate _multimodal_ language-image instruction-following data. By instruction tuning on such generated data, we introduce LLaVA

## Feature Pyramid Network (FPN)

{{< figure
    src="https://production-media.paperswithcode.com/methods/new_teaser_TMZlD2J.jpg"
    alt="Abstract purple artwork"
    caption="*Figure 1* from the original paper [by Belongie2 et al.](https://arxiv.org/pdf/1612.03144v2). (a) - (c) are older methods. **(a)** uses an image pyramid to build a feature pyramid (image at different scales). Features are computed (via CNN) on each of the image scales independently, which is slow. **(b)** single scale feature (like a VGG16), losing critical info. **(c)** is like sampling over CNN **(d)** FPN shares similarity between b and c, but multiple features at different scales got combined -- features goes through some down-sampling and provide some *feedbacks*, like BLSTM" >}}

FPN is used in a lot of further development including faster R-CNN, Mask R-CNN, Single-Shot Detector (SSD), YOLO

{{< figure
    src="https://ar5iv.labs.arxiv.org/html/1612.03144/assets/x3.png"          caption= "Prediction were made on every single layer. 1 x 1 convolution used to change channel dimensions, *and* some up-sampling method, Nearest Interpolation, Bilinear Interpolation, Bicubic Interpolation, etc.">}}

### Pyramid Vision Transformer (PVT)

PVT, or Pyramid Vision Transformer, was introduced in [Pyramid Vision Transformer: A Versatile Backbone for Dense Prediction without Convolutions](https://arxiv.org/pdf/2102.12122v2) at `ICCV` 2021

{{< figure
    src="https://pbs.twimg.com/media/EvCVJPYUYAMg0mJ?format=jpg&name=large"
    alt="PVT abstract graph"
    caption="Multi-scale feature fusion in space, putting ideas from CNN into ViT, from (a) to (c)." >}}

## Detection Transformer(DETR)

DETR, introduced in [End-to-End Object Detection with Transformers](https://ar5iv.labs.arxiv.org/html/2005.12872v3) is a set-based object detector using a transformer on top of a convolutional backbone

{{< figure
    src="https://ar5iv.labs.arxiv.org/html/2005.12872/assets/x2.png"
    caption="FFN is feed forward network">}}

### DETR with Improved deNoising anchOr boxes (DINO)

DINO is a state-of-the-art end-to-end object detector, using a contrastive way for denoising training.

{{< katex >}}

{{< gallery >}}
<img src="https://ar5iv.labs.arxiv.org/html/2203.03605/assets/images/ap_r50_alllllll.png" class="grid-w33" />
<img src="https://ar5iv.labs.arxiv.org/html/2203.03605/assets/x1.png" class="grid-w33" />
{{< /gallery >}}

DINO achieves higher AP (Average Precision, `true positives` / `true positives + false positives`, higher the better) under less epochs while having a smaller model size, ICLR 2023.

{{< gallery >}}
<img src="https://ar5iv.labs.arxiv.org/html/2203.03605/assets/x2.png" class="grid-w33" />
<img src="https://ar5iv.labs.arxiv.org/html/2203.03605/assets/x3.png" class="grid-w33" />
{{< /gallery >}}

Unlike `DETR`, which takes the _largest_ feature map for subsequent work, DINO takes feature maps from various scales. A `positional embedding` is used to help the transformer. Its `Contrastive DeNoising (CDN)` training section (ground true, GT + noise) is different from DETR, containing `group0` and `group1`

- Both groups contains `positive queries` and `negative queries`.
- \\(\lambda\_{1}\\) and \\(\lambda\_{2}\\) adjusts how object stands out from the background (the size), adjusting the noise level.
- `CDN group0` has lower noise background, hoping to learn the `ground truth boxes`.
- `CDN group1` has higher noise, hoping to learn `no object`.

{{< gallery >}}
<img src="https://ar5iv.labs.arxiv.org/html/2203.03605/assets/x7.png"
class="grid-w33"/>
<img src="https://ar5iv.labs.arxiv.org/html/2203.03605/assets/x8.png" class="grid-w33" />
<img src="https://ar5iv.labs.arxiv.org/html/2203.03605/assets/images/convergence_comp_eccv2.png" class="grid-w33" />
{{< /gallery >}}

DINO uses `mixed query selection`. Also `look forward twice` (adding more connection for back-propagation), achieving great performance (DINO is around 500 epochs)
