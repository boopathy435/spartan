import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, FAB, Chip, Button, Searchbar, Menu, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, getUsersByRole, updateUserRole, UserRole, UserData } from '../../services/auth';
import { setMembers } from '../../store/slices/userSlice';
import { RootState } from '../../store';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const AdminDashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    trainers: 0,
    members: 0,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, selectedRole, users]);

  useEffect(() => {
    calculateStats();
  }, [users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.displayName?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const calculateStats = () => {
    const totalUsers = users.length;
    const admins = users.filter(u => u.role === 'admin').length;
    const trainers = users.filter(u => u.role === 'trainer').length;
    const members = users.filter(u => u.role === 'member').length;

    setStats({ totalUsers, admins, trainers, members });
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.uid === userId ? { ...user, role: newRole } : user
        )
      );

      Alert.alert('Success', `User role updated to ${newRole}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update user role');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return colors.error;
      case 'trainer':
        return colors.warning;
      case 'member':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const renderStatsCard = () => (
    <Card style={styles.statsCard}>
      <Card.Content>
        <Text style={styles.statsTitle}>User Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.error }]}>{stats.admins}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.trainers}</Text>
            <Text style={styles.statLabel}>Trainers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats.members}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderUserCard = (user: UserData) => (
    <Card key={user.uid} style={styles.userCard}>
      <Card.Content>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.displayName || 'No name'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <Chip
            style={[styles.roleChip, { backgroundColor: getRoleColor(user.role) }]}
            textStyle={styles.roleText}
          >
            {user.role}
          </Chip>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.actionsLabel}>Change Role:</Text>
          <View style={styles.roleButtons}>
            {(['member', 'trainer', 'admin'] as UserRole[]).map((role) => (
              <Button
                key={role}
                mode={user.role === role ? 'contained' : 'outlined'}
                onPress={() => handleRoleChange(user.uid, role)}
                style={[
                  styles.roleButton,
                  user.role === role && { backgroundColor: getRoleColor(role) }
                ]}
                disabled={user.role === role}
                compact
              >
                {role}
              </Button>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage users and system settings</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderStatsCard()}

        <View style={styles.filtersContainer}>
          <Searchbar
            placeholder="Search users..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            theme={{ colors: { primary: colors.primary } }}
          />
          
          <View style={styles.filterButtons}>
            {(['all', 'admin', 'trainer', 'member'] as const).map((role) => (
              <Button
                key={role}
                mode={selectedRole === role ? 'contained' : 'outlined'}
                onPress={() => setSelectedRole(role)}
                style={[
                  styles.filterButton,
                  selectedRole === role && { backgroundColor: colors.primary }
                ]}
                compact
              >
                {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
            ))}
          </View>
        </View>

        <View style={styles.usersContainer}>
          <Text style={styles.resultsCount}>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </Text>
          {filteredUsers.map(renderUserCard)}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Navigate to add user screen
          Alert.alert('Add User', 'Feature coming soon!');
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
  statsCard: {
    margin: spacing.screenPadding,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  statsTitle: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statNumber: {
    fontSize: spacing.xxl,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
  },
  filtersContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  searchbar: {
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
  },
  usersContainer: {
    padding: spacing.screenPadding,
  },
  resultsCount: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  userCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: spacing.md,
    color: colors.textSecondary,
  },
  roleChip: {
    alignSelf: 'flex-start',
  },
  roleText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  actionsContainer: {
    marginTop: spacing.md,
  },
  actionsLabel: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleButton: {
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

export default AdminDashboardScreen;
