# 🏋️ Spartan Fitness

A comprehensive fitness tracking mobile application built with React Native and Expo, designed to help users track their workouts, manage fitness packages, and monitor their progress.

## 📱 Features

### 🔐 Authentication & Onboarding
- **Onboarding Flow**: 3 introductory screens covering brand introduction, workout tracking overview, and package information
- **Multiple Login Options**:
  - Email + Password authentication via Firebase Auth
  - Google Sign-In integration
  - Facebook Sign-In integration
- **User Registration**: Complete signup flow with name, email, password validation
- **Password Recovery**: Email-based password reset functionality

### 🏠 Home Dashboard
- **Today's Workout Card**: Displays user's logged workouts for the current day
- **Package Information**: Shows package details including name, expiry date, remaining days, and renewal alerts
- **Quick Actions**: One-tap "Add Workout" button for immediate workout logging

### 💪 Workout Tracking
- **Add Workout**: Select exercises from library and log sets, reps, and duration
- **Workout History**: Complete log of previous workouts with dates and summaries
- **Weekly Summary**: Track total workouts completed each week
- **Progress Visualization**: Charts showing workout frequency and consistency

### 📚 Exercise Library
- **Predefined Exercises**: Comprehensive library including Pushups, Squats, Dumbbell Curls, and more
- **Flexible Views**: Grid and list view options for exercise browsing
- **Smart Search**: Filter exercises by muscle group and search functionality
- **Exercise Details**: Detailed descriptions and step-by-step instructions for each exercise

### 👤 Profile & Package Management
- **User Profile**: Manage personal information including name, photo, email, age, weight, and fitness goals
- **Package Tracking**: Monitor subscription packages with start/end dates and remaining days
- **Expiry Alerts**: Notifications when packages are close to expiration
- **Profile Updates**: Easy profile modification and photo upload

### 📊 Progress Tracking
- **Weekly Charts**: Visual representation of workouts logged per week
- **Monthly Summaries**: Comprehensive monthly workout completion statistics
- **Progress Analytics**: Track fitness journey and improvement over time

### ⚙️ Settings
- **Theme Toggle**: Switch between dark and light modes
- **Account Management**: Secure logout functionality for all authentication methods

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native with Expo for rapid development and testing
- **UI Library**: React Native Paper (Material Design components)
- **Charts**: React Native ChartKit for progress visualization
- **State Management**: Redux Toolkit for global state management

### Authentication
- **Firebase Authentication**
  - Email + Password login
  - Google SSO integration
  - Facebook SSO integration

### Backend & Data
- **Database**: Firebase Firestore for user data, workouts, packages, and progress tracking
- **Storage**: Firebase Storage for profile images and future workout demo videos

### Additional Services
- **Push Notifications**: Firebase Cloud Messaging (planned for future phases)
- **Analytics**: Firebase Analytics for feature usage tracking and user behavior analysis

### Development & Deployment
- **IDE**: VS Code with React Native Tools and Redux DevTools
- **Version Control**: GitHub
- **CI/CD**: Expo EAS for building and deploying to Play Store and App Store

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Firebase project setup
- Android Studio / Xcode (for device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spartan-fitness.git
   cd spartan-fitness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Set up Firebase project
   - Add configuration files
   - Enable Authentication and Firestore

4. **Start the development server**
   ```bash
   npx expo start
   ```

### Environment Setup
Create a `.env` file in the root directory with your Firebase configuration:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
```

## 📱 Supported Platforms
- iOS (via Expo)
- Android (via Expo)

## 🔧 Development

### Project Structure
```
spartan-fitness/
├── App.tsx                 # Main app component
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── assets/                # Images and static assets
```

### Available Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@spartanfitness.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Push notifications for workout reminders
- [ ] Social features and workout sharing
- [ ] Advanced analytics and insights
- [ ] Integration with fitness wearables
- [ ] Nutrition tracking features
- [ ] Personal trainer integration

---

**Built with ❤️ for fitness enthusiasts**
