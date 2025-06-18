# EcoCatalyst ML Package

## Overview
This package contains TensorFlow Lite models and scripts for the EcoCatalyst application. The models are used for various features including product sustainability scanning, object recognition, and diet recommendation.

## Structure
- **models/**: TensorFlow Lite models
- **scripts/**: Training and processing scripts
- **data/**: Training and test data

## Models
The following models will be developed:

### 1. Product Recognition Model
- Purpose: Identify products from images
- Input: Camera image
- Output: Product identification with confidence score
- Architecture: MobileNetV2 or EfficientNet

### 2. Barcode Scanner Model
- Purpose: Detect and decode barcodes
- Input: Camera image
- Output: Barcode value
- Architecture: Custom CNN

### 3. Sustainability Scoring Model
- Purpose: Assess product sustainability
- Input: Product features
- Output: Sustainability score
- Architecture: Gradient Boosting or Neural Network

### 4. Diet Recommendation Model
- Purpose: Suggest eco-friendly diet plans
- Input: User preferences and dietary restrictions
- Output: Recommended food items and meal plans
- Architecture: Transformer-based NLP model

## Scripts
The following scripts will be developed:

### 1. Data Collection
- Web scraping for product information
- Dataset creation and preprocessing

### 2. Model Training
- Training scripts for each model
- Hyperparameter tuning
- Model evaluation

### 3. Model Conversion
- Convert TensorFlow models to TensorFlow Lite
- Quantization for mobile deployment
- Performance optimization

### 4. Model Evaluation
- Accuracy, precision, recall metrics
- Performance benchmarking
- A/B testing

## Development
To set up the development environment:

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run a training script
python scripts/train_product_recognition.py
```

## Deployment
Models are converted to TensorFlow Lite format and deployed to the mobile application. The conversion process includes:

1. Training the model in TensorFlow
2. Converting to TensorFlow Lite format
3. Optimizing for mobile deployment (quantization)
4. Integrating with the React Native application

## Performance Requirements
- Model size: ≤ 50 MB per model
- Inference time: ≤ 2 seconds on target devices
- Accuracy: ≥ 90% for product recognition, ≥ 95% for barcode scanning

## Future Improvements
- Implement federated learning for privacy-preserving model updates
- Explore more efficient model architectures
- Implement on-device model personalization
