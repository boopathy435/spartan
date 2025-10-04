import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, Button, Card, Chip, Searchbar, Menu, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateUserRole, UserRole, UserData } from '../../services/auth';
import { updateRole } from '../../store/slices/userSlice';
import { RootState } from '../../store';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const AdminManageUsersScreen: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

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
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
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

      // If updating current user's role, update Redux
      if (userId === currentUser.uid) {
        dispatch(updateRole(newRole));
      }

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
        <Text style={styles.title}>Manage Users</Text>
        <Text style={styles.subtitle}>Admin panel for user role management</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search users..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          theme={{ colors: { primary: colors.primary } }}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users found matching your search' : 'No users found'}
            </Text>
          </View>
        ) : (
          <View style={styles.usersContainer}>
            <Text style={styles.resultsCount}>
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </Text>
            {filteredUsers.map(renderUserCard)}
          </View>
        )}
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
  searchContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  searchbar: {
    backgroundColor: colors.surface,
  },
  scrollView: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default AdminManageUsersScreen;
