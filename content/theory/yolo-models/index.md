---
title: "YOLO and object detection"
description: "The YOLO (You Only Look Once) series of fast object detection models has seen significant improvements from YOLOv1 and beyond"
date: 2024-05-15
showAuthor: false
seriesOpened: true
showTableOfContents: true
showHero: true
heroStyle: background
---

{{< katex >}}

> The YOLO series of object detectors prioritizes speed and simplicity by framing object detection as a single regression problem. A single neural network directly predicts bounding boxes and class probabilities from the full image.

## YOLOv1

`YOLOv1`, in _[the article](https://arxiv.org/abs/1506.02640)_ `You Only Look Once`: Unified, Real-Time Object Detection, reframes the object detection problem into a single regression task. _Unlike_ previous methods that _merely_ repurposed classifiers for detection, YOLOv1 uses a single neural network (NN) to directly predict both the `bounding box` and the corresponding `class probability` from an _entire_ image over a **single** evaluation.

Most other methods before YOLO typically typically do the following (can be complex, slow, and difficult to optimize due to multi-stage pipelines):

1. Generate potential bounding boxes.
2. Classify objects within those boxes.
3. Refine the bounding boxes through some post-processing.

YOLOv1 stands out by offering

- **A Unified Model**: Single network handles bounding box prediction and class probability estimation.
- **A Regression-Based Approach**: Object detection is re-imagined as a regression problem by directly working on image pixels.
- **End-to-End Optimization**: The entire network is trained jointly. (For detection performance).
- **Real-Time Speed**: YOLOv1 achieves real-time object detection. (Applications like video processing).

**YOLOv1**, designed for speed and efficiency, processes images at 45 frames per second (fps). Its smaller version, Fast YOLO, processes images at 155 fps, achieving double the mean average precision (mAP) of _other_ real-time detectors.
