import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Chip, Button, ProgressBar, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getMemberProgress, type MemberProgress } from '../../services/workouts';
import { getMemberPackages } from '../../services/packages';
import { getPackage, getDaysUntilExpiry, isPackageExpired } from '../../services/packages';
import { setAssignedPackage } from '../../store/slices/userSlice';
import { RootState } from '../../store';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const MemberDashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  const [assignedPackage, setAssignedPackageState] = useState<any>(null);
  const [progress, setProgress] = useState<MemberProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedWorkouts: 0,
    completionRate: 0,
    daysUntilExpiry: 0,
  });

  useEffect(() => {
    if (currentUser.uid) {
      loadData();
    }
  }, [currentUser.uid]);

  useEffect(() => {
    calculateStats();
  }, [progress, assignedPackage]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (currentUser.uid) {
        const [memberPackages, memberProgress] = await Promise.all([
          getMemberPackages(currentUser.uid),
          getMemberProgress(currentUser.uid),
        ]);

        // Get the most recent active package
        const activePackage = memberPackages.find(mp => mp.isActive && !isPackageExpired(mp.expiresAt));
        
        if (activePackage) {
          const packageDetails = await getPackage(activePackage.packageId);
          setAssignedPackageState(packageDetails);
          dispatch(setAssignedPackage(packageDetails));
        }

        setProgress(memberProgress);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!assignedPackage) {
      setStats({
        totalWorkouts: 0,
        completedWorkouts: 0,
        completionRate: 0,
        daysUntilExpiry: 0,
      });
      return;
    }

    const totalWorkouts = assignedPackage.workouts?.length || 0;
    const completedWorkouts = progress.length;
    const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;
    
    // Calculate days until expiry (assuming 30 days for demo)
    const daysUntilExpiry = 30 - completedWorkouts; // Simple calculation

    setStats({
      totalWorkouts,
      completedWorkouts,
      completionRate,
      daysUntilExpiry: Math.max(0, daysUntilExpiry),
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStartWorkout = (workoutId: string) => {
    Alert.alert('Start Workout', 'Feature coming soon!');
  };

  const renderPackageCard = () => {
    if (!assignedPackage) {
      return (
        <Card style={styles.packageCard}>
          <Card.Content>
            <Text style={styles.packageTitle}>No Package Assigned</Text>
            <Text style={styles.packageDescription}>
              Contact your trainer to get assigned a workout package.
            </Text>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.packageCard}>
        <Card.Content>
          <View style={styles.packageHeader}>
            <Text style={styles.packageTitle}>{assignedPackage.name}</Text>
            <Chip style={styles.activeChip} textStyle={styles.activeChipText}>
              Active
            </Chip>
          </View>
          <Text style={styles.packageDescription}>{assignedPackage.description}</Text>
          
          <View style={styles.packageStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{assignedPackage.duration}</Text>
              <Text style={styles.statLabel}>Weeks</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.daysUntilExpiry}</Text>
              <Text style={styles.statLabel}>Days Left</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderProgressCard = () => (
    <Card style={styles.progressCard}>
      <Card.Content>
        <Text style={styles.progressTitle}>Progress Overview</Text>
        
        <View style={styles.progressStats}>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{stats.completedWorkouts}</Text>
            <Text style={styles.progressLabel}>Completed</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{stats.totalWorkouts}</Text>
            <Text style={styles.progressLabel}>Total</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>{Math.round(stats.completionRate)}%</Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
        </View>

        <ProgressBar
          progress={stats.completionRate / 100}
          color={colors.primary}
          style={styles.progressBar}
        />

        <Text style={styles.progressText}>
          {stats.completedWorkouts} of {stats.totalWorkouts} workouts completed
        </Text>
      </Card.Content>
    </Card>
  );

  const renderRecentProgress = () => {
    const recentProgress = progress.slice(0, 3);

    if (recentProgress.length === 0) {
      return (
        <Card style={styles.recentCard}>
          <Card.Content>
            <Text style={styles.recentTitle}>Recent Activity</Text>
            <Text style={styles.noActivityText}>No workouts completed yet</Text>
            <Button
              mode="contained"
              onPress={() => handleStartWorkout('')}
              style={styles.startButton}
            >
              Start Your First Workout
            </Button>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.recentCard}>
        <Card.Content>
          <Text style={styles.recentTitle}>Recent Activity</Text>
          {recentProgress.map((item, index) => (
            <View key={item.id}>
              <View style={styles.recentItem}>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentWorkout}>Workout #{index + 1}</Text>
                  <Text style={styles.recentDate}>
                    {item.completedAt.toDate().toLocaleDateString()}
                  </Text>
                </View>
                {item.rating && (
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>⭐ {item.rating}/5</Text>
                  </View>
                )}
              </View>
              {index < recentProgress.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Dashboard</Text>
        <Text style={styles.subtitle}>Track your fitness journey</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderPackageCard()}
        {renderProgressCard()}
        {renderRecentProgress()}
      </ScrollView>
    </SafeAreaView>
  );
};

const useStyles = (colors: any, spacing: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.lg,
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
  scrollView: {
    flex: 1,
  },
  packageCard: {
    margin: spacing.screenPadding,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  packageTitle: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  activeChip: {
    backgroundColor: colors.success,
  },
  activeChipText: {
    color: '#ffffff',
    fontSize: spacing.xs,
  },
  packageDescription: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  packageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: spacing.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
  },
  progressCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  progressTitle: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  progressLabel: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  progressText: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recentCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  recentTitle: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  noActivityText: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  recentInfo: {
    flex: 1,
  },
  recentWorkout: {
    fontSize: spacing.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  recentDate: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingText: {
    fontSize: spacing.sm,
    color: colors.warning,
  },
  divider: {
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});

export default MemberDashboardScreen;
