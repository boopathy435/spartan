import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, Chip, Button, ProgressBar, Divider, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkout, logWorkoutProgress, MemberProgress } from '../../services/workouts';
import { Workout } from '../../services/workouts';
import { setSelectedWorkout, addMemberProgress } from '../../store/slices/workoutsSlice';
import { RootState } from '../../store';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const MemberWorkoutsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const { selectedWorkout } = useSelector((state: RootState) => state.workouts);
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser.assignedPackage) {
      loadWorkouts();
    }
  }, [currentUser.assignedPackage]);

  const loadWorkouts = async () => {
    if (!currentUser.assignedPackage?.workouts) return;

    setLoading(true);
    try {
      const workoutPromises = currentUser.assignedPackage.workouts.map((workoutId: string) =>
        getWorkout(workoutId)
      );
      const workoutResults = await Promise.all(workoutPromises);
      const validWorkouts = workoutResults.filter(workout => workout !== null) as Workout[];
      setWorkouts(validWorkouts);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const handleStartWorkout = (workout: Workout) => {
    setSelectedWorkoutId(workout.id!);
    dispatch(setSelectedWorkout(workout));
    Alert.alert(
      'Start Workout',
      `Ready to start "${workout.title}"? This workout will take approximately ${workout.duration} minutes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          onPress: () => {
            // Navigate to workout execution screen
            Alert.alert('Workout Started', 'Feature coming soon!');
          },
        },
      ]
    );
  };

  const handleCompleteWorkout = async (workoutId: string) => {
    if (!currentUser.uid) return;

    Alert.alert(
      'Complete Workout',
      'Mark this workout as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              const progress: Omit<MemberProgress, 'id'> = {
                memberId: currentUser.uid!,
                workoutId: workoutId,
                completedAt: new Date() as any, // Will be converted to Timestamp in service
                notes: 'Workout completed successfully',
                rating: 5, // Default rating
              };

              await logWorkoutProgress(progress);
              setCompletedWorkouts(prev => new Set([...prev, workoutId]));
              dispatch(addMemberProgress(progress as MemberProgress));
              
              Alert.alert('Success', 'Workout marked as completed!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to log workout progress');
            }
          },
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return colors.success;
      case 'intermediate':
        return colors.warning;
      case 'advanced':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'strength':
        return colors.error;
      case 'cardio':
        return colors.info;
      case 'flexibility':
        return colors.success;
      case 'mixed':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const renderWorkoutCard = (workout: Workout) => {
    const isCompleted = completedWorkouts.has(workout.id!);
    
    return (
      <Card key={workout.id} style={styles.workoutCard}>
        <Card.Content>
          <View style={styles.workoutHeader}>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <Text style={styles.workoutDescription} numberOfLines={2}>
                {workout.description}
              </Text>
            </View>
            {isCompleted && (
              <IconButton
                icon="check-circle"
                iconColor={colors.success}
                size={24}
              />
            )}
          </View>

          <View style={styles.workoutDetails}>
            <View style={styles.chipsContainer}>
              <Chip
                style={[styles.chip, { backgroundColor: getDifficultyColor(workout.difficulty) }]}
                textStyle={styles.chipText}
              >
                {workout.difficulty}
              </Chip>
              <Chip
                style={[styles.chip, { backgroundColor: getCategoryColor(workout.category) }]}
                textStyle={styles.chipText}
              >
                {workout.category}
              </Chip>
              <Chip
                style={[styles.chip, { backgroundColor: colors.primary }]}
                textStyle={styles.chipText}
              >
                {workout.duration} min
              </Chip>
            </View>

            <View style={styles.exercisesInfo}>
              <Text style={styles.exercisesText}>
                {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            {isCompleted ? (
              <Button
                mode="contained"
                onPress={() => handleStartWorkout(workout)}
                style={[styles.actionButton, { backgroundColor: colors.success }]}
                compact
              >
                Repeat Workout
              </Button>
            ) : (
              <>
                <Button
                  mode="outlined"
                  onPress={() => handleCompleteWorkout(workout.id!)}
                  style={styles.actionButton}
                  compact
                >
                  Mark Complete
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleStartWorkout(workout)}
                  style={styles.actionButton}
                  compact
                >
                  Start Workout
                </Button>
              </>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderProgressOverview = () => {
    const totalWorkouts = workouts.length;
    const completedCount = completedWorkouts.size;
    const completionRate = totalWorkouts > 0 ? (completedCount / totalWorkouts) * 100 : 0;

    return (
      <Card style={styles.progressCard}>
        <Card.Content>
          <Text style={styles.progressTitle}>Package Progress</Text>
          
          <View style={styles.progressStats}>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{completedCount}</Text>
              <Text style={styles.progressLabel}>Completed</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{totalWorkouts}</Text>
              <Text style={styles.progressLabel}>Total</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{Math.round(completionRate)}%</Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
          </View>

          <ProgressBar
            progress={completionRate / 100}
            color={colors.primary}
            style={styles.progressBar}
          />

          <Text style={styles.progressText}>
            {completedCount} of {totalWorkouts} workouts completed
          </Text>
        </Card.Content>
      </Card>
    );
  };

  if (!currentUser.assignedPackage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Workouts</Text>
          <Text style={styles.subtitle}>Your assigned workout package</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No workout package assigned</Text>
          <Text style={styles.emptySubtext}>
            Contact your trainer to get assigned a workout package.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Workouts</Text>
        <Text style={styles.subtitle}>Your assigned workout package</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderProgressOverview()}

        <View style={styles.workoutsContainer}>
          <Text style={styles.workoutsTitle}>
            Workouts ({workouts.length})
          </Text>
          {workouts.map(renderWorkoutCard)}
        </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressCard: {
    margin: spacing.screenPadding,
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
    color: colors.primary,
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
  workoutsContainer: {
    padding: spacing.screenPadding,
  },
  workoutsTitle: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  workoutCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  workoutInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  workoutTitle: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  workoutDescription: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  workoutDetails: {
    marginBottom: spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chip: {
    marginBottom: spacing.xs,
  },
  chipText: {
    color: '#ffffff',
    fontSize: spacing.xs,
  },
  exercisesInfo: {
    alignItems: 'flex-end',
  },
  exercisesText: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});

export default MemberWorkoutsScreen;
