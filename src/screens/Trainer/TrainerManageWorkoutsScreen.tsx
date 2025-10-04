import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, FAB, Chip, Button, Searchbar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkoutsByTrainer, deleteWorkout, Workout } from '../../services/workouts';
import { setWorkouts, setLoading, setError } from '../../store/slices/workoutsSlice';
import { RootState } from '../../store';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const TrainerManageWorkoutsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const { workouts, loading, error } = useSelector((state: RootState) => state.workouts);
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentUser.uid) {
      loadWorkouts();
    }
  }, [currentUser.uid]);

  useEffect(() => {
    filterWorkouts();
  }, [searchQuery, workouts]);

  const loadWorkouts = async () => {
    if (!currentUser.uid) return;
    
    dispatch(setLoading(true));
    try {
      const workoutsData = await getWorkoutsByTrainer(currentUser.uid);
      dispatch(setWorkouts(workoutsData));
    } catch (error: any) {
      dispatch(setError(error.message || 'Failed to load workouts'));
      Alert.alert('Error', error.message || 'Failed to load workouts');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filterWorkouts = () => {
    if (!searchQuery.trim()) {
      setFilteredWorkouts(workouts);
      return;
    }

    const filtered = workouts.filter(workout =>
      workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWorkouts(filtered);
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWorkout(workoutId);
              loadWorkouts(); // Reload workouts
              Alert.alert('Success', 'Workout deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete workout');
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
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

  const renderWorkoutCard = (workout: Workout) => (
    <Card key={workout.id} style={styles.workoutCard}>
      <Card.Content>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>{workout.title}</Text>
            <Text style={styles.workoutDescription} numberOfLines={2}>
              {workout.description}
            </Text>
          </View>
          <IconButton
            icon="delete"
            iconColor={colors.error}
            onPress={() => handleDeleteWorkout(workout.id!)}
          />
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
          <Button
            mode="outlined"
            onPress={() => {
              // Navigate to edit workout screen
              Alert.alert('Edit Workout', 'Feature coming soon!');
            }}
            style={styles.actionButton}
            compact
          >
            Edit
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              // Navigate to workout details
              Alert.alert('View Workout', 'Feature coming soon!');
            }}
            style={styles.actionButton}
            compact
          >
            View
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Workouts</Text>
        <Text style={styles.subtitle}>Create and manage your workout routines</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search workouts..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            theme={{ colors: { primary: colors.primary } }}
          />
        </View>

        <View style={styles.workoutsContainer}>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              {filteredWorkouts.length} workout{filteredWorkouts.length !== 1 ? 's' : ''} found
            </Text>
            <Text style={styles.statsText}>
              {workouts.filter(w => w.category === 'strength').length} Strength
            </Text>
            <Text style={styles.statsText}>
              {workouts.filter(w => w.category === 'cardio').length} Cardio
            </Text>
          </View>

          {filteredWorkouts.map(renderWorkoutCard)}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          Alert.alert('Create Workout', 'Feature coming soon!');
        }}
      />
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
  searchContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  searchbar: {
    backgroundColor: colors.surface,
  },
  workoutsContainer: {
    padding: spacing.screenPadding,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statsText: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
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
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default TrainerManageWorkoutsScreen;
