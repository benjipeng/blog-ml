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

### Unified Detection in YOLOv1

Researcher in YOLOv1 paper unified the separate components of object detection into a single neural network. The network uses features from the entire image to predict each bounding box. It also predicts all bounding boxes across all classes for an image **_simultaneously_**. (The network reasons _globally_ about the full image and all the objects in the image)

![yolov1-fig1](imgs/yolov1-fig1.jpg)

YOLOv1 uses single NN:

It employs a single convolutional neural network (CNN) to process the entire image. This network `takes an input image and outputs a fixed-size grid of predictions`.

YOLOv1 does grid-based detection:

- The input image is divided into an 𝑆×𝑆 grid. Each grid cell is responsible for detecting objects whose center falls within the cell.
- For each grid cell, the model predicts a fixed number of bounding boxes (B). Each bounding box consists of:
  - Bounding Box Coordinates: (𝑥,𝑦,𝑤,ℎ)
    - (𝑥,𝑦) coordinates represent the center of the box relative to the bounds of the grid cell.
    - The 𝑤 and ℎ (width and height) are predicted relative to the whole image.
  - Confidence Score: Reflects how confident the model is that the box contains an object and also how accurate it thinks the box is that it predicts.
  - Class Probabilities (C): Each grid cell also predicts class probabilities for the object within the bounding box.

![yolov1-fig3](imgs/yolov1-fig3.jpg)

#### Definition of Confidence in YOLOv1

\\(\\)

confidence score for each predicted bounding box is defined as:

\\(Confidence=P(Object)×IOU(pred,truth)\\)

- \\(P(Object)\\) is the probability that an object is present in the bounding box.
- \\(\text{IOU}(\text{pred}, \text{truth})\\) is the Intersection over Union between the predicted bounding box and the ground truth bounding box.

Therefore, for a bounding box \\(i\\) in a grid cell \\(j\\) in the model, confidence is defined as:

\\(C\_ {ij} = P(\text{Object})\_{ij} \times \text{IOU}\_{ij}\\)

- \\(C\_ {ij}\\) represents the model’s certainty that an object exists in the bounding box, a value between 0 and 1.
- Intersection over Union (IoU) is a measure of how well the predicted bounding box overlaps with the ground truth bounding box.

#### YOLOv1 Loss Function Components

YOLOv1 uses a single loss function during training and contains three components:

![yolov1-loss](imgs/yolov1-loss.jpg)

- Localization Loss: Measures the error between the predicted bounding box coordinates and the ground truth coordinates.
- Confidence Loss: Measures the difference between the predicted confidence scores and the ground truth (1 for objects, 0 for no objects).
- Classification Loss: Measures the error in class prediction.
