import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Avatar, FAB, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, uploadProfileImage } from '../../services/auth';
import { updateProfile } from '../../store/slices/userSlice';
import { RootState } from '../../store';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  const [displayName, setDisplayName] = useState(user.profile?.name || '');
  const [email, setEmail] = useState(user.profile?.email || '');
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your display name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(displayName, undefined, email);
      dispatch(updateProfile({ name: displayName, email }));
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUploading(true);
        try {
          const downloadURL = await uploadProfileImage(result.assets[0].uri, user.uid!);
          await updateUserProfile(undefined, downloadURL);
          dispatch(updateProfile({ photoURL: downloadURL }));
          
          Alert.alert('Success', 'Profile picture updated successfully!');
        } catch (error: any) {
          Alert.alert('Error', error.message || 'Failed to upload image');
        } finally {
          setImageUploading(false);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your account settings</Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={120}
                source={{ uri: user.profile?.photoURL || undefined }}
                style={styles.avatar}
              />
              <FAB
                icon="camera"
                size="small"
                style={styles.cameraFab}
                onPress={handleImagePicker}
                loading={imageUploading}
                disabled={imageUploading}
              />
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.profile?.name || 'No name set'}</Text>
              <Text style={styles.userEmail}>{user.profile?.email}</Text>
              <Text style={styles.userRole}>Role: {user.role}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.editCard}>
          <View style={styles.editSection}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            
            <TextInput
              label="Display Name"
              value={displayName}
              onChangeText={setDisplayName}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { primary: colors.primary } }}
            />
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              theme={{ colors: { primary: colors.primary } }}
            />

            <Button
              mode="contained"
              onPress={handleUpdateProfile}
              loading={loading}
              disabled={loading}
              style={styles.updateButton}
              contentStyle={styles.buttonContent}
            >
              Update Profile
            </Button>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = (colors: any, spacing: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.screenPadding,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: spacing.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: spacing.md,
    color: colors.textSecondary,
  },
  profileCard: {
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
  },
  profileSection: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  cameraFab: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: spacing.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  userEmail: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  userRole: {
    fontSize: spacing.sm,
    color: colors.primary,
    textTransform: 'capitalize',
  },
  editCard: {
    backgroundColor: colors.surface,
  },
  editSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    marginTop: spacing.md,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});

export default ProfileScreen;
