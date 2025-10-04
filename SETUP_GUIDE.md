# 🚀 Spartan Fitness - Setup Guide

## 📋 Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Firebase project
- Google Cloud Console project
- Facebook Developer account (optional)

## 🔧 Configuration Steps

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google
   - Enable Facebook (if using)
4. Copy your Firebase config to `src/config/firebase.ts`

### 2. Google Authentication Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `https://auth.expo.io/@your-expo-username/spartan-fitness`
5. Copy the Client ID to `src/services/auth.ts` (line 32)

### 3. Facebook Authentication Setup (Optional)
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs
5. Copy App ID to `src/services/auth.ts` (line 48)
6. Update redirect URI with your Expo username

### 4. Environment Variables
Create a `.env` file in the root directory:
```
EXPO_USERNAME=your-expo-username
GOOGLE_WEB_CLIENT_ID=your-google-client-id
FACEBOOK_APP_ID=your-facebook-app-id
```

## 🏃‍♂️ Running the App

### Development
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

### Testing Authentication
1. **Email/Password**: Create account or use existing credentials
2. **Google Login**: Requires Google Client ID configuration
3. **Facebook Login**: Requires Facebook App ID configuration
4. **Forgot Password**: Tests Firebase password reset

## 📱 Features Implemented

### ✅ Onboarding Flow
- 3 intro screens (Brand, Workout Tracking, Package Info)
- Smooth navigation between screens
- Professional UI with Spartan Fitness branding

### ✅ Authentication
- Email/Password login with Firebase Auth
- Google Sign-In with Expo AuthSession
- Facebook Sign-In with Expo AuthSession
- User registration with validation
- Password reset functionality
- Automatic authentication state management

### ✅ Navigation
- Stack navigation with React Navigation
- Authentication state-based routing
- Loading screen during auth state check
- Clean navigation between auth screens

### ✅ UI/UX
- Dark theme with Spartan Fitness colors (#ff6b35)
- Material Design components (React Native Paper)
- Responsive design
- Professional loading states
- Error handling with user-friendly alerts

## 🔍 Troubleshooting

### Common Issues
1. **Google Login not working**: Check Client ID and redirect URI
2. **Facebook Login not working**: Verify App ID and redirect URI
3. **Firebase errors**: Ensure Firebase config is correct
4. **Navigation issues**: Check if all dependencies are installed

### Debug Steps
1. Check console logs for errors
2. Verify Firebase project settings
3. Test authentication methods individually
4. Check network connectivity

## 📚 Next Steps
- Implement workout tracking features
- Add exercise library
- Create user profile management
- Add progress tracking charts
- Implement package management

## 🆘 Support
For issues or questions, check the console logs and ensure all configuration steps are completed correctly.
