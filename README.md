# EcoCatalyst: Accelerating Green Decisions

## Overview
EcoCatalyst is an Android application designed to help users make environmentally conscious decisions through various features including product sustainability scanning, eco-friendly alternative suggestions, carbon footprint tracking, AI-based diet planning, and gamified achievements.

## Core Features
1. **Product Sustainability Scanner** - Scan barcodes and recognize objects to assess product sustainability
2. **Eco-Friendly Alternative Suggester** - ML-based recommendations for more sustainable alternatives
3. **Carbon Footprint Tracker** - Track and analyze your carbon footprint with an analytics dashboard
4. **AI-Based Diet-Plan Chatbot** - NLP conversational agent for eco-friendly diet planning
5. **Gamified Achievements** - Track progress and earn achievements for sustainable choices

## Technical Stack
- **Platform**: React Native (Android ≥ API-26)
- **Backend**: Firebase (Auth, Realtime DB, Cloud Storage, Analytics)
- **ML/AI**: TensorFlow Lite (on-device ML) + OpenCV (vision)
- **Testing**: Jest (unit tests)
- **Version Control**: Git
- **Styling**: Material Design (Tailwind CSS planned)

## Non-Functional Requirements
- APK size ≤ 500 MB
- RAM usage ≤ 300 MB runtime
- Scan result time ≤ 4 seconds
- GDPR-compliant with encryption at rest & in transit
- Portrait orientation only
- WCAG 2.1 AA accessibility compliance
- 80% unit-test coverage
- Offline cache for last scans

## Project Structure
```
EcoCatalyst/
├── apps/
│   └── mobile/         # React Native Android app
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── screens/     # App screens
│       │   ├── services/    # API and service integrations
│       │   ├── utils/       # Utility functions
│       │   ├── assets/      # Images, fonts, etc.
│       │   ├── navigation/  # Navigation configuration
│       │   ├── hooks/       # Custom React hooks
│       │   └── contexts/    # React contexts
│       └── ...
├── packages/
│   └── ml/              # TensorFlow Lite models & scripts
│       ├── models/      # ML models
│       ├── scripts/     # Training and processing scripts
│       └── data/        # Training and test data
└── docs/                # Project documentation
```

## Getting Started
*Instructions for setting up the development environment will be added soon.*

## Documentation
Detailed documentation is available in the `/docs` directory.

## License
*License information will be added soon.*
