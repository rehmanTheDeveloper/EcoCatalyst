# EcoCatalyst Development Guide

## Development Environment Setup

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Android Studio
- JDK 11
- Python 3.8+ (for ML model development)
- TensorFlow 2.x
- Firebase CLI

### Setting Up the Development Environment

#### 1. Clone the Repository
```bash
git clone https://github.com/jz2ib/EcoCatalyst.git
cd EcoCatalyst
```

#### 2. Install Dependencies
```bash
# Install React Native dependencies
cd apps/mobile
npm install
# or
yarn install

# Install ML package dependencies
cd ../../packages/ml
pip install -r requirements.txt
```

#### 3. Configure Firebase
- Create a Firebase project in the Firebase Console
- Add an Android app to your Firebase project
- Download the `google-services.json` file and place it in `apps/mobile/android/app/`
- Configure Firebase services (Authentication, Realtime Database, Cloud Storage, Analytics)

#### 4. Run the Application
```bash
cd apps/mobile
npm run android
# or
yarn android
```

## Project Structure

### Mobile Application
```
apps/mobile/
├── android/               # Android native code
├── ios/                   # iOS native code (not used)
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens
│   ├── services/          # API and service integrations
│   ├── utils/             # Utility functions
│   ├── assets/            # Images, fonts, etc.
│   ├── navigation/        # Navigation configuration
│   ├── hooks/             # Custom React hooks
│   └── contexts/          # React contexts
├── __tests__/             # Jest tests
├── index.js               # Entry point
└── package.json           # Dependencies and scripts
```

### ML Package
```
packages/ml/
├── models/                # TensorFlow Lite models
├── scripts/               # Training and processing scripts
└── data/                  # Training and test data
```

## Coding Standards

### JavaScript/TypeScript
- Use TypeScript for type safety
- Follow the Airbnb JavaScript Style Guide
- Use ESLint and Prettier for code formatting
- Use functional components with hooks for React components
- Use async/await for asynchronous operations

### Python (ML Scripts)
- Follow PEP 8 style guide
- Use type hints
- Document functions and classes with docstrings
- Use virtual environments for dependency management

## Testing

### Unit Testing
- Write Jest tests for all components and services
- Aim for 80% code coverage
- Run tests before committing changes

```bash
cd apps/mobile
npm test
# or
yarn test
```

### ML Model Testing
- Evaluate models on test datasets
- Track metrics (accuracy, precision, recall, etc.)
- Compare against baseline models

## Deployment

### Building the APK
```bash
cd apps/mobile
npm run build:android
# or
yarn build:android
```

### Publishing to Google Play Store
- Generate a signed APK
- Create a Google Play Store listing
- Upload the APK to the Google Play Console

## Continuous Integration
- GitHub Actions for CI/CD
- Automated testing on pull requests
- Automated builds for release branches

## Contributing
- Create a new branch for each feature or bug fix
- Write descriptive commit messages
- Create pull requests for code review
- Ensure all tests pass before merging

## Resources
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TensorFlow Lite Documentation](https://www.tensorflow.org/lite)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
