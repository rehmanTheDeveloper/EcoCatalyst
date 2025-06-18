# EcoCatalyst Manual Testing Plan

This document outlines the manual testing procedures for the EcoCatalyst mobile application. These tests should be performed to verify the functionality and user experience of the app.

## Prerequisites
- Expo Go installed on a mobile device or emulator
- Access to the EcoCatalyst repository
- Firebase credentials (if available)

## Test Cases

### 1. Authentication Flow

#### 1.1 User Registration
1. Launch the app
2. Navigate to the Register screen
3. Enter valid email, password, and display name
4. Submit the form
5. Verify successful registration and navigation to the main app

#### 1.2 User Login
1. Launch the app
2. Enter valid credentials on the Login screen
3. Submit the form
4. Verify successful login and navigation to the main app

#### 1.3 Password Reset
1. Launch the app
2. Navigate to the Forgot Password screen
3. Enter a valid email address
4. Submit the form
5. Verify success message

#### 1.4 Form Validation
1. Attempt to submit registration form with invalid email
2. Verify appropriate error message
3. Attempt to submit registration form with weak password
4. Verify appropriate error message
5. Attempt to submit login form with incorrect credentials
6. Verify appropriate error message

### 2. Product Scanner

#### 2.1 Scanner Interface
1. Navigate to the Scanner screen
2. Verify camera preview is displayed
3. Verify scan mode options (Barcode/Object) are available
4. Test switching between scan modes

#### 2.2 Barcode Scanning (if implemented)
1. Point camera at a product barcode
2. Verify scanning feedback
3. Verify product information is displayed
4. Verify sustainability score is calculated

#### 2.3 Object Scanning (if implemented)
1. Point camera at a product
2. Verify scanning feedback
3. Verify product identification
4. Verify sustainability information is displayed

#### 2.4 Alternative Suggestions
1. After scanning a product
2. Verify eco-friendly alternatives are suggested
3. Verify alternative product details are accessible

### 3. Carbon Footprint Tracker

#### 3.1 Footprint Dashboard
1. Navigate to the Footprint screen
2. Verify summary information is displayed
3. Verify category breakdown is displayed
4. Verify progress indicators are functional

#### 3.2 Adding Footprint Entries
1. Navigate to add a new footprint entry
2. Select category and activity type
3. Enter carbon amount and description
4. Submit the form
5. Verify entry appears in the list
6. Verify summary is updated

#### 3.3 Editing Footprint Entries
1. Select an existing footprint entry
2. Modify the details
3. Save changes
4. Verify changes are reflected
5. Verify summary is updated

#### 3.4 Deleting Footprint Entries
1. Select an existing footprint entry
2. Delete the entry
3. Verify entry is removed
4. Verify summary is updated

### 4. Diet Chatbot

#### 4.1 Chat Interface
1. Navigate to the Diet screen
2. Verify chat interface is displayed
3. Verify welcome message is shown

#### 4.2 Basic Queries
1. Ask about vegetarian diet
2. Verify appropriate response
3. Ask about meal planning
4. Verify appropriate response
5. Ask about environmental impact
6. Verify appropriate response

#### 4.3 Conversation Flow
1. Engage in a multi-message conversation
2. Verify context is maintained
3. Verify responses are relevant to previous messages

### 5. Gamification

#### 5.1 Achievements Dashboard
1. Navigate to the Profile or Achievements screen
2. Verify achievements are displayed
3. Verify progress indicators are functional

#### 5.2 Earning Achievements
1. Complete actions that should trigger achievements
2. Verify achievements are updated
3. Verify notifications or feedback is provided

### 6. Navigation and Integration

#### 6.1 Bottom Tab Navigation
1. Test navigation between all main tabs
2. Verify correct screen is displayed for each tab
3. Verify active tab is highlighted

#### 6.2 Home Screen Integration
1. Navigate to the Home screen
2. Verify recent footprint data is displayed
3. Verify recent scans are displayed
4. Verify achievements are displayed

#### 6.3 Data Persistence
1. Add data in various features
2. Close and reopen the app
3. Verify data is persisted

### 7. Offline Functionality

#### 7.1 Offline Mode
1. Enable airplane mode or disconnect from network
2. Test core app functionality
3. Verify appropriate feedback for operations requiring network
4. Verify local data is accessible

#### 7.2 Sync After Reconnection
1. Add data while offline
2. Reconnect to network
3. Verify data is synchronized

### 8. Performance

#### 8.1 Load Times
1. Measure app startup time
2. Measure screen transition times
3. Measure response time for data operations

#### 8.2 Resource Usage
1. Monitor memory usage during extended use
2. Verify app remains responsive during intensive operations

### 9. Accessibility

#### 9.1 Text Scaling
1. Increase device text size to maximum
2. Verify all text remains readable
3. Verify layouts accommodate larger text

#### 9.2 Color Contrast
1. Verify text has sufficient contrast against backgrounds
2. Verify interactive elements are distinguishable

#### 9.3 Screen Reader Compatibility
1. Enable screen reader
2. Navigate through the app
3. Verify all elements are properly announced

## Test Results Documentation

For each test case, document:
- Pass/Fail status
- Observed behavior
- Screenshots (if relevant)
- Environment details (device, OS version)
- Any unexpected behavior or issues

## Issue Reporting

For any issues found, document:
- Issue description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Severity (Critical, High, Medium, Low)
- Screenshots or recordings
